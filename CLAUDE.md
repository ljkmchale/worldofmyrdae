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
   - `js/water-repaint.js`
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
| `js/water-repaint.js` | layered water rendering and animation |
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

- `POST /save`
- `POST /save-city/:cityId`
- `POST /save-city-map`
- `POST /api/cities/scaffold`
- `POST /api/cities/upload-image`
- `GET /api/city-images`
- `GET /api/world-clock/campaigns`
- `POST /api/world-clock/sync`
- `GET/POST /api/ai/comfy-proxy`
- `POST /api/ai/upload-to-comfy`
- `POST /api/ai/save-image`
- `GET /api/ai/fetch-google-doc`
- `GET /api/ai/parse-gazetteer`
- `POST /api/ai/summarize`

Mutable files in packaged mode are restricted to:

- `js/locations-db.js`
- `js/city-maps.js`
- `js/cities/**`
- `images/cities/**`

That matters whenever changing persistence logic.

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
