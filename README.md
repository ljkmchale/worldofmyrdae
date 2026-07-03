# World of Myrdae

Interactive fantasy world map editor and viewer for a D&D campaign setting. The app is plain HTML, CSS, and vanilla JavaScript hosted by a local Node.js service with an embedded SQLite database.

## Quick Start

Run the local web app:

```powershell
npm run start
```

Open:

- `http://localhost:3000/editor.html` - world editor
- `http://localhost:3000/map.html` - main interactive world map
- `http://localhost:3000/embed-map.html` - embeddable world map
- `http://localhost:3000/city-viewer.html?city=tratta` - unified city map viewer
- `http://localhost:3000/map-3d-planet.html` - 3D globe prototype

Start the map editor for the Cloudflare tunnel:

```powershell
npm run share:map-editor
```

The shared editor URL is `https://mapeditor.suwaneegamers.net`; see `docs/MAP_EDITOR_CLOUDFLARE.md`.
The tunnel forwards to the local map editor server on port `4615`.

## Architecture

The main world data source is the local `data/myrdae.db` SQLite database. It stores:

- `locations`
- `roads`
- `locations.region` names and `type=region` label records
- `underdark` (`mapImage` plus its own `locations` and `roads`)

The usual runtime flow is:

1. `lib/world-store.js` initializes SQLite and migrates `js/locations-db.js` only when the database is empty.
2. `server.js` exposes `GET/PUT /api/world-data`.
3. `js/campaign-data.js` loads the active realm and dispatches update events.
4. `js/map-realms.js` switches the active Surface/Underdark artwork and dataset.
5. `js/map-overlay.js` renders SVG labels, markers, roads, tooltips, and route metadata over the active map image.
6. Feature modules extend the viewer:
   - `js/boat-animations.js`
   - `js/dragon-overlay.js`
   - `js/world-clock.js`
   - `js/location-search.js`
   - `js/map-measure.js`
   - `js/ocean-shader.js`
   - `js/coord-grid.js`
7. `js/editor.js` keeps separate Surface/Underdark edit state, previews unsaved changes, and saves through the local database API.
8. `lib/google-sheets-sync.js` can mirror map locations to a Google Sheet when the server has a sheet ID and service-account credentials.

## Important Files

### World map

- `map.html` - primary interactive viewer
- `embed-map.html` - iframe-friendly viewer with nearly the same feature set
- `editor.html` - large all-in-one editing UI
- `js/map.js` - pan and zoom controller
- `js/map-overlay.js` - overlay renderer and tooltip logic
- `js/map-realms.js` - Surface/Underdark visual and dataset switching
- `lib/world-store.js` - SQLite schema and transactional storage
- `js/locations-db.js` - initial migration seed and compatibility snapshot

### City maps

- `city-viewer.html` - single city map shell
- `js/city-maps.js` - thin city registry with IDs and image paths
- `js/cities/<city-id>.js` - per-city pins and labels, loaded on demand
- `images/cities/<city-id>/` - map images and generated assets for each city

### Time / campaign sync

- `js/world-clock.js` - Myrdae calendar model and UI wheel
- `data/campaign-clock-links.json` - campaign anchors and Google Doc links
- `server.js` - syncs campaign anchors from Google Docs

### Local server data

- `data/myrdae.db` - authoritative local world database; intentionally ignored by git
- `MYRDAE_DATA_DIR` - optional environment override for mutable server data
- Generated render/export output belongs in `exports/`, which is ignored and should not be committed.

## Data Model Notes

### Locations

Common fields:

- `id`, `name`, `type`, `x`, `y`, `region`, `description`
- optional display fields like `fontSize`, `markerSize`, `labelOffsetX`, `labelOffsetY`, `rotation`, `opacity`
- some locations also carry richer metadata such as `details`, `link`, `cityMap`, or biome/water tooltip info

### Roads

The current code accepts both legacy and modern road shapes:

- `points`: mixed array of location IDs and `[x, y]` coordinate pairs
- `waypoints`: older array of point objects still supported by overlay helpers
- SQLite stores route geometry in `road_points`; the public API still returns `points` for the editor and map overlay.

