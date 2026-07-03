# World of Myrdae - Claude Code Guide

## What This Project Is

An interactive fantasy world map editor and viewer for Myrdae. The zero-framework HTML/CSS/JS app is hosted by the local Node service and persists world data in SQLite.

## Running The Project

```bash
node server.js
```

or:

```bash
npm run start
```

Useful pages:

- `http://localhost:3000/editor.html`
- `http://localhost:3000/map.html`
- `http://localhost:3000/embed-map.html`
- `http://localhost:3000/city-viewer.html?city=tratta`
- `http://localhost:3000/map-3d-planet.html`
- `http://localhost:3000/map-viewer.html`

## Architecture

### Main world flow

1. `data/myrdae.db` is the local source of truth; `lib/world-store.js` owns its schema.
2. `server.js` exposes world data through `GET/PUT /api/world-data`.
3. `js/campaign-data.js` loads the active Surface or Underdark realm and emits update events.
4. `js/map-overlay.js` renders the visual overlay on top of the active map image.
5. Additional viewer systems hook into the same page:
   - `js/boat-animations.js`
   - `js/dragon-overlay.js`
   - `js/world-clock.js`
   - `js/location-search.js`
   - `js/map-measure.js`
   - `js/ocean-shader.js`
   - `js/coord-grid.js`
6. `js/editor.js` keeps a cloned local editing state, previews unsaved changes, and saves through the database API.

### City map flow

1. `js/city-maps.js` stores a thin index of cities and image paths.
2. `city-viewer.html` loads a city by ID.
3. `js/cities/<id>.js` registers detailed pins/labels into `window.CITY_MAPS_REGISTRY`.
4. `images/cities/<id>/` stores the visual assets for that city.

### Server data flow

1. SQLite lives at `data/myrdae.db` under the active data root.
2. The legacy `js/locations-db.js` file is used only to seed an empty database.
3. Set `MYRDAE_DATA_DIR` to relocate mutable server data.

## Key Files

| File | Purpose |
|------|---------|
| `data/myrdae.db` | local authoritative world data |
| `lib/world-store.js` | SQLite schema, migration, and transactions |
| `js/locations-db.js` | one-time legacy migration seed only; not loaded by any page |
| `js/city-maps.js` | thin city registry |
| `js/cities/*.js` | per-city pins and labels |
| `js/map-overlay.js` | markers, labels, roads, tooltips, route graph logic |
| `js/editor.js` | editor state, drafts, placement, undo/redo, save |
| `js/world-clock.js` | Myrdae calendar logic and wheel UI |
| `js/ocean-shader.js` | WebGL2 ocean rendering, wave motion, and shoreline foam |
| `js/map-measure.js` | world distance measurement UI |
| `js/location-search.js` | viewer search |
| `server.js` | static server, persistence API, world clock sync, AI routes |
| `data/campaign-clock-links.json` | campaign anchors synced from Google Docs |

