# Map Editor Cloudflare Tunnel

The map editor is exposed through the existing named Cloudflare Tunnel:

```text
campaign-brain
```

Cloudflare DNS routes this public hostname into the tunnel:

```text
https://mapeditor.suwaneegamers.net
```

The local map editor server listens on port `4615`. The local ingress rule lives in:

```text
C:\Users\Larry McHale\.cloudflared\config.yml
```

Current ingress:

```yaml
ingress:
  - hostname: mapeditor.suwaneegamers.net
    service: http://localhost:4615
  - hostname: kb.suwaneegamers.net
    service: http://localhost:4317
  - service: http_status:404
```

The Cloudflared Windows service starts automatically. The map editor Node server is started by this repo script:

```powershell
npm run share:map-editor
```

Larry's Windows Startup folder also contains `WorldOfMyrdaeMapEditor.cmd`, which runs the same startup script at sign-in.

Because Windows service creation requires an elevated shell, the current non-admin setup uses a logon watchdog instead of a registered Windows service. The watchdog script is:

```text
scripts/run-map-editor-service.ps1
```

It checks port `4615` every 15 seconds and restarts the Node server if it is not listening. Logs are written under the ignored `.runtime/` folder.

## True Windows Service

To install the map editor as a real Windows Service, open PowerShell with **Run as administrator**, then run:

```powershell
cd "C:\Users\Larry McHale\Desktop\WorldofMyrdae"
.\scripts\install-map-editor-service.ps1
```

The installer uses WinSW as the service wrapper, creates an automatic service named `WorldOfMyrdaeMapEditor`, starts it on port `4615`, and disables the user Startup watchdog after the service is running.

To remove the service and re-enable the Startup watchdog:

```powershell
cd "C:\Users\Larry McHale\Desktop\WorldofMyrdae"
.\scripts\uninstall-map-editor-service.ps1
```

## Access Control

The map editor no longer has its own password gate. Editor access is expected to be controlled by the embedding site or admin panel, such as the Suwanee Gamers admin surface.

Public viewer pages such as `/map.html`, `/embed-map.html`, and city viewer pages remain readable directly.

## Useful Commands

Check the tunnel:

```powershell
cloudflared tunnel info campaign-brain
```

Add or repair the DNS route:

```powershell
cloudflared tunnel route dns campaign-brain mapeditor.suwaneegamers.net
```

Start the local editor server:

```powershell
npm run share:map-editor
```