Important road types include:

- `major`
- `minor`
- `river`
- `border`
- `water-route`

Water routes also power animated boats and can include ship metadata like `shipName`, `shipType`, `captainName`, `cargo`, and `riskLevel`.

### City data

Each `js/cities/<city-id>.js` module registers into `window.CITY_MAPS_REGISTRY[cityId]` and usually contains:

- `id`, `name`, `image`, `previewImage`
- `pins`
- `namedLabels`

## Persistence Rules

This repo intentionally does not use browser `localStorage` as the source of truth. `USE_LOCAL_STORAGE` in `js/campaign-data.js` is disabled by default.

Edits are persisted by the Node server:

- world data writes transactionally to `data/myrdae.db`
- city registry writes back to `js/city-maps.js`
- city detail files write to `js/cities/<city-id>.js`
- city images live under `images/cities/<city-id>/`

The database and other mutable files can be relocated with `MYRDAE_DATA_DIR` for server backups or service isolation.

## Database Schema And Migrations

`data/myrdae.db` is currently schema version `3`. The public API still returns the same world JSON shape, but the `locations` table now keeps first-class typed columns for current Map Editor location fields and Google Sheet synchronization. The `disposition` column accepts `hostile`, `neutral`, or `friendly` and defaults to `neutral`. For locations, those typed SQLite columns are the source of truth. `data_json` remains only as a compatibility cache so existing `/api/world-data`, map overlay, and editor code can keep consuming the same object shape.

- stable key: `(realm_id, id)`
- required map fields: `name`, `type`, `x`, `y`, `sort_order`
- editor attribute fields: `description`, `city_map`, `link`, `biome`, `details`, `city_scene`, `tooltip_image`, `font_family`, `font_size`, `font_weight`, `font_style`, `marker_size`, marker/label offsets, `label_align`, `rotation`, `opacity`, `text_curve`, `hide_label`
- sync fields: `external_sheet_id`, `sheet_row_id`, `last_synced_at`, `last_modified_at`, `modified_source`, `sync_status`, `deleted_at`
- timestamps: `created_at`, `updated_at`
- lookup tables: `location_types`, `road_types`, `sync_statuses`

Use these commands for database work:

- `npm run db:backup` - create a SQLite snapshot under `backups/`
- `npm run db:migrate:v2` - apply the reversible v2 location-schema migration
- `npm run db:migrate:v2:down` - restore the preserved legacy locations table from the v2 migration
- `npm run db:validate` - validate map data plus schema/integrity checks
- `npm run db:integrity` - run only schema/integrity checks
- `npm test` - run database and sync helper tests

The v2 migration preserves the previous locations table as `locations_legacy_<timestamp>` so rollback is possible without deleting production data.

Road `name` values are intentionally optional. A road name is a map label: the renderer only draws the label when `road.name` is present, and unnamed roads remain valid as long as their `id`, `type`, and ordered `points` data are intact. Do not auto-fill blank road names during validation or migration.

Roads also use typed SQLite columns for advanced editor/display data such as `curved`, `color`, `width`, `font_family`, `font_size`, `font_style`, `label_offset`, `label_reverse`, `label_side`, and water-route ship fields (`ship_name`, `ship_type`, `captain_name`, `cargo`, `risk_level`, `route_purpose`, `boat_color`, `boat_size_multiplier`). The `roads.data_json` value is a compatibility cache, not the authoritative road source.

There is no active independent regions table or `regions` collection. Map regions live as location metadata: `locations.region` powers filtering/grouping, and `type=region` location records draw region labels on the map.

## Notable Server Endpoints

`server.js` is both a static file server and the write API. Key routes:

