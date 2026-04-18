---
name: add-city
description: Add a new city map entry to js/city-maps.js (the city viewer registry). Use when adding a new detailed city map with pins and labels to city-viewer.html — distinct from add-location which adds a world map marker.
argument-hint: [city name and details]
---

Help the user add a new city entry to `js/city-maps.js`.

## Process

1. **Gather info** — If $ARGUMENTS doesn't supply everything, ask the user for:
   - City name (required)
   - Image path — e.g. `images/cities/cityname/cityname.PNG`. Ask the user to confirm the file exists, or check with Glob.
   - Preview image path — often same as image, or a smaller thumbnail. Default to same as image if unsure.
   - Initial pins (optional) — user may want to start with zero pins and add them in the editor UI. That's fine.
   - Named labels (optional) — district names, sea names, direction labels, etc.

2. **Create the ID** — kebab-case version of the city name. E.g. "Fort Ashveil" → `fort-ashveil`. Grep city-maps.js to confirm it's unique.

3. **Backup first** — run the `/backup` skill before editing.

4. **Read the end of `js/city-maps.js`** — find the closing `];` of the CITY_MAPS array to know where to insert.

5. **Insert the new city entry** before the closing `];`. Follow this format exactly:

```js
  {
    id: "city-id",
    name: "City Name",
    image: "images/cities/city-id/city-id.PNG",
    previewImage: "images/cities/city-id/city-id.PNG",
    pins: [],
    namedLabels: [],
  },
```

If the user provides initial pins, format each as:
```js
{ n: 1, x: 50.0, y: 50.0, name: "Pin Name", type: "landmark", desc: "Description.", size: 1.3 },
```

If the user provides named labels, format each as:
```js
{ id: "label-id", name: "Label Name", x: 50.0, y: 50.0, type: "district", desc: "Description." },
```

6. **Confirm** — tell the user the city was added. Remind them they can open the City Map tab in the editor at http://localhost:3000/editor.html to drag and place pins visually.

## Pin types (common values)
tavern, inn, market, shop, temple, shrine, keep, fortress, landmark, harbor, gate, district, warehouse, stables, arena, college, bank, tower, cemetery, sea, direction

## Rules
- Always backup before editing
- IDs must be unique — grep for the proposed ID first
- x/y are percentages (0–100), not pixels
- `n` values in pins are sequential starting at 1
- namedLabels `id` values are kebab-case, unique within the city
