# World of Myrdae - Codex Guide

## What This Project Is

An interactive fantasy world map editor and viewer for the D&D setting of Myrdae. The app is a zero-framework HTML/CSS/vanilla-JS site hosted by the local Node.js service.

## Running The Project

```bash
node server.js
```

or:

```bash
npm run start
```

Primary pages:

- `http://localhost:3000/editor.html` - world editor
- `http://localhost:3000/map.html` - main interactive world map
- `http://localhost:3000/embed-map.html` - embeddable world map
- `http://localhost:3000/city-viewer.html?city=tratta` - unified city map viewer
- `http://localhost:3000/map-3d-planet.html` - 3D globe prototype
- `http://localhost:3000/map-viewer.html` - coordinate helper/debug page

Windows notes:

- Use PowerShell from this repo root: `C:\Users\Larry McHale\Desktop\WorldofMyrdae`.
- If PowerShell blocks `npm.ps1`, run `npm.cmd run <script>` instead.
- If `rg` fails with `Access is denied`, use PowerShell `Get-ChildItem` / `Select-String` for repo searches.
- The local web server normally runs on `localhost:3000`; use that for browser smoke tests after map/editor UI changes.

## Architecture

### World data flow

1. `data/myrdae.db` is the local SQLite source of truth for Surface and Underdark locations, roads, location region names, region-label locations, and map settings.
2. `server.js` exposes that data through `GET/PUT /api/world-data`; `js/locations-db.js` is only the initial migration seed and generated compatibility route.
3. `js/campaign-data.js` wraps the active realm data and emits `campaign-data-updated` / `metric-changed` events.
4. `js/map-realms.js` switches Surface/Underdark artwork and active data without mixing their records.
5. `js/map-overlay.js` renders SVG roads, markers, labels, tooltips, route info, and location interactions over the active map image.
6. Viewer feature modules plug into that layer:
   - `js/boat-animations.js`
   - `js/dragon-overlay.js`
   - `js/world-clock.js`
   - `js/location-search.js`
   - `js/map-measure.js`
   - `js/ocean-shader.js`
   - `js/coord-grid.js`
7. `js/editor.js` manages separate Surface/Underdark editor state, previews unsaved changes, and persists both through the database API.
8. `lib/google-sheets-sync.js` can mirror map locations to a connected Google Sheet when the server has a spreadsheet ID and service-account credentials.

### City map flow

1. `js/city-maps.js` is only a thin registry of city IDs, names, and image paths.
2. `city-viewer.html` loads a selected city and then fetches `js/cities/<city-id>.js` on demand.
3. Each `js/cities/<city-id>.js` file registers into `window.CITY_MAPS_REGISTRY`.
4. City assets live under `images/cities/<city-id>/`.

### Server persistence flow

1. `lib/world-store.js` owns the SQLite schema and transactional reads/writes.
2. The database lives at `data/myrdae.db` under the configured server data root.
3. `MYRDAE_DATA_DIR` can relocate local mutable data without changing the application source.

## Key Files

| File | Purpose |
|------|---------|
| `data/myrdae.db` | local authoritative world database (ignored by git) |
| `lib/world-store.js` | SQLite schema, migration, and transactional storage |
| `js/locations-db.js` | one-time legacy migration seed only; not loaded by any page |
| `js/city-maps.js` | city registry with image paths |
| `js/cities/*.js` | per-city pins and labels |
| `js/map-overlay.js` | overlay rendering, roads, tooltips, route graph helpers |
| `js/map-realms.js` | Surface/Underdark image and data switching |
| `js/editor.js` | editor state, drafts, placement mode, save flows |
| `lib/google-sheets-sync.js` | optional Google Sheets location export/import and conflict handling |
| `js/world-clock.js` | Myrdae calendar model and wheel UI |
| `js/ocean-shader.js` | WebGL2 ocean rendering, wave motion, and shoreline foam |
| `js/map-measure.js` | viewer distance measurement UI |
| `js/location-search.js` | search/filter interactions in the viewer |
| `server.js` | static serving plus save, city, world clock, and AI endpoints |
| `data/campaign-clock-links.json` | campaign anchors and Google Doc sync targets |

