---
name: add-location
description: Add a new named location (city, town, village, landmark, dungeon, etc.) to the World of Myrdae locations database (js/locations-db.js)
argument-hint: [location name and details]
---

Help the user add a new location to `js/locations-db.js`.

## Process

1. **Gather info** — If $ARGUMENTS doesn't supply everything, ask the user for:
   - Name (required)
   - Type: city | town | village | landmark | dungeon | ruin | port | fortress | region | other
   - x, y coordinates as percentage of map image (0–100). If unknown, ask user to look at the editor to find approximate position, or suggest a reasonable region.
   - Region name (which existing region it belongs to)
   - Short description (1–2 sentences of flavor text)
   - fontSize (default: 14 for small places, 16 for towns, 18–20 for cities)
   - markerSize (default: 0.15 for small, 0.2 for medium, 0.25 for large)

2. **Create the ID** — kebab-case version of the name, lowercase, no special chars. E.g. "Fort Ashveil" → `fort-ashveil`

3. **Read the end of `js/locations-db.js`** to find where the locations array ends (look for the closing `]` of the locations array).

4. **Before editing** — run the `/backup` skill first to protect the database.

5. **Insert the new location** — add it as a properly formatted object at the end of the `locations` array, before the closing `]`. Follow this format exactly:
```js
    {
        id: "location-id",
        name: "Location Name",
        type: "city",
        x: 50.0,
        y: 50.0,
        region: "Region Name",
        description: "Description here.",
        fontSize: 16,
        markerSize: 0.2
    },
```

6. **Confirm** — tell the user the location was added and its coordinates so they can verify in the editor.

## Rules
- Always backup before editing
- IDs must be unique — grep for the proposed ID first to confirm
- x/y are percentages (0–100), not pixels
- Don't add optional fields (fontFamily, rotation, etc.) unless the user asks for them
