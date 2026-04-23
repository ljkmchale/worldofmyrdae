# World of Myrdae

Interactive fantasy world map editor and viewer for a D&D campaign setting. The app is mostly plain HTML, CSS, and vanilla JavaScript, served by a small Node.js server. It also has an Electron desktop wrapper for packaged builds.

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

Run the desktop shell:

```powershell
npm run desktop:dev
```

## Architecture

The main world data source is `js/locations-db.js`, which defines `WORLD_LOCATIONS` for:

- `locations`
- `roads`
- `regions`

The usual runtime flow is:

1. `js/locations-db.js` seeds the in-browser world dataset.
2. `js/campaign-data.js` exposes a small read/write API and dispatches update events.
3. `js/map-overlay.js` renders SVG labels, markers, roads, tooltips, and route metadata over the map image.
4. Feature modules extend the viewer:
   - `js/boat-animations.js`
   - `js/dragon-overlay.js`
   - `js/world-clock.js`
   - `js/location-search.js`
   - `js/map-measure.js`
   - `js/water-repaint.js`
   - `js/coord-grid.js`
5. `js/editor.js` clones the source data into editor state, previews unsaved changes, and persists edits through `server.js`.

## Important Files

### World map

- `map.html` - primary interactive viewer
- `embed-map.html` - iframe-friendly viewer with nearly the same feature set
- `editor.html` - large all-in-one editing UI
- `js/map.js` - pan and zoom controller
- `js/map-overlay.js` - overlay renderer and tooltip logic
- `js/locations-db.js` - source of truth for world locations, roads, and regions

### City maps

- `city-viewer.html` - single city map shell
- `js/city-maps.js` - thin city registry with IDs and image paths
- `js/cities/<city-id>.js` - per-city pins and labels, loaded on demand
- `images/cities/<city-id>/` - map images and generated assets for each city

### Time / campaign sync

- `js/world-clock.js` - Myrdae calendar model and UI wheel
- `data/campaign-clock-links.json` - campaign anchors and Google Doc links
- `server.js` - syncs campaign anchors from Google Docs

### Desktop packaging

- `electron/main.js` - Electron bootstrap and embedded server startup
- `electron/preload.js` - minimal desktop bridge
- `DESKTOP_BUILD.md` - packaging notes

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

- world data writes back to `js/locations-db.js`
- city registry writes back to `js/city-maps.js`
- city detail files write to `js/cities/<city-id>.js`
- city images live under `images/cities/<city-id>/`

In packaged Electron builds, only a small set of paths are writable. The server overlays these mutable files from a runtime data directory while everything else is read from the bundled app.

## Notable Server Endpoints

`server.js` is both a static file server and the write API. Key routes:

- `POST /save` - save `js/locations-db.js`
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

## Working Conventions

- Before making significant edits to `js/locations-db.js`, create a backup in `backups/`.
- Do not edit files inside `backups/`; they are snapshots.
- Avoid adding npm dependencies unless there is a strong reason.
- `map-viewer.html` is a small coordinate helper page, not the main viewer.
- The repo includes generated output in `dist/` and dependencies in `node_modules/`, but normal coding work should focus on source files.

## Current Gaps

- There is no automated test suite yet.
- A lot of editor behavior lives inline in `editor.html` plus `js/editor.js`, so UI changes often require checking both.
- Some historical docs still describe the older standalone city pages; the current city flow is centered on `city-viewer.html` plus `js/city-maps.js` and `js/cities/`.