## Directory Map

Active runtime/source folders:

- `css/` - shared styling, including the dark fantasy theme.
- `data/` - campaign clock link data and other small runtime data files.
- `lib/` - server-side storage modules.
- `vendor/` - locally served fonts, icons, and rendering libraries.
- `fonts/` - local font assets referenced by CSS.
- `images/cities/` - city map images, crests, sketches, and generated city assets.
- `images/city-scenes/` - scene assets used by `city-scene.html` / `js/city-scene-data.js`.
- `images/map-layers/` - layered world map imagery used by map/editor pages.
- `images/tooltips/` - biome, water, city type, landmark, and ship tooltip imagery.
- `js/` - application logic; `js/cities/` and `js/overlay/` are active submodules.

Generated, local, or tooling folders:

- `.agents/` - Codex skill definitions for this repo. Useful to agents, not app runtime.
- `.claude/` - Claude/local tooling and worktrees. Not app runtime; worktree folders may be locked by running Claude sessions.
- `backups/` - local safety snapshots; intentionally ignored by git.
- `docs/` - project notes and Unreal/export documentation.
- `exports/` - generated render/export artifacts; ignored by git and may be absent locally.
- `node_modules/` - installed dependencies.
- `scripts/` - manual image-processing scripts.
- `session-notes/` - local transcript/voice-test artifacts; not app runtime.
- `tools/` - UE/helper scripts; ignored by git.
- `ue5-exports/` - Unreal export assets; ignored by git.

Known cleanup candidates:

- `images/myrdae-map-layers/` is currently empty.
- `images/generic towns/` currently has a large generated image with no app references found.

## Data Model Notes

### `WORLD_LOCATIONS`

```js
{
  locations: [
    {
      id: "lurdoba",
      name: "Lurdoba",
      type: "city",
      x: 77.7,
      y: 31.7,
      region: "Otesurr Mountains",
      description: "...",
      fontSize: 18,
      markerSize: 0.2
      // optional display/meta fields:
      // fontFamily, fontWeight, fontStyle, labelOffsetX, labelOffsetY,
      // markerOffsetX, markerOffsetY, rotation, opacity, textCurve,
      // labelAlign, hideLabel, cityMap, details, link
    }
  ],
  roads: [
    {
      id: "road-id",
      name: "Road Name",
      type: "major",
      points: ["loc-a", [40.5, 20.1], "loc-b"],
      curved: true
      // legacy `waypoints` arrays are still supported in some code paths
    }
  ],
  underdark: {
    mapImage: "images/myrdae-map-layers/underdark-map.png",
    locations: [],
    roads: []
  }
}
```

Important current road types include:

- `major`
- `minor`
- `river`
- `border`
- `water-route`

Water routes can also carry ship metadata like `shipName`, `shipType`, `captainName`, `cargo`, `riskLevel`, and size/color overrides.

### City modules

Each `js/cities/<id>.js` typically exports:

- `id`, `name`, `image`, `previewImage`
- `pins`
- `namedLabels`

## Persistence And Mutable Files

`js/campaign-data.js` still contains optional `localStorage` support, but it is intentionally disabled. Persistent world edits go through `/api/world-data` and land transactionally in SQLite.

Writable content:

- `data/myrdae.db` (world locations, roads, location region names, region-label locations, and realm settings)
- Google Sheets sync metadata in SQLite `world_meta` when sheet sync is configured
- `js/city-maps.js`
- `js/cities/<city-id>.js`
- `images/cities/<city-id>/...`
- `data/campaign-clock-links.json`

The service uses the repo root as its default data root. Set `MYRDAE_DATA_DIR` to relocate the database and other mutable content.

## Important Server Routes

`server.js` is not just a static server. It also owns the write API and helper endpoints:

