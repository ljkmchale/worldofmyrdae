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
