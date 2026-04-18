---
name: backup
description: Create a timestamped backup of key World of Myrdae source files (locations-db.js, map-overlay.js, editor.js, boat-animations.js, dragon-overlay.js) into the /backups/ directory before making significant changes
argument-hint: [optional note]
---

Create a timestamped backup of the World of Myrdae key source files.

Steps:
1. Get the current timestamp in format `YYYYMMDD_HHMMSS` using Bash: `date +%Y%m%d_%H%M%S`
2. Copy these files into `/backups/` with the timestamp suffix:
   - `js/locations-db.js` → `backups/locations-db.<timestamp>.js`
   - `js/city-maps.js` → `backups/city-maps.<timestamp>.js`
   - `js/map-overlay.js` → `backups/map-overlay.<timestamp>.js`
   - `js/editor.js` → `backups/editor.<timestamp>.js`
   - `js/boat-animations.js` → `backups/boat-animations.<timestamp>.js`
   - `js/dragon-overlay.js` → `backups/dragon-overlay.<timestamp>.js`
3. Use `cp` commands via Bash to do the actual copying.
4. Confirm to the user which files were backed up and to what paths.

If $ARGUMENTS is provided, include it as a note in your confirmation message (e.g. "Backed up before: $ARGUMENTS").

Keep it brief — just confirm the backup completed with the timestamp used.