- `GET /api/world-data` - read both Surface and Underdark from SQLite
- `PUT /api/world-data` - transactionally save both realms to SQLite
- `GET /api/sheets-sync/status` - report Google Sheet sync configuration, last run, conflicts, and validation failures
- `POST /api/sheets-sync/export` - export all database-backed map locations to the configured Google Sheet
- `POST /api/sheets-sync/sync` - import valid Sheet edits, delete flagged rows, update SQLite, and refresh the Sheet
- `POST /save` - legacy compatibility route that now writes SQLite
- `POST /save-city/:cityId` - save a per-city JS module
- `POST /save-city-map` - save the city registry
- `POST /api/cities/scaffold` - create starter city files/folders
- `POST /api/cities/upload-image` - upload a city image into `images/cities/<id>/`
- `GET /api/city-images` - discover available city image folders
- `GET /api/world-clock/campaigns` - return campaign anchors
- `POST /api/world-clock/sync` - refresh campaign anchors from linked Google Docs
- `GET/POST /api/ai/comfy-proxy` - proxy ComfyUI requests
- `POST /api/ai/upload-to-comfy` - upload images to ComfyUI
- `POST /api/ai/save-image` - store generated city images
- `GET /api/ai/fetch-google-doc` - fetch document text
- `GET /api/ai/parse-gazetteer` - parse Google Doc HTML into city assets/data
- `POST /api/ai/summarize` - Gemini-backed summarization helper

## Editor Internals (`js/editor.js`)

Sheet sync UI lives in the existing editor hero action area. It adds Export Sheet / Sync Sheet controls and a compact status line without changing the map/editor layout. Scheduled sync times come from `MYRDAE_SHEETS_SYNC_TIMES`, a comma-separated local-time list such as `06:00,18:00`.

The `Locations` Sheet should be user-friendly: current location attributes are direct columns (`biome`, `disposition`, `details`, `cityScene`, `tooltipImage`, typography, marker offsets, label offsets, `labelAlign`, `rotation`, `opacity`, `textCurve`, `hideLabel`). `disposition` is one of `hostile`, `neutral`, or `friendly` and defaults to `neutral`. Do not reintroduce `detailsJson` or `displayJson` unless the data model gains open-ended custom fields again.

Do not let export blindly overwrite live Sheet edits. `POST /api/sheets-sync/export` must read the live `Locations` tab first and block when unsynced Sheet changes are present. `POST /api/sheets-sync/sync` must preserve Sheet-entered values when conflicts or invalid rows are detected; report the failure instead of rewriting the Sheet from SQLite.

Database schema version `3` keeps the `/api/world-data` JSON contract stable while making storage stricter. For locations, typed SQLite columns are authoritative for Map Editor fields: `description`, `city_map`, `link`, `biome`, `disposition`, `details`, `city_scene`, `tooltip_image`, `font_family`, `font_size`, `font_weight`, `font_style`, `marker_size`, marker/label offsets, `label_align`, `rotation`, `opacity`, `text_curve`, and `hide_label`. `disposition` accepts `hostile`, `neutral`, or `friendly` and defaults to `neutral`. Roads also use typed columns for advanced display/route/ship fields: `curved`, `color`, `width`, `font_family`, `font_size`, `font_style`, `label_offset`, `label_reverse`, `label_side`, `boat_color`, `boat_size_multiplier`, `captain_name`, `cargo`, `risk_level`, `route_purpose`, `ship_name`, and `ship_type`; ordered route geometry is normalized into `road_points`. `data_json` is only a compatibility cache for the existing API/editor/map object shape, not the source of truth. `locations` also has typed sync/timestamp columns (`external_sheet_id`, `sheet_row_id`, `last_synced_at`, `last_modified_at`, `modified_source`, `sync_status`, `deleted_at`, `created_at`, `updated_at`) plus lookup tables (`location_types`, `road_types`, `sync_statuses`). The version-2 migration remains `node scripts/migrate-world-db-v2.js up`; opening the database with the current server adds the version-3 disposition field. Use `npm run db:integrity` for schema/index/sync-field checks and `npm test` for the DB/sync regression suite.

