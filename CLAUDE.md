# World of Myrdae - Claude Code Guide

## What This Project Is

An interactive fantasy world map editor and viewer for Myrdae. The web app is zero-framework HTML/CSS/JS served by Node, and the same project can be packaged inside Electron.

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

Desktop mode:

```bash
npm run desktop:dev
```

## Architecture

### Main world flow

1. `js/locations-db.js` defines `WORLD_LOCATIONS`.
2. `js/campaign-data.js` loads it, wraps it, and emits update events.
3. `js/map-overlay.js` renders the visual overlay on top of the world map image.
4. Additional viewer systems hook into the same page:
   - `js/boat-animations.js`
   - `js/dragon-overlay.js`
   - `js/world-clock.js`
   - `js/location-search.js`
   - `js/map-measure.js`
   - `js/ocean-shader.js`
   - `js/coord-grid.js`
5. `js/editor.js` keeps a cloned local editing state and previews unsaved changes through a temporary `CampaignData` bridge.

### City map flow

1. `js/city-maps.js` stores a thin index of cities and image paths.
2. `city-viewer.html` loads a city by ID.
3. `js/cities/<id>.js` registers detailed pins/labels into `window.CITY_MAPS_REGISTRY`.
4. `images/cities/<id>/` stores the visual assets for that city.

### Desktop flow

1. `electron/main.js` starts the server with a writable runtime data root.
2. Mutable files are overlaid from that runtime directory in packaged builds.
3. The bundled app remains read-only apart from those allowed overlay paths.

## Key Files

| File | Purpose |
|------|---------|
| `js/locations-db.js` | source of truth for world data |
| `js/city-maps.js` | thin city registry |
| `js/cities/*.js` | per-city pins and labels |
| `js/map-overlay.js` | markers, labels, roads, tooltips, route graph logic |
| `js/editor.js` | editor state, drafts, placement, undo/redo, save |
| `js/world-clock.js` | Myrdae calendar logic and wheel UI |
| `js/ocean-shader.js` | WebGL2 ocean rendering, wave motion, and shoreline foam |
| `js/map-measure.js` | world distance measurement UI |
| `js/location-search.js` | viewer search |
| `server.js` | static server, persistence API, world clock sync, AI routes |
| `electron/main.js` | Electron bootstrap |
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
  ],
  regions: [
    {
      id: "region-id",
      name: "Region Name",
      color: "rgba(...)",
      points: [{ x: 10, y: 20 }]
    }
  ]
}
```

Important notes:

- Roads now primarily use `points`, not just `waypoints`.
- Non-water roads are also used as a route graph for tooltip distance/travel calculations.
- `water-route` roads can include ship metadata for animated boats.

### City modules

Per-city files in `js/cities/` usually define:

- `id`, `name`, `image`, `previewImage`
- `pins`
- `namedLabels`

## Server Notes

Important write/API routes in `server.js`:

| Route | Purpose |
|-------|---------|
| `POST /save` | Write `js/locations-db.js` |
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

27 cities are registered in `js/city-maps.js` (as of 2026-04-23):
Tratta, Emberstran, Nauldeaus, Adsuren, Onaren, Scarwatch Hold, Basctdelm, Shademoor, Abbey of Mont Rest, Farview, Glaspero, Climbor, Everlight, Aerley, Ole'stack, Sandgrave, Kallilos, Sari Lenora, Clador, Ulgrey, Trailpoint, Farnsby Port, Dunduar, Nuwharf, Tal'besar Ruins, Scarbrook, Nebisill.

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

### Packaging-sensitive changes

Review `DESKTOP_BUILD.md` if you change:

- `server.js` persistence behavior
- `electron/main.js`
- packaged asset paths

## Style Notes

- Dark fantasy palette in `css/styles.css`
- Core colors include `--bg-primary`, `--gold`, and `--crimson`
- Typography centers on Cinzel and Cormorant Garamond
- No bundler or frontend framework

## What Not To Do

- Do not re-enable `localStorage` as the main persistence path
- Do not casually add dependencies
- Do not edit snapshot files under `backups/`
- Do not assume old standalone city pages are the current city architecture
