# World of Myrdae — Claude Code Guide

## What This Project Is

An interactive fantasy world map editor for a D&D campaign set in **Myrdae**. It's a self-contained vanilla JS + Node.js web app with no external framework dependencies.

## Running the Project

```bash
node server.js        # starts on http://localhost:3000
```

Key pages:
- `http://localhost:3000/editor.html` — map editor (add/edit locations, roads, regions)
- `http://localhost:3000/map.html` — read-only interactive map viewer
- `http://localhost:3000/map-3d-planet.html` — 3D rotating globe
- `http://localhost:3000/embed-map.html` — embeddable map (same as map.html, for iframe use)
- `http://localhost:3000/city-emberstran.html` — standalone city map for Emberstran
- `http://localhost:3000/city-tratta.html` — standalone city map for Tratta

## Architecture

### Data flow
1. `js/locations-db.js` — source of truth; exports `WORLD_LOCATIONS` global with all locations, roads, and regions
2. `js/campaign-data.js` — loads `WORLD_LOCATIONS`, provides CRUD API (`CampaignData.addLocation()`, etc.)
3. `js/map-overlay.js` — reads campaign data, renders SVG markers/labels/tooltips onto the map image
4. `js/boat-animations.js` — `BoatFleet` class; animates sailing vessels and a sea monster along `water-route` roads
5. `js/dragon-overlay.js` — `DragonFlyover` module; animates a golden dragon flying over the Arbescar region on a 4-minute patrol cycle
6. `js/editor.js` — UI for editing; POSTs changes to `server.js /save` which writes back to `locations-db.js`
6. `js/map.js` — pan/zoom controller (GPU-accelerated via CSS transforms)

### Key files
| File | Purpose |
|------|---------|
| `js/locations-db.js` | the entire world database |
| `js/map-overlay.js` | SVG overlay renderer, tooltips, territory borders |
| `js/boat-animations.js` | `BoatFleet` class — animated boats + sea monster on water routes |
| `js/dragon-overlay.js` | `DragonFlyover` module — golden dragon flyover animation above Arbescar |
| `js/editor.js` | Editor UI logic, save/load, live preview |
| `js/campaign-data.js` | Data init, persistence, cross-tab BroadcastChannel sync |
| `js/map.js` | Zoom/pan with requestAnimationFrame |
| `server.js` | Static file server + POST `/save` endpoint |
| `sort_locations_by_region.py` | Utility script to sort locations-db.js entries by region |

### Data structure (WORLD_LOCATIONS)
```js
{
  locations: [
    {
      id: "lurdoba",           // kebab-case, unique
      name: "Lurdoba",
      type: "city",            // city | town | village | landmark | region | dungeon | etc.
      x: 77.7, y: 31.7,       // percentage coords on the map image
      region: "Otesurr Mountains",
      description: "...",
      fontSize: 18,
      markerSize: 0.2,
      // Optional: fontFamily, fontWeight, fontStyle, labelOffsetX/Y, markerOffsetX/Y, rotation, opacity
    }
  ],
  roads: [
    {
      id: "road-id",
      name: "Road Name",
      type: "road",            // road | path | river | trade-route | water-route | etc.
      waypoints: [{x, y}, ...],
      color: "#8B6914",
      width: 2,
      curved: true
    }
  ],
  regions: [
    {
      id: "region-id",
      name: "Region Name",
      color: "#rgba...",
      points: [{x, y}, ...]
    }
  ]
}
```

## Backup System

Backups of key files are stored in `/backups/` with timestamps (`20260331_143545`).

**Before making significant changes to `js/locations-db.js`, always create a backup.**

Use the `/backup` skill: it timestamps and copies locations-db.js to `/backups/`.

## Common Tasks

### Add a new location
Use the `/add-location` skill or manually append to the `locations` array in `js/locations-db.js`. The editor UI at `/editor.html` can also do this interactively.

### Validate the database
Use `/validate-db` to check for duplicate IDs, missing required fields, out-of-bounds coordinates, and orphaned road references.

### Edit the map overlay appearance
SVG rendering logic is in `js/map-overlay.js`. Marker shapes, label styles, tooltip HTML, and territory fill colors are all in there.

## Style Notes

- **Dark fantasy aesthetic** — CSS vars in `css/styles.css`: `--bg-primary: #050508`, `--gold: #d4af37`, `--crimson: #dc143c`
- **Fonts** — Cinzel (headings), Cormorant Garamond (body), Simonetta (local fallback)
- No build step, no bundler — edit files and refresh

## What NOT to do

- Don't use `localStorage` for persistence — `USE_LOCAL_STORAGE` is intentionally `false`; the source of truth is `locations-db.js` on disk
- Don't add npm dependencies — the whole point is zero-dependency
- Don't modify `backups/` files — they are read-only snapshots