## Data Structure Notes

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
      description: "..."
      // many optional presentation/meta fields are supported
    }
  ],
  roads: [
    {
      id: "road-id",
      name: "Road Name",
      type: "major",
      points: ["loc-a", [45.1, 33.2], "loc-b"],
      curved: true
      // legacy waypoints arrays are also still handled by some helpers
    }
  ]
}
```

Important notes:

- Roads now primarily use `points`, not just `waypoints`.
- Non-water roads are also used as a route graph for tooltip distance/travel calculations.
- `water-route` roads can include ship metadata for animated boats.
- Region membership is stored on `locations.region`; visible region names are `locations` with `type: "region"`, not a separate `regions` collection.

### City modules

Per-city files in `js/cities/` usually define:

- `id`, `name`, `image`, `previewImage`
- `pins`
- `namedLabels`

## Server Notes

Important write/API routes in `server.js`:

| Route | Purpose |
|-------|---------|
| `POST /save` | Legacy alias; writes to `data/myrdae.db` (same as `/api/world-data`) |
| `POST /save-city/:cityId` | Write `js/cities/<id>.js` |
| `POST /save-city-map` | Write `js/city-maps.js` |
| `POST /delete-city/:cityId` | Delete `js/cities/<id>.js` + `images/cities/<id>/` dir |
| `POST /api/cities/scaffold` | Create `images/cities/<id>/` + `js/cities/` dirs |
| `POST /api/cities/upload-image` | Save uploaded image → `images/cities/<id>/<id>.<ext>` |
| `GET /api/city-images` | Scan `images/cities/` — returns id, name, image paths |
| `GET /api/world-clock/campaigns` | Read campaign clock registry (add `?sync=1` to trigger sync) |
| `POST /api/world-clock/sync` | Force-sync campaign anchors from all Google Docs |
| `GET /api/ai/comfy-proxy` | Proxy GET to local ComfyUI (e.g. history polling) |
| `POST /api/ai/comfy-proxy` | Proxy POST to local ComfyUI (e.g. queue prompt) |
| `POST /api/ai/upload-to-comfy` | Upload local image to ComfyUI `/upload/image` |
| `POST /api/ai/save-image` | Download ComfyUI-generated image → `images/cities/<id>/<id>.png` |
| `GET /api/ai/fetch-google-doc` | Proxy-fetch raw Google Doc text |
| `GET /api/ai/parse-gazetteer` | Fetch Google Doc as HTML; extract crest/map/location images and text |
| `POST /api/ai/summarize` | Summarize gazetteer locations via Gemini 2.0 Flash |

Mutable files in packaged mode are restricted to:

- `js/locations-db.js`
- `js/city-maps.js`
- `js/cities/**`
- `images/cities/**`

That matters whenever changing persistence logic.

## Campaign Clock System

`data/campaign-clock-links.json` stores one entry per active campaign. At startup the server syncs all campaigns whose `lastSyncedAt` is older than 5 minutes by fetching their Google Doc (exported as plain text), finding the latest session header (`NN – Name`) and a world-date line (`Nth of <Harmon>`), then writing the parsed anchor back to the file.

Each campaign entry has:
```json
{
  "id": "heroes-of-emberstran",
  "name": "Heroes of Emberstran",
  "docUrl": "https://docs.google.com/document/d/...",
  "anchor": { "year": 1246, "harmon": "Talil", "day": 34, "hour": 10, "minute": 0 },
  "sourceSession": 21,
  "syncStatus": "ok"
}
```

Active campaigns (as of 2026-04-23): **Souls of Destiny**, **Heroes of Emberstran**, **A New Adventure**, **Bloody Endeaver**.

The world clock widget on `map.html` / `embed-map.html` reads these anchors via `GET /api/world-clock/campaigns`.

## AI Features

Two independent AI integrations live in `server.js`:

**ComfyUI** (local, optional) — auto-started on server boot if `MYRDAE_ENABLE_COMFY=1` and a ComfyUI venv is found next to the project dir. Used to generate city map images. Proxied via `/api/ai/comfy-proxy`.

**Gemini 2.0 Flash** — `POST /api/ai/summarize` calls the Gemini API (requires `GEMINI_API_KEY` in `.env`) to turn raw gazetteer text into numbered location summaries for the city editor.

**Gazetteer parser** — `GET /api/ai/parse-gazetteer?url=<docUrl>&cityId=<id>` fetches a Google Doc as HTML, splits it by headings, extracts the crest (page-1 image), city map sketch, and locations-overlay image, saves them all to `images/cities/<id>/`, and returns structured JSON with location text.

## Ocean Shader (`js/ocean-shader.js`)

`OceanShader` overlays a WebGL2 ocean effect above the map's ocean layer and below land, roads, labels, and markers. It builds a water mask from the painted map pixels, then renders animated domain-warped wave color, caustic highlights, depth-tinted water, and shoreline foam. If WebGL2 is unavailable, it exits quietly and leaves the static map layers visible.

Public API:
- `OceanShader.init(containerId, imageId, options)` — attach to a map container and coordinate-anchor image
- `OceanShader.setTransform(containerId, transformStr, transformOrigin)` — keep the shader aligned in editor views that transform individual layers
- `OceanShader.destroy(containerId)` — remove the shader layer and stop its animation loop

## Cities

64 cities are registered in `js/city-maps.js` (as of 2026-05-07). Treat `js/city-maps.js` as the current source of truth for the exact list rather than copying city names into docs.

Each city has:
- `js/city-maps.js` entry (id, name, image paths)
- `js/cities/<id>.js` — registers into `window.CITY_MAPS_REGISTRY["id"]` with `pins` and `namedLabels` arrays
- `images/cities/<id>/` — map image (`<id>.png`), optionally `crest.png`, `sketch.png`, `locations-reference.png`

## Editor Internals (`js/editor.js`)

State that commonly matters:

| State property | Purpose |
|---|---|
| `selectedLocId` | current location, or `'__preview__'` for a ghost draft |
| `selectedRoadId` | current road |
| `locationDraft` | unsaved location form state |
| `roadDraft` | unsaved road form state |
| `locationDraftOriginalId` | tracks original ID during edits |
| `roadDraftOriginalId` | tracks original road ID during edits |
| `locationPlacementMode` | map-click placement mode |
| `moveLocationMode` | reposition mode |
| `isNewPreview` | ghost preview flag |
| `regionFilter`, `typeFilter`, `roadRegionFilter` | active filters |

Behaviors worth remembering:

- New locations appear immediately as a ghost `__preview__` entry.
- The overlay previews unsaved editor state by reading the editor's temporary `CampaignData` bridge.
- Keyboard shortcuts exist for search, save, cancel, undo/redo, and nudging coordinates.

## Backup System

Backups live in `/backups/` and should be treated as snapshots.

Before major edits to `js/locations-db.js`, create a backup via `/backup`.

Generated render/export output belongs in `/exports/`. That folder is ignored and should not be committed.

## Common Tasks

### Add a world location

Use `/add-location`, edit `js/locations-db.js`, or place it through the editor UI.

### Add a city

Use `/add-city` or the server-backed city scaffold flow, then verify:

- `js/city-maps.js`
- `js/cities/<id>.js`
- `images/cities/<id>/`
- `city-viewer.html?city=<id>`

### Validate and cleanup

- `/validate-db` for integrity checks
- `/sort-locations` after bulk world-data edits

### Persistence-sensitive changes

When changing `server.js` or `lib/world-store.js`, verify migration and a database write/read round trip against a temporary data root.

## Style Notes

- Dark fantasy palette in `css/styles.css`
- Core colors include `--bg-primary`, `--gold`, and `--crimson`
- Typography centers on Cinzel and Cormorant Garamond
- No bundler or frontend framework

## What Not To Do

- Do not re-enable `localStorage` as the main persistence path
- Do not casually add dependencies
- Do not edit snapshot files under `backups/`
- Do not commit generated/local folders such as `dist/`, `exports/`, `tools/`, `ue5-exports/`, `session-notes/`, or `.claude/worktrees/`
- Do not assume old standalone city pages are the current city architecture
- Do not write live world changes into `js/locations-db.js`; SQLite is authoritative.
