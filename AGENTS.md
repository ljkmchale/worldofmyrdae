# World of Myrdae - Codex Guide

## What This Project Is

An interactive fantasy world map editor and viewer for the D&D setting of Myrdae. The core app is a zero-framework HTML/CSS/vanilla-JS site served by Node.js, with an Electron wrapper for desktop builds.

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

Desktop shell:

```bash
npm run desktop:dev
```

Windows notes:

- Use PowerShell from this repo root: `C:\Users\Larry McHale\Desktop\WorldofMyrdae`.
- If PowerShell blocks `npm.ps1`, run `npm.cmd run <script>` instead.
- If `rg` fails with `Access is denied`, use PowerShell `Get-ChildItem` / `Select-String` for repo searches.
- The local web server normally runs on `localhost:3000`; use that for browser smoke tests after map/editor UI changes.

## Architecture

### World data flow

1. `js/locations-db.js` defines `WORLD_LOCATIONS` and is the source of truth for world `locations`, `roads`, and `regions`.
2. `js/campaign-data.js` wraps that data and emits `campaign-data-updated` / `metric-changed` events.
3. `js/map-overlay.js` renders SVG roads, markers, labels, tooltips, route info, and location interactions over the map image.
4. Viewer feature modules plug into that layer:
   - `js/boat-animations.js`
   - `js/dragon-overlay.js`
   - `js/world-clock.js`
   - `js/location-search.js`
   - `js/map-measure.js`
   - `js/ocean-shader.js`
   - `js/coord-grid.js`
5. `js/editor.js` manages the editor state, previews unsaved changes, and persists through `server.js`.

### City map flow

1. `js/city-maps.js` is only a thin registry of city IDs, names, and image paths.
2. `city-viewer.html` loads a selected city and then fetches `js/cities/<city-id>.js` on demand.
3. Each `js/cities/<city-id>.js` file registers into `window.CITY_MAPS_REGISTRY`.
4. City assets live under `images/cities/<city-id>/`.

### Desktop build flow

1. `electron/main.js` starts the local server internally.
2. In packaged builds, mutable files are overlaid from a writable data directory instead of editing the bundled app directly.
3. `electron/preload.js` exposes a tiny `window.desktopApp` bridge.

## Key Files

| File | Purpose |
|------|---------|
| `js/locations-db.js` | main world database |
| `js/city-maps.js` | city registry with image paths |
| `js/cities/*.js` | per-city pins and labels |
| `js/map-overlay.js` | overlay rendering, roads, tooltips, route graph helpers |
| `js/editor.js` | editor state, drafts, placement mode, save flows |
| `js/world-clock.js` | Myrdae calendar model and wheel UI |
| `js/ocean-shader.js` | WebGL2 ocean rendering, wave motion, and shoreline foam |
| `js/map-measure.js` | viewer distance measurement UI |
| `js/location-search.js` | search/filter interactions in the viewer |
| `server.js` | static serving plus save, city, world clock, and AI endpoints |
| `electron/main.js` | Electron app bootstrap |
| `data/campaign-clock-links.json` | campaign anchors and Google Doc sync targets |

## Directory Map

Active runtime/source folders:

- `css/` - shared styling, including the dark fantasy theme.
- `data/` - campaign clock link data and other small runtime data files.
- `electron/` - desktop shell, preload bridge, and app icon.
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
- `dist/` - Electron build output.
- `docs/` - project notes and Unreal/export documentation.
- `exports/` - large render/export artifacts; not used by the web/Electron app.
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
  regions: [
    {
      id: "region-id",
      name: "Region Name",
      color: "rgba(212,175,55,0.18)",
      points: [{ x: 10, y: 20 }, { x: 15, y: 25 }]
    }
  ]
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

`js/campaign-data.js` still contains optional `localStorage` support, but it is intentionally disabled. Persistent edits should go through the server and land on disk.

Writable content:

- `js/locations-db.js`
- `js/city-maps.js`
- `js/cities/<city-id>.js`
- `images/cities/<city-id>/...`
- `data/campaign-clock-links.json`

In Electron builds, the server overlays mutable content from:

- `process.env.MYRDAE_DATA_DIR`, or
- the Electron user-data directory fallback

Anything else should be treated as bundled/read-only in packaged mode.

## Important Server Routes

`server.js` is not just a static server. It also owns the write API and helper endpoints:

- `POST /save` - save the world database
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

Use `/add-location`, edit `js/locations-db.js`, or place it through `editor.html`.

### Add or edit a city map

- scaffold/update the city in `js/city-maps.js`
- edit `js/cities/<city-id>.js`
- place assets in `images/cities/<city-id>/`
- verify in `city-viewer.html?city=<id>`
- after importing city assets, make sure tooltip previews/crests resolve through `js/city-maps.js` and `js/overlay/tooltip.js`

### Validate the world database

Use `/validate-db` for duplicate IDs, invalid coordinates, and reference issues.

### Sort locations

Use `/sort-locations` after bulk additions if ordering drift matters.

### Check desktop packaging impact

If changes touch Electron boot, server mutability rules, or packaged assets, review `DESKTOP_BUILD.md`.

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
- For Electron/server mutability changes, review `DESKTOP_BUILD.md` and verify the desktop shell still starts.

## What Not To Do

- Do not switch persistence back to `localStorage`
- Do not add npm dependencies casually
- Do not edit files inside `backups/`
- Do not commit generated/local folders such as `dist/`, `tools/`, `ue5-exports/`, `session-notes/`, or `.claude/worktrees/`
- Do not assume only the web server exists; check Electron implications too
- Do not assume standalone `city-*.html` pages are the primary city flow; the current system is `city-viewer.html` plus `js/city-maps.js` and `js/cities/`
