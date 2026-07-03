---
name: add-location
description: Add a Surface or Underdark location to the SQLite-backed World of Myrdae map database
argument-hint: [realm, location name, and details]
---

Add locations through the local server/editor. `data/myrdae.db` is authoritative; never edit `js/locations-db.js` for a live change.

1. Gather the realm (`surface` or `underdark`), unique ID, name, type, x/y percentages, region, description, font size, and marker size.
2. Run `/backup` before significant data changes.
3. Prefer `editor.html`: switch to the requested realm, place the marker, fill the form, and save.
4. For scripted work, `GET /api/world-data`, add the record only to the requested realm's `locations` array, then `PUT /api/world-data` with the complete updated world. Preserve the other realm unchanged.
5. Run `npm run db:validate` and confirm the record appears only in the requested realm.

IDs must be unique within their realm. Coordinates are percentages from 0 to 100.
