# Desktop Build Notes

This project now supports an Electron desktop wrapper for Windows and macOS.

## Development

Run the classic local server:

```powershell
npm run start
```

Run the desktop app shell:

```powershell
npm run desktop:dev
```

The Electron app starts the local HTTP server internally and stores writable data in the OS user-data folder instead of trying to edit packaged files in place.

## Writable Data In Desktop Builds

The packaged app treats most bundled files as read-only. `server.js` overlays a small mutable subset from a writable runtime data directory.

Mutable paths currently include:

- `js/locations-db.js`
- `js/city-maps.js`
- `js/cities/**`
- `images/cities/**`
- `data/campaign-clock-links.json`

The runtime data root is chosen from:

1. `MYRDAE_DATA_DIR`, if set
2. otherwise Electron's user-data folder under `world-data`

If you change persistence logic, make sure it still respects those mutability rules.

## Packaging

Build an unpacked Windows desktop bundle:

```powershell
npm run desktop:pack
```

Build a Windows MSI installer:

```powershell
npm run dist:win
```

Build a macOS DMG installer:

```bash
npm run dist:mac
```

## Platform Notes

- Windows MSI builds can be produced on Windows.
- macOS DMG builds must be produced on macOS.
- Unsigned builds are fine for local testing, but real public distribution should use Windows code signing and macOS signing/notarization.
- The repo currently includes a Windows `.ico` at `electron/icon.ico`.
- For a branded macOS app icon, add `electron/icon.icns` and point the mac build config at it.
- `electron/main.js` imports `startServer()` / `stopServer()` from `server.js`, so server export changes can break desktop startup.