- `GET /api/world-data` - read Surface and Underdark from SQLite
- `PUT /api/world-data` - save both realms transactionally
- `GET /api/sheets-sync/status` - report Google Sheet sync configuration, last run, conflicts, and validation failures
- `POST /api/sheets-sync/export` - export all database-backed map locations to the configured Google Sheet
- `POST /api/sheets-sync/sync` - import valid Sheet edits, resolve deletes, write the database, and refresh the Sheet
- `POST /save` - legacy compatibility route backed by SQLite
- `POST /save-city/:cityId` - save a city module in `js/cities/`
- `POST /save-city-map` - save `js/city-maps.js`
- `POST /api/cities/scaffold` - create city folders and starter files
- `POST /api/cities/upload-image` - upload a city image
- `GET /api/city-images` - discover available city image folders
- `GET /api/world-clock/campaigns` - load campaign anchors
- `POST /api/world-clock/sync` - refresh anchors from Google Docs
- `GET/POST /api/ai/comfy-proxy` - proxy ComfyUI requests
- `POST /api/ai/upload-to-comfy` - upload images to ComfyUI
- `POST /api/ai/save-image` - persist AI output to a city image folder
- `GET /api/ai/fetch-google-doc` - fetch Google Doc text
- `GET /api/ai/parse-gazetteer` - parse a gazetteer doc into city assets/data
- `POST /api/ai/summarize` - Gemini-backed summarization helper

## Google Sheet Location Sync

Location sync is optional and is disabled until these environment variables are available to `server.js`:

- `MYRDAE_GOOGLE_SHEET_ID` - target Google Spreadsheet ID
- `MYRDAE_GOOGLE_API_KEY` or `GOOGLE_API_KEY` - optional API key for Google project identification/read-only API paths
- `MYRDAE_GOOGLE_SERVICE_ACCOUNT_EMAIL` and `MYRDAE_GOOGLE_PRIVATE_KEY` - service-account credentials, or `MYRDAE_GOOGLE_SERVICE_ACCOUNT_FILE` / `GOOGLE_APPLICATION_CREDENTIALS`
- `MYRDAE_SHEETS_SYNC_TIMES` - comma-separated local server times for scheduled syncs, default `06:00,18:00`

The target spreadsheet must be shared with the service-account email. Enabling the Google Sheets API and adding an API key is necessary for the Google project, but an API key alone cannot write Sheet data. Two-way sync needs service-account or OAuth-style write credentials. The server creates/uses a `Locations` tab with stable `realm` + `id` keys, timestamps, source tracking, row hashes, validation status, and conflict messages. Set `deleted` to `TRUE` in a row to remove that location during the next sync. Export is guarded: it reads the live Sheet first and refuses to clear/rewrite the tab when unsynced Sheet edits are detected.

The Sheet exposes current Map Editor location attributes as direct columns, including `biome`, `disposition`, `details`, `cityScene`, `tooltipImage`, `fontFamily`, `fontSize`, `fontWeight`, `fontStyle`, `markerSize`, marker/label offsets, `labelAlign`, `rotation`, `opacity`, `textCurve`, and `hideLabel`. `disposition` accepts `hostile`, `neutral`, or `friendly`. The sync no longer uses `detailsJson` or `displayJson`.

Scheduled sync runs at the configured daily times, validates Sheet rows before writing SQLite, records sync status in SQLite metadata, appends `.runtime/sheets-sync-log.jsonl`, and exposes failures through the Map Editor Sheet Sync status line and alert. If conflicts or invalid rows are found, sync stops before rewriting the Sheet so user-entered Sheet values are preserved for review.

## Working Conventions

- Before making significant edits to `js/locations-db.js`, create a backup in `backups/`.
- Do not edit files inside `backups/`; they are snapshots.
- Avoid adding npm dependencies unless there is a strong reason.
- `map-viewer.html` is a small coordinate helper page, not the main viewer.
- Generated/local folders such as `dist/`, `exports/`, `tools/`, `ue5-exports/`, `session-notes/`, and `node_modules/` are intentionally kept out of normal source work.
- Source cleanup should preserve the current `city-viewer.html` city-map flow and SQLite-backed server persistence.

## Current Gaps

- A lot of editor behavior lives inline in `editor.html` plus `js/editor.js`, so UI changes often require checking both.
- Historical standalone city pages and helper files have been retired; the current city flow is centered on `city-viewer.html` plus `js/city-maps.js` and `js/cities/`.
