---
name: validate-db
description: Validate the SQLite-backed Surface and Underdark world database for duplicate IDs, missing fields, coordinates, and road references
---

1. Run `node --check lib/world-store.js`, `node --check server.js`, and `node --check scripts/world-db-tools.js`.
2. Run `npm run db:counts`.
3. Run `npm run db:validate`.
4. Report findings separately for Surface and Underdark.

`data/myrdae.db` is authoritative. Validate `js/locations-db.js` only when testing the initial migration seed.
