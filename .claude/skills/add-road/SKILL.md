---
name: add-road
description: Add a new road, path, river, trade-route, or water-route to the roads array in js/locations-db.js
argument-hint: [road name and details]
---

Help the user add a new road (or river, path, trade-route, water-route) to `js/locations-db.js`.

## Process

1. **Gather info** — If $ARGUMENTS doesn't supply everything, ask the user for:
   - Road ID (kebab-case, unique) — e.g. `emberstran-tratta-road`
   - Type: `minor` | `major` | `river` | `path` | `trade-route` | `water-route`
   - Points — a mix of location IDs (strings) and `[x, y]` coordinate pairs (percentages). Start and end with location IDs where possible. Interior waypoints are `[x, y]` arrays.
   - Name (optional) — displayed as a label on the map. Use `\\n` for line breaks in long names.
   - Curved: `true` (default) | `false`

2. **Confirm location IDs exist** — grep `js/locations-db.js` for each location ID used in points to confirm they exist.

3. **Confirm the road ID is unique** — grep for the proposed ID.

4. **Backup first** — run the `/backup` skill before editing.

5. **Find the end of the roads array** — the roads array ends just before `"regions": []` at the bottom of the file (around line 14398). The last road entry ends with `}` followed by `],`.

6. **Insert the new road** before the closing `]` of the roads array. Follow this format:

```js
        {
            "id": "road-id",
            "type": "minor",
            "curved": true,
            "points": [
                "location-id-start",
                [
                    50.0,
                    50.0
                ],
                "location-id-end"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
```

For a named road, add these fields after `"fontStyle"`:
```js
            "name": "Road Name",
            "fontSize": 10,
```

7. **Confirm** — tell the user the road was added with its ID and endpoint locations.

## Road types reference
| Type | Usage |
|------|-------|
| `minor` | Local roads between nearby settlements |
| `major` | Main highways and important routes |
| `river` | Rivers and waterways |
| `path` | Trails, mountain passes, minor paths |
| `trade-route` | Major overland trade routes |
| `water-route` | Sea lanes (used by boat animations) |

## Rules
- Always backup before editing
- IDs must be unique
- Points mix location ID strings and `[x, y]` arrays — minimum 2 points
- x/y are percentages (0–100)
- Always include `"fontFamily": "Simonetta"` and `"fontStyle": "Italic"` for consistency
- JSON format (double-quoted keys and strings) — this file uses JSON inside a JS variable assignment
