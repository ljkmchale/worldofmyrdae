---
name: backup
description: Create timestamped backups of the SQLite world database and key World of Myrdae map/editor source files
argument-hint: [optional note]
---

1. If `data/myrdae.db` exists, run `node scripts/world-db-tools.js backup` to create a consistent SQLite snapshot under `backups/`.
2. Create the same timestamped source snapshots for:
   - `js/locations-db.js`
   - `js/map-overlay.js`
   - `js/editor.js`
   - `js/boat-animations.js`
   - `js/dragon-overlay.js`
3. Use native PowerShell on Windows if Bash is unavailable.
4. Confirm the database and source backup paths. Include the optional note when supplied.

`backups/` remains local-only and ignored by git.
