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
- `http://localhost:3000/city-viewer.html` — unified city map viewer (all cities, driven by js/city-maps.js)

## Architecture

### Data flow
1. `js/locations-db.js` — source of truth; exports `WORLD_LOCATIONS` global with all locations, roads, and regions
2. `js/campaign-data.js` — loads `WORLD_LOCATIONS`, provides CRUD API (`CampaignData.addLocation()`, etc.)
3. `js/map-overlay.js` — reads campaign data, renders SVG markers/labels/tooltips onto the map image
4. `js/boat-animations.js` — `BoatFleet` class; animates sailing vessels and a sea monster along `water-route` roads
5. `js/dragon-overlay.js` — `DragonFlyover` module; animates a golden dragon flying over the Arbescar region on a 4-minute patrol cycle
6. `js/editor.js` — UI for editing; POSTs changes to `server.js /save` which writes back to `locations-db.js`
7. `js/map.js` — pan/zoom controller (GPU-accelerated via CSS transforms)

### Key files
| File | Purpose |
|------|---------|
| `js/locations-db.js` | the entire world database |
| `js/city-maps.js` | city maps registry — pins and images for each city |
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
      type: "city",            // capital | city | small-city | town | village | port |
                               // ruins | landmark | nature | poi | region | water | river
      x: 77.7, y: 31.7,       // percentage coords on the map image (0–100)
      region: "Otesurr Mountains",
      description: "...",
      fontSize: 18,
      markerSize: 0.2,
      // Optional: fontFamily, fontWeight, fontStyle, labelOffsetX/Y, markerOffsetX/Y,
      //           rotation, opacity, textCurve, labelAlign, hideLabel, cityMap, details, link
    }
  ],
  roads: [
    {
      id: "road-id",
      name: "Road Name",
      type: "major",           // major | minor | river | water-route | border
      points: ["loc-id-start", [x, y], [x, y], "loc-id-end"],  // mix of location IDs and [x,y] coords
      color: "#8B6914",        // optional override
      width: 2,                // optional multiplier
      curved: true,
      // water-route only: shipName, shipType, captainName, animationDuration, boatColor, boatSizeMultiplier
      // optional: dashed, dashLength, gapLength, fontFamily, fontSize, labelOffset, labelSide
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
Use the `/add-location` skill or manually append to the `locations` array in `js/locations-db.js`. The editor UI at `/editor.html` can also do this interactively — click **New Location** to enter placement mode, then click the map to place it.

### Validate the database
Use `/validate-db` to check for duplicate IDs, missing required fields, out-of-bounds coordinates, and orphaned road references.

### Edit the map overlay appearance
SVG rendering logic is in `js/map-overlay.js`. Marker shapes, label styles, tooltip HTML, and territory fill colors are all in there.

### Check installer compatibility after changes
Use `/check-installer` to verify the Windows MSI and macOS DMG installers will still build correctly. Run this whenever you add new files or directories, change `server.js` exports, or modify `electron/main.js`.

## Editor Internals (`js/editor.js`)

Key state properties and behaviors a future session needs to know:

| State property | Purpose |
|---|---|
| `selectedLocId` | ID of location being edited; `'__preview__'` when creating/duplicating (ghost) |
| `isNewPreview` | `true` while a `__preview__` ghost is in `state.locations` — cleaned up on save or cancel |
| `locationPlacementMode` | `true` when "New Location" button has been clicked to arm map-click placement |
| `typeFilter` | Active type filter value (mirrors the Type Filter dropdown) |
| `regionFilter` | Active region filter value (mirrors the Region Filter dropdown) |

**Placement mode**: Clicking the map only creates a new location when `locationPlacementMode === true`. Toggle via the "New Location" button (`toggleNewLocationMode()`). The button shows "Cancel Placement" while active.

**Ghost preview (`__preview__`)**: When creating or duplicating a location, a ghost entry with `id: '__preview__'` and `_ghost: true` is added to `state.locations` immediately so the marker appears on the map before the first save. `saveLocation()` promotes it to a real entry; `cancelLocation()` removes it.

**Filters**: Region and Type filters both support an "ACTIVE" badge + gold border when active. Both call `renderLocationList()` after updating state.

## Style Notes

- **Dark fantasy aesthetic** — CSS vars in `css/styles.css`: `--bg-primary: #050508`, `--gold: #d4af37`, `--crimson: #dc143c`
- **Fonts** — Cinzel (headings), Cormorant Garamond (body), Simonetta (local fallback)
- No build step, no bundler — edit files and refresh

## What NOT to do

- Don't use `localStorage` for persistence — `USE_LOCAL_STORAGE` is intentionally `false`; the source of truth is `locations-db.js` on disk
- Don't add npm dependencies — the whole point is zero-dependency
- Don't modify `backups/` files — they are read-only snapshots
