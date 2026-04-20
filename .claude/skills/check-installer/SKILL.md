---
name: check-installer
description: Verify that the Windows (.msi) and macOS (.dmg) Electron installers will still work after code changes. Checks required files, build.files coverage, server.js exports, and electron/main.js integrity.
---

After making modifications, verify the app is still installer-compatible. This app uses electron-builder to produce a Windows MSI and macOS DMG.

## What the installer requires

The installer bundles exactly the paths listed in `package.json` → `build.files`:
```
electron/**/*   css/**/*   fonts/**/*   images/**/*   js/**/*
*.html          server.js  package.json
(excludes: backups/  dist/  out/)
```

`electron/main.js` bootstraps the app by calling `startServer()` from `server.js`, then loads `http://127.0.0.1:{port}/editor.html`.

---

## Checks to run

### 1. Required files exist
Use Bash `test -f` (or Read) to confirm all of these are present:
- `electron/main.js`
- `electron/preload.js`
- `electron/icon.ico`
- `server.js`
- `package.json`
- `editor.html`
- `js/locations-db.js`
- `js/campaign-data.js`
- `js/map-overlay.js`
- `js/editor.js`
- `js/map.js`
- `js/city-maps.js`

Report **PASS** or list any missing files.

### 2. Root-level directories covered by build.files
Run:
```bash
ls -d */ 2>/dev/null
```
The **only** covered root-level directories are: `electron/`, `css/`, `fonts/`, `images/`, `js/`

Flag any OTHER directories found (e.g. `config/`, `data/`, `sounds/`, `scripts/`) as **NOT INCLUDED in installer** — the user must add them to `build.files` in `package.json` if they contain needed files.

### 3. New root-level files covered
Run:
```bash
ls -p | grep -v /
```
The only covered root-level files are `*.html`, `server.js`, and `package.json`.

Flag any other root-level files (e.g. `.env`, `*.json` data files, `*.js` utilities) as **NOT INCLUDED** unless they are already explicitly listed or matched by build.files.

Note: `.env` is intentionally excluded (contains secrets) — this is correct behavior.

### 4. server.js exports still intact
Grep `server.js` for the three required exports that `electron/main.js` depends on:
```bash
grep -n "startServer\|stopServer\|getRuntimeConfig" server.js | grep "exports\|module"
```
Confirm `module.exports` includes at minimum `startServer` and `stopServer`. Report **PASS** or **FAIL**.

### 5. server.js syntax check
```bash
node --check server.js
```
Report **PASS** or the error output.

### 6. electron/main.js loads editor.html
Read `electron/main.js` and confirm it still contains:
- A call to `startServer(` from `../server`
- A `loadURL` call referencing `editor.html`

Report **PASS** or describe what changed.

### 7. package.json integrity
Read `package.json` and confirm:
- `"main": "electron/main.js"` is present
- `"build"` section has `"files"` array
- `electron-builder` is in `devDependencies`

Report **PASS** or list missing fields.

### 8. node_modules present (dev builds only)
Check that `node_modules/.bin/electron-builder` exists:
```bash
test -f node_modules/.bin/electron-builder && echo "OK" || echo "MISSING — run npm install"
```
The installer cannot be built without it.

---

## Output format

Report each check as a single line:

```
✓ Required files: all present
✓ Root directories: no uncovered directories found
✓ Root files: no uncovered files found  
✓ server.js exports: startServer + stopServer present
✓ server.js syntax: no errors
✓ electron/main.js: loads editor.html via startServer
✓ package.json: main + build.files + electron-builder present
✓ node_modules: electron-builder available

INSTALLER COMPATIBLE — no issues found.
```

Or if issues:
```
✗ Root directories: 'sounds/' is NOT covered by build.files — add "sounds/**/*" to package.json build.files if needed
✗ server.js exports: stopServer not found in module.exports

2 issues found. Fix before building installer.
```

## When to rebuild the installer

After any of these, a new installer build is needed:
- New files/directories were added to the project
- `package.json` version was bumped
- New npm dependencies were added (run `npm install` first)
- `electron/main.js` or `electron/preload.js` changed
- `server.js` API changed

To rebuild:
- **Windows:** `npm run dist:win` (produces `dist/World of Myrdae-{version}-win-x64.msi`)
- **macOS:** `npm run dist:mac` (produces `dist/World of Myrdae-{version}-mac-{arch}.dmg`)
- **Test pack only (no installer):** `npm run desktop:pack`
