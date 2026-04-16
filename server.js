const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const server = http.createServer((req, res) => {
    // Handle POST request to save locations-db.js
    if (req.method === 'POST' && req.url === '/save-city-map') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const filePath = path.join(PUBLIC_DIR, 'js', 'city-maps.js');
                fs.writeFileSync(filePath, body);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'City maps saved' }));
            } catch (err) {
                console.error("Save Error:", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // GET /api/city-images — scan images/cities/ for available city map folders
    if (req.method === 'GET' && req.url === '/api/city-images') {
        try {
            const citiesDir = path.join(PUBLIC_DIR, 'images', 'cities');
            const imgExts = ['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG'];
            const results = [];

            if (fs.existsSync(citiesDir)) {
                const folders = fs.readdirSync(citiesDir).filter(f =>
                    fs.statSync(path.join(citiesDir, f)).isDirectory()
                );
                folders.forEach(folder => {
                    const folderPath = path.join(citiesDir, folder);
                    const files = fs.readdirSync(folderPath);
                    // Find the primary map image (matches folder name, excludes *-locations.*)
                    const mapFile = files.find(f => {
                        const base = path.basename(f, path.extname(f)).toLowerCase();
                        return base === folder.toLowerCase() && imgExts.includes(path.extname(f));
                    });
                    // Find the locations reference image
                    const locFile = files.find(f => f.toLowerCase().includes('location'));
                    results.push({
                        id: folder,
                        name: folder.charAt(0).toUpperCase() + folder.slice(1),
                        image: mapFile ? `images/cities/${folder}/${mapFile}` : null,
                        locationsImage: locFile ? `images/cities/${folder}/${locFile}` : null,
                    });
                });
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    if (req.method === 'POST' && req.url === '/save') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                // Ensure the path is correct
                const filePath = path.join(PUBLIC_DIR, 'js', 'locations-db.js');
                fs.writeFileSync(filePath, body);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Saved successfully to disk' }));
            } catch (err) {
                console.error("Save Error:", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // Serve Static Files
    let reqPath = req.url === '/' ? '/editor.html' : req.url;
    // Strip query strings for file resolution
    if (reqPath.includes('?')) {
        reqPath = reqPath.split('?')[0];
    }

    // Decode URL-encoded characters so filenames with spaces (e.g. %20) resolve correctly
    reqPath = decodeURIComponent(reqPath);

    let filePath = path.join(PUBLIC_DIR, reqPath);
    const extname = String(path.extname(filePath)).toLowerCase();

    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                console.log(`[404] Not Found: ${req.url}`);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File Not Found');
            } else {
                console.log(`[500] Server Error: ${error.code}`);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🗺️  World of Myrdae - Local Map Editor Server`);
    console.log(`===============================================`);
    console.log(`Ready! Open your browser and go to:`);
    console.log(`http://localhost:${PORT}/editor.html`);
    console.log(`===============================================`);
    console.log(`Press Ctrl+C to stop the server.`);
});
