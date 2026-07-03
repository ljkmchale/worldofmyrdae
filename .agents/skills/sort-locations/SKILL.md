---
name: sort-locations
description: Sort SQLite-backed Surface or Underdark locations alphabetically by region and name
argument-hint: [surface|underdark|all]
---

1. Run `/backup`.
2. Run `node scripts/world-db-tools.js sort <surface|underdark|all>`; default is `all`.
3. Run `npm run db:validate`.
4. Report the realm sorted. Do not rewrite `js/locations-db.js` unless the user explicitly requests a new migration seed export.