Road `name` is optional by design. It controls whether a label is drawn on the map; unnamed roads are valid and should not be auto-filled. Road identity and routing depend on `id`, `type`, and ordered `points`/`waypoints`.

State that matters during future edits:

| State property | Purpose |
|---|---|
| `selectedLocId` | current location selection; `'__preview__'` when placing a new draft location |
| `selectedRoadId` | current road selection |
| `locationDraft` | unsaved location form state |
| `roadDraft` | unsaved road form state |
| `locationDraftOriginalId` | original ID when editing/renaming |
| `roadDraftOriginalId` | original road ID when editing/renaming |
| `regionFilter` / `typeFilter` / `roadRegionFilter` | active list filters |
| `locationPlacementMode` | whether map clicks should create a new location |
| `moveLocationMode` | whether dragging/reposition behavior is enabled |
| `isNewPreview` | whether the preview location is currently a temporary ghost |

Important behaviors:

- New locations are staged as a ghost `__preview__` item before the first save.
- The editor replaces `window.CampaignData` with a render-state bridge so the overlay can preview unsaved edits.
- Keyboard shortcuts exist for search (`/`), undo/redo, save, cancel, and arrow-key nudging.

## Backup System

Backups of key files are stored in `/backups/` with timestamps.

Before making significant changes to `js/locations-db.js`, create a backup.

Use the `/backup` skill.

`backups/` is local-only and should stay out of git.

## Common Tasks

### Add a new location

Use `editor.html` so the location is saved through the local database API. `js/locations-db.js` is no longer the live source of truth.

### Add or edit a city map

- scaffold/update the city in `js/city-maps.js`
- edit `js/cities/<city-id>.js`
- place assets in `images/cities/<city-id>/`
- verify in `city-viewer.html?city=<id>`
- after importing city assets, make sure tooltip previews/crests resolve through `js/city-maps.js` and `js/overlay/tooltip.js`

### Validate the world database

Use `/validate-db` for duplicate IDs, invalid coordinates, and reference issues.

For schema and synchronization metadata checks, run `npm run db:integrity` as well. After database or Sheet sync changes, run `npm test`.

### Sort locations

Use `/sort-locations` after bulk additions if ordering drift matters.

## Style Notes

- Dark fantasy aesthetic lives mostly in `css/styles.css`
- Main palette includes `--bg-primary: #050508`, `--gold: #d4af37`, `--crimson: #dc143c`
- Fonts center on Cinzel and Cormorant Garamond
- No bundler and no build step for normal web development

## Verification Notes

- For data-only edits, at minimum parse or load the edited JS/JSON and check for duplicate IDs or broken references.
- For editor interaction work, test the exact interaction in `http://localhost:3000/editor.html`.
- For viewer changes, smoke test `map.html` and `embed-map.html` when shared overlay code changes.
- For city map changes, smoke test `city-viewer.html?city=<id>`.
- For database/server changes, verify migration, `/api/world-data`, and a write/read round trip against a temporary data root.
- For Google Sheets sync changes, verify unconfigured status handling locally and schedule metadata via `/api/sheets-sync/status`. Live sync requires `MYRDAE_GOOGLE_SHEET_ID` plus service-account credentials shared on the target Sheet.
- For schema changes, run `npm run db:counts`, `npm run db:validate`, `npm run db:integrity`, `npm test`, and a Google Sheet export/sync verification when credentials are available.

## What Not To Do

- Do not switch persistence back to `localStorage`
- Do not add npm dependencies casually
- Do not edit files inside `backups/`
- Do not commit generated/local folders such as `dist/`, `exports/`, `tools/`, `ue5-exports/`, `session-notes/`, or `.claude/worktrees/`
- Do not write live world edits back into `js/locations-db.js`; SQLite is authoritative.
- Do not assume standalone `city-*.html` pages are the primary city flow; the current system is `city-viewer.html` plus `js/city-maps.js` and `js/cities/`
