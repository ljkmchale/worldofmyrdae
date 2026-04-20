---
name: sort-locations
description: Sort the locations array in js/locations-db.js alphabetically by region, then by name within each region. Useful for keeping the database organized after adding many new locations.
---

Sort the `locations` array in `js/locations-db.js` by region (alphabetically), then by name within each region.

## Process

1. **Backup first** — run the `/backup` skill before making any changes.

2. **Run the sort via Node.js** — use a Bash one-liner to read the file, sort in memory, and write back:

```bash
node -e "
const fs = require('fs');
const content = fs.readFileSync('js/locations-db.js', 'utf8');

// Extract the WORLD_LOCATIONS object
const match = content.match(/const WORLD_LOCATIONS\s*=\s*(\{[\s\S]*\});?\s*$/);
if (!match) { console.error('Could not parse WORLD_LOCATIONS'); process.exit(1); }

const data = eval('(' + match[1] + ')');

// Sort locations by region, then name within region
data.locations.sort((a, b) => {
  const regionCmp = (a.region || '').localeCompare(b.region || '');
  if (regionCmp !== 0) return regionCmp;
  return (a.name || '').localeCompare(b.name || '');
});

// Rebuild file with sorted locations
const sorted = JSON.stringify(data, null, 4);
const output = 'const WORLD_LOCATIONS = ' + sorted + ';';
fs.writeFileSync('js/locations-db.js', output);
console.log('Sorted', data.locations.length, 'locations by region then name.');
"
```

3. **Verify syntax** — run `node --check js/locations-db.js` to confirm the file is still valid.

4. **Report** — tell the user how many locations were sorted and confirm the file is valid.

## Notes
- Roads and regions arrays are left in their original order (only locations are sorted)
- This rewrites the file with uniform JSON formatting — that's expected and fine
- If the sort fails or produces a syntax error, restore from the backup created in step 1
