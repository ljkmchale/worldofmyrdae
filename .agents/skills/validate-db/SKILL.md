---
name: validate-db
description: Validate the World of Myrdae locations database (js/locations-db.js) for common issues: duplicate IDs, missing required fields, out-of-bounds coordinates, malformed road waypoints, and syntax errors
---

Validate `js/locations-db.js` for data integrity issues.

## Checks to perform

Run these checks using Grep and Read tools on `js/locations-db.js`:

### 1. Syntax check
Run: `node --check js/locations-db.js` via Bash to catch JS syntax errors.

### 2. Duplicate location IDs
Use Grep to find all `id:` values in the locations array and check for duplicates.
Pattern: `id:\s*["']([^"']+)["']`

### 3. Missing required fields
For each location, verify these fields are present: `id`, `name`, `type`, `x`, `y`.
Sample-check by reading a portion of the file and looking for entries missing these keys.

### 4. Out-of-bounds coordinates
x and y should be between 0 and 100 (percentage of map). Grep for obviously wrong values like negative numbers or values > 100.
Patterns to check: `x:\s*-`, `y:\s*-`, `x:\s*1[0-9]{2}`, `y:\s*1[0-9]{2}`

### 5. Road waypoints
Roads should have at least 2 waypoints. Grep for roads with empty or single-point waypoint arrays.

### 6. Empty descriptions
Grep for `description:\s*[""]["']` to find locations with blank descriptions.

## Output format

Report findings in this structure:
- **Syntax**: Pass/Fail
- **Duplicate IDs**: List any found, or "None found"
- **Missing fields**: List any found, or "None found"
- **Out-of-bounds coords**: List any found, or "None found"
- **Road issues**: List any found, or "None found"
- **Empty descriptions**: Count of locations with blank descriptions

End with a summary: "X issues found" or "Database looks clean."
