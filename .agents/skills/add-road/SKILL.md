---
name: add-road
description: Add a Surface or Underdark road, path, river, trade route, or water route to the SQLite-backed map database
argument-hint: [realm, road name, type, and points]
---

Add roads through the local server/editor. `data/myrdae.db` is authoritative; never edit `js/locations-db.js` for a live change.

1. Gather the realm, unique road ID, type, points, optional name, and curved setting.
2. Confirm every string endpoint exists in the same realm.
3. Run `/backup` before significant data changes.
4. Prefer the Roads tab in `editor.html` after switching to the requested realm.
5. For scripted work, update only that realm's `roads` array through `GET/PUT /api/world-data`, preserving the other realm.
6. Run `npm run db:validate`.

Road points mix location ID strings and `[x, y]` percentage pairs and require at least two points.
