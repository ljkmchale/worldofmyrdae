---
name: start-server
description: Start the World of Myrdae local development server on port 3000
---

Start the World of Myrdae development server.

1. Check if something is already running on port 3000:
   ```bash
   lsof -ti:3000
   ```
   If a process is found, ask the user if they want to kill it first before starting.

2. Start the server in the background:
   ```bash
   node server.js &
   ```

3. Wait 1 second, then verify it's running by checking port 3000 again with `lsof -ti:3000`.

4. Tell the user the server is running and give them these links:
   - Editor: http://localhost:3000/editor.html
   - Map viewer: http://localhost:3000/map.html
   - City viewer: http://localhost:3000/city-viewer.html
   - 3D Globe: http://localhost:3000/map-3d-planet.html
   - Home: http://localhost:3000/index.html

If the server fails to start, show the error output.
