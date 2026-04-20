const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const net = require('net');

const DEFAULT_PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const COMFY_PORT = 8188;
const DEFAULT_BUNDLED_ROOT = __dirname;

// Simple .env loader
if (fs.existsSync(path.join(__dirname, '.env'))) {
    const env = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    env.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key && value.length > 0) process.env[key.trim()] = value.join('=').trim();
    });
}
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let comfyProcess = null;
let server = null;
let runtimeConfig = createRuntimeConfig();

function createRuntimeConfig(options = {}) {
    const bundledRoot = path.resolve(options.bundledRoot || DEFAULT_BUNDLED_ROOT);
    const bundledRootReal = fs.realpathSync(bundledRoot);
    const requestedDataRoot = options.dataRoot
        ? path.resolve(options.dataRoot)
        : (process.env.MYRDAE_DATA_DIR ? path.resolve(process.env.MYRDAE_DATA_DIR) : bundledRootReal);

    fs.mkdirSync(requestedDataRoot, { recursive: true });

    const requestedPort = options.port !== undefined ? Number(options.port) : DEFAULT_PORT;

    return {
        port: Number.isFinite(requestedPort) ? requestedPort : DEFAULT_PORT,
        bundledRootReal,
        dataRootReal: fs.realpathSync(requestedDataRoot),
        autoStartComfy: options.autoStartComfy !== false
    };
}

function normalizeRelativePath(requestPath) {
    const relativePath = requestPath.startsWith('/') ? requestPath.slice(1) : requestPath;
    return relativePath.replace(/\\/g, '/');
}

function resolveWithinRoot(rootReal, requestPath) {
    const relativePath = normalizeRelativePath(requestPath);
    const resolvedPath = path.resolve(rootReal, relativePath);
    const relative = path.relative(rootReal, resolvedPath);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
        throw new Error('Path escapes public directory');
    }
    return resolvedPath;
}

function isMutableRelativePath(requestPath) {
    const relativePath = normalizeRelativePath(requestPath);
    return relativePath === 'js/locations-db.js' ||
        relativePath === 'js/city-maps.js' ||
        relativePath === 'js/cities' ||
        relativePath.startsWith('js/cities/') ||
        relativePath === 'images/cities' ||
        relativePath.startsWith('images/cities/');
}

function resolvePublicPath(requestPath) {
    if (isMutableRelativePath(requestPath)) {
        const dataPath = resolveWithinRoot(runtimeConfig.dataRootReal, requestPath);
        if (fs.existsSync(dataPath)) {
            return dataPath;
        }
    }

    return resolveWithinRoot(runtimeConfig.bundledRootReal, requestPath);
}

function resolveWritablePath(requestPath) {
    if (!isMutableRelativePath(requestPath)) {
        throw new Error('Path is read-only in packaged builds');
    }

    return resolveWithinRoot(runtimeConfig.dataRootReal, requestPath);
}

function mergeUnique(entries) {
    const seen = new Set();
    return entries.filter((entry) => {
        if (seen.has(entry.id)) return false;
        seen.add(entry.id);
        return true;
    });
}

function parseComfyHost(rawHost, { localOnly = false } = {}) {
    const host = rawHost || 'http://127.0.0.1:8188';
    const parsed = new URL(host);
    const isLocalHost = ['127.0.0.1', 'localhost', '::1'].includes(parsed.hostname);

    if (localOnly && !isLocalHost) {
        throw new Error('Only local ComfyUI hosts are allowed');
    }

    return parsed;
}

function getHttpModuleForUrl(targetUrl) {
    return targetUrl.protocol === 'https:' ? require('https') : http;
}

// Function to check if a port is in use
function isPortInUse(port) {
    return new Promise((resolve) => {
        const server = net.createServer()
            .once('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .once('listening', () => {
                server.close();
                resolve(false);
            })
            .listen(port);
    });
}

// Function to start ComfyUI in the background
async function startComfyUI() {
    const comfyRunning = await isPortInUse(COMFY_PORT);
    if (comfyRunning) {
        console.log(`[AI] ComfyUI is already running on port ${COMFY_PORT}. Connecting to existing instance.`);
        return;
    }

    const comfyDir = path.join(path.dirname(runtimeConfig.bundledRootReal), 'ComfyUI');
    const pythonExe = path.join(comfyDir, 'venv', 'Scripts', 'python.exe');

    if (fs.existsSync(pythonExe)) {
        console.log(`[AI] Starting ComfyUI server with GPU acceleration...`);
        comfyProcess = spawn(pythonExe, ['main.py'], {
            cwd: comfyDir,
            stdio: 'inherit' // This pipes ComfyUI output to your terminal
        });

        comfyProcess.on('error', (err) => {
            console.error(`[AI] Failed to start ComfyUI: ${err.message}`);
        });

        comfyProcess.on('close', (code) => {
            console.log(`[AI] ComfyUI process exited with code ${code}`);
        });
    } else {
        console.warn(`[AI] ComfyUI not found at ${comfyDir}. Skipping auto-start.`);
    }
}

function handleRequest(req, res) {
    // Normalize URL: strip query strings and trailing slashes (except for root)
    let url = req.url.split('?')[0];
    if (url !== '/' && url.endsWith('/')) {
        url = url.slice(0, -1);
    }

    // Handle POST request to save a single city file (js/cities/<id>.js)
    if (req.method === 'POST' && url.startsWith('/save-city/')) {
        const cityId = url.slice('/save-city/'.length);
        if (!/^[a-z0-9-]+$/i.test(cityId) || cityId.length > 80) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Invalid city ID' }));
            return;
        }
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const citiesDir = resolveWritablePath('js/cities');
                fs.mkdirSync(citiesDir, { recursive: true });
                const filePath = path.join(citiesDir, cityId + '.js');
                const relative = path.relative(citiesDir, filePath);
                if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Invalid path');
                fs.writeFileSync(filePath, body);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'City saved: ' + cityId }));
            } catch (err) {
                console.error('Save City Error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // Handle POST request to save city-maps.js (thin index)
    if (req.method === 'POST' && url === '/save-city-map') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const filePath = resolveWritablePath('js/city-maps.js');
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

    // GET /api/ai/comfy-proxy — proxy GET requests to ComfyUI (e.g. history polling)
    if (req.method === 'GET' && url === '/api/ai/comfy-proxy') {
        try {
            const params = new URL(req.url, `http://${req.headers.host}`).searchParams;
            const host = parseComfyHost(params.get('host'));
            const endpoint = params.get('endpoint') || '/';
            const targetUrl = new URL(endpoint, host);
            const mod = getHttpModuleForUrl(targetUrl);
            mod.get(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (proxyRes) => {
                let responseBody = '';
                proxyRes.on('data', chunk => { responseBody += chunk; });
                proxyRes.on('end', () => {
                    res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
                    res.end(responseBody);
                });
            }).on('error', (err) => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'ComfyUI unreachable: ' + err.message }));
            });
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    // AI Proxy to local ComfyUI instance
    if (req.method === 'POST' && url === '/api/ai/comfy-proxy') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const host = parseComfyHost(data.host);
                const endpoint  = data.endpoint || '/prompt';

                const urlObj = new URL(endpoint, host);
                const options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                };

                const requestModule = getHttpModuleForUrl(urlObj);
                const proxyReq = requestModule.request(urlObj, options, (proxyRes) => {
                    let responseBody = '';
                    proxyRes.on('data', chunk => { responseBody += chunk; });
                    proxyRes.on('end', () => {
                        res.writeHead(proxyRes.statusCode, proxyRes.headers);
                        res.end(responseBody);
                    });
                });

                proxyReq.on('error', (err) => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'ComfyUI unreachable: ' + err.message }));
                });

                proxyReq.write(JSON.stringify(data.payload));
                proxyReq.end();
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // Upload a local image to ComfyUI's input directory
    if (req.method === 'POST' && url === '/api/ai/upload-to-comfy') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { host, localPath } = JSON.parse(body);
                if (!localPath) {
                    throw new Error('Missing localPath');
                }
                const comfyHost = parseComfyHost(host, { localOnly: true });
                const filePath = resolvePublicPath(localPath);
                const fileData = fs.readFileSync(filePath);
                const filename = path.basename(filePath);
                const boundary = '----MyrdaeBoundary' + Date.now();
                const preamble = Buffer.from(
                    `--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="${filename}"\r\nContent-Type: image/png\r\n\r\n`
                );
                const epilogue = Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="type"\r\n\r\ninput\r\n--${boundary}--\r\n`);
                const multipart = Buffer.concat([preamble, fileData, epilogue]);
                const urlObj = new URL('/upload/image', comfyHost);
                const options = { method: 'POST', headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': multipart.length } };
                const requestModule = getHttpModuleForUrl(urlObj);
                const proxyReq = requestModule.request(urlObj, options, (proxyRes) => {
                    let rb = '';
                    proxyRes.on('data', c => { rb += c; });
                    proxyRes.on('end', () => { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(rb); });
                });
                proxyReq.on('error', (err) => { res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: err.message })); });
                proxyReq.write(multipart);
                proxyReq.end();
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // AI Image Save Route — download generated image from ComfyUI and store locally
    if (req.method === 'POST' && url === '/api/ai/save-image') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const { cityId, comfyUrl } = JSON.parse(body);
                if (!cityId || !comfyUrl) throw new Error('Missing cityId or comfyUrl');

                const safeId = cityId.replace(/[^a-z0-9-]/gi, '-');
                const cityDir = resolveWritablePath(path.join('images', 'cities', safeId));
                fs.mkdirSync(cityDir, { recursive: true });
                const destPath = path.join(cityDir, safeId + '.png');

                function fetchBuf(targetUrl, depth) {
                    depth = depth || 0;
                    return new Promise((resolve, reject) => {
                        if (depth > 8) { reject(new Error('Too many redirects')); return; }
                        const parsedTargetUrl = new URL(targetUrl);
                        const mod = getHttpModuleForUrl(parsedTargetUrl);
                        mod.get(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (r) => {
                            if ([301, 302, 307, 308].includes(r.statusCode) && r.headers.location) {
                                fetchBuf(r.headers.location, depth + 1).then(resolve, reject);
                                return;
                            }
                            if (r.statusCode !== 200) { reject(new Error('HTTP ' + r.statusCode)); return; }
                            const chunks = [];
                            r.on('data', c => chunks.push(c));
                            r.on('end', () => resolve(Buffer.concat(chunks)));
                            r.on('error', reject);
                        }).on('error', reject);
                    });
                }

                console.log('[AI] Downloading generated image from ComfyUI:', comfyUrl);
                const imgBuf = await fetchBuf(comfyUrl);
                fs.writeFileSync(destPath, imgBuf);
                console.log('[AI] Saved image to:', destPath);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, localPath: `images/cities/${safeId}/${safeId}.png` }));
            } catch (err) {
                console.error('[AI] save-image error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // Proxy to fetch Google Doc text
    if (req.method === 'GET' && url === '/api/ai/fetch-google-doc') {
        const docUrl = new URL(req.url, `http://${req.headers.host}`).searchParams.get('url');
        if (!docUrl) {
            res.writeHead(400); res.end('Missing URL'); return;
        }

        const https = require('https');

        function fetchWithRedirects(targetUrl, depth = 0) {
            if (depth > 5) {
                res.writeHead(500); res.end('Too many redirects');
                return;
            }

            const options = {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            };

            https.get(targetUrl, options, (proxyRes) => {
                if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302 || proxyRes.statusCode === 307 || proxyRes.statusCode === 308) {
                    const nextUrl = proxyRes.headers.location;
                    console.log(`[AI] Redirecting to: ${nextUrl}`);
                    fetchWithRedirects(nextUrl, depth + 1);
                    return;
                }

                if (proxyRes.statusCode !== 200) {
                    console.error(`[AI] Google Fetch Failed. Status: ${proxyRes.statusCode}`);
                    res.writeHead(proxyRes.statusCode);
                    if (proxyRes.statusCode === 403) {
                        res.end('Access Denied: Is the document set to "Anyone with the link can view"?');
                    } else if (proxyRes.statusCode === 404) {
                        res.end('Document Not Found: Check the URL ID.');
                    } else {
                        res.end(`Google returned error code: ${proxyRes.statusCode}`);
                    }
                    return;
                }

                let body = '';
                proxyRes.on('data', chunk => body += chunk);
                proxyRes.on('end', () => {
                    res.writeHead(200, { 
                        'Content-Type': 'text/plain', 
                        'Access-Control-Allow-Origin': '*' 
                    });
                    res.end(body);
                });
            }).on('error', (err) => {
                console.error('[AI] Fetch Error:', err);
                res.writeHead(500); res.end(err.message);
            });
        }

        console.log(`[AI] Fetching Google Doc: ${docUrl}`);
        fetchWithRedirects(docUrl);
        return;
    }

    // GET /api/city-images — scan images/cities/ for available city map folders
    if (req.method === 'GET' && url === '/api/city-images') {
        try {
            const imgExts = ['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG'];
            const results = [];

            const scannedDirs = [
                path.join(runtimeConfig.dataRootReal, 'images', 'cities'),
                path.join(runtimeConfig.bundledRootReal, 'images', 'cities')
            ];

            for (const citiesDir of scannedDirs) {
                if (!fs.existsSync(citiesDir)) continue;

                const folders = fs.readdirSync(citiesDir).filter(f =>
                    fs.statSync(path.join(citiesDir, f)).isDirectory()
                );
                folders.forEach(folder => {
                    const folderPath = path.join(citiesDir, folder);
                    const files = fs.readdirSync(folderPath);
                    const mapFile = files.find(f => {
                        const base = path.basename(f, path.extname(f)).toLowerCase();
                        return base === folder.toLowerCase() && imgExts.includes(path.extname(f));
                    });
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
            res.end(JSON.stringify(mergeUnique(results)));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    // GET /api/ai/parse-gazetteer — fetch Google Doc as HTML, extract crest/map/locations
    if (req.method === 'GET' && url === '/api/ai/parse-gazetteer') {
        (async () => {
            try {
                const params = new URL(req.url, `http://${req.headers.host}`).searchParams;
                const rawDocUrl = params.get('url');
                const cityId = (params.get('cityId') || 'unknown').replace(/[^a-z0-9-]/gi, '-');

                if (!rawDocUrl) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing url parameter' }));
                    return;
                }

                const https = require('https');

                // Convert txt export URL to HTML export URL
                const htmlExportUrl = rawDocUrl.replace(/format=\w+/, 'format=html');

                // Fetch with redirect following, returns { data: Buffer, contentType: string }
                function fetchUrl(targetUrl, depth) {
                    depth = depth || 0;
                    return new Promise((resolve, reject) => {
                        if (depth > 8) { reject(new Error('Too many redirects')); return; }
                        const mod = targetUrl.startsWith('https') ? https : http;
                        mod.get(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (r) => {
                            if ([301, 302, 307, 308].includes(r.statusCode) && r.headers.location) {
                                fetchUrl(r.headers.location, depth + 1).then(resolve, reject);
                                return;
                            }
                            if (r.statusCode !== 200) { reject(new Error('HTTP ' + r.statusCode)); return; }
                            const chunks = [];
                            r.on('data', c => chunks.push(c));
                            r.on('end', () => resolve({ data: Buffer.concat(chunks), contentType: r.headers['content-type'] || '' }));
                            r.on('error', reject);
                        }).on('error', reject);
                    });
                }

                // Download a remote image and save to destPath, returns true on success
                async function downloadImage(imageUrl, destPath) {
                    if (imageUrl.startsWith('data:')) {
                        const base64Data = imageUrl.split(',')[1];
                        if (!base64Data) throw new Error('Invalid data URI');
                        const buffer = Buffer.from(base64Data, 'base64');
                        fs.mkdirSync(path.dirname(destPath), { recursive: true });
                        fs.writeFileSync(destPath, buffer);
                        return true;
                    }
                    const result = await fetchUrl(imageUrl);
                    // Only save if it looks like an image
                    const ct = result.contentType.toLowerCase();
                    if (!ct.includes('image') && result.data.length < 100) throw new Error('Not an image');
                    fs.mkdirSync(path.dirname(destPath), { recursive: true });
                    fs.writeFileSync(destPath, result.data);
                    return true;
                }

                // Strip HTML tags, decode entities, collapse whitespace
                function stripHtml(html) {
                    // 1. Extract body content
                    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
                    let content = bodyMatch ? bodyMatch[1] : html;

                    // 2. Aggressively remove style and script tags + their content
                    // We use a loop to ensure we catch every single one
                    while (content.includes('<style') || content.includes('<script')) {
                        const newContent = content
                            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
                        if (newContent === content) break;
                        content = newContent;
                    }

                    return content
                        // Handle tables: add spaces between cells, newlines between rows
                        .replace(/<\/tr>/gi, '\n')
                        .replace(/<\/td>/gi, '  ')
                        .replace(/<\/th>/gi, '  ')
                        // Replace line-breaking tags with newlines
                        .replace(/<br\s*\/?>/gi, '\n')
                        .replace(/<\/p>/gi, '\n')
                        .replace(/<\/div>/gi, '\n')
                        .replace(/<\/li>/gi, '\n')
                        .replace(/<\/h[1-6]>/gi, '\n')
                        // Remove all remaining tags
                        .replace(/<[^>]+>/g, '')
                        // Decode entities
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&nbsp;/g, ' ')
                        .replace(/\xa0/g, ' ') // Non-breaking space
                        .replace(/&#39;/g, "'")
                        .replace(/&rsquo;/g, "'")
                        .replace(/&lsquo;/g, "'")
                        .replace(/&rdquo;/g, '"')
                        .replace(/&ldquo;/g, '"')
                        .replace(/&quot;/g, '"')
                        // Cleanup whitespace
                        .replace(/[ \t]+/g, ' ')
                        .replace(/\r/g, '')
                        .replace(/\n[ \t]+/g, '\n')
                        .replace(/\n{3,}/g, '\n\n')
                        .trim();
                }

                // Fetch document as HTML
                console.log('[AI] Fetching gazetteer HTML:', htmlExportUrl);
                const { data: htmlBuf } = await fetchUrl(htmlExportUrl);
                const html = htmlBuf.toString('utf8');

                // Extract all image src URLs
                const allImages = [...html.matchAll(/<img[^>]+src="([^"]+)"/gi)].map(m => m[1]);

                // Split document into sections by h1/h2/h3 headings
                const headingRegex = /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi;
                const headings = [];
                let hm;
                while ((hm = headingRegex.exec(html)) !== null) {
                    headings.push({
                        text: hm[1].replace(/<[^>]+>/g, '').trim(),
                        index: hm.index,
                        end: hm.index + hm[0].length
                    });
                }

                // Content before the first heading (page 1 — crest lives here)
                const preHtml = headings.length > 0 ? html.slice(0, headings[0].index) : html;
                const preImages = [...preHtml.matchAll(/<img[^>]+src="([^"]+)"/gi)].map(m => m[1]);

                // Build per-section data
                const sections = headings.map((h, i) => {
                    const sHtml = html.slice(h.end, i + 1 < headings.length ? headings[i + 1].index : html.length);
                    return {
                        heading: h.text,
                        text: stripHtml(sHtml),
                        images: [...sHtml.matchAll(/<img[^>]+src="([^"]+)"/gi)].map(m => m[1])
                    };
                });

                // Identify key sections
                const mapSection = sections.find(s => /^(map|city\s*map)$/i.test(s.heading.trim()));
                const locSectionIdx = sections.findIndex(s =>
                    /notable.?locations?/i.test(s.heading) ||
                    /^locations?$/i.test(s.heading.trim()) ||
                    /points? of interest/i.test(s.heading)
                );
                const locSection = locSectionIdx !== -1 ? sections[locSectionIdx] : null;

                // If the Notable Locations section itself has no body text, the doc uses headings
                // per location — collect all sub-section text until the next major section
                if (locSection && locSection.text.trim().length < 50 && locSectionIdx !== -1) {
                    const majorSectionKeywords = /^(non-player characters|services provided|approaching|entering|lodging|meals|unique items|npc|overview|history|government|economy|religion|traditions|laws|punishment)$/i;
                    const subTexts = [];
                    for (let si = locSectionIdx + 1; si < sections.length; si++) {
                        const s = sections[si];
                        if (!majorSectionKeywords.test(s.heading.trim())) {
                            subTexts.push(s.heading + (s.text ? '\n' + s.text : ''));
                        }
                    }
                    locSection.text = subTexts.join('\n\n');
                }

                // Source URLs for crest, map, and numbered-locations overlay
                const crestSrcUrl    = preImages[0] || allImages[0] || null;
                const mapSrcUrl      = mapSection && mapSection.images.length > 0 ? mapSection.images[0] : null;

                // Smarter overlay discovery: 
                // 1. Second image in Map section
                // 2. First image in Locations section
                // 3. Next image in doc after the map
                let locOverlaySrcUrl = null;
                if (mapSection && mapSection.images.length > 1) {
                    locOverlaySrcUrl = mapSection.images[1];
                } else if (locSection && locSection.images.length > 0) {
                    locOverlaySrcUrl = locSection.images[0];
                } else if (mapSrcUrl) {
                    const mapIdx = allImages.indexOf(mapSrcUrl);
                    if (mapIdx !== -1 && allImages[mapIdx + 1]) {
                        locOverlaySrcUrl = allImages[mapIdx + 1];
                    }
                }

                // Save images locally... (rest of logic)
                const cityDir = resolveWritablePath(path.join('images', 'cities', cityId));
                fs.mkdirSync(cityDir, { recursive: true });

                let crestLocalPath = null;
                if (crestSrcUrl) {
                    try {
                        await downloadImage(crestSrcUrl, path.join(cityDir, 'crest.png'));
                        crestLocalPath = `images/cities/${cityId}/crest.png`;
                        console.log('[AI] Crest saved:', crestLocalPath);
                    } catch (e) {
                        console.warn('[AI] Crest download failed:', e.message);
                    }
                }

                let mapLocalPath = null;
                if (mapSrcUrl) {
                    try {
                        // Save as sketch.png so it can be used as a reference for generation
                        await downloadImage(mapSrcUrl, path.join(cityDir, 'sketch.png'));
                        mapLocalPath = `images/cities/${cityId}/sketch.png`;
                        console.log('[AI] Reference sketch saved:', mapLocalPath);
                    } catch (e) {
                        console.warn('[AI] Map download failed:', e.message);
                    }
                }

                let locOverlayLocalPath = null;
                if (locOverlaySrcUrl) {
                    try {
                        await downloadImage(locOverlaySrcUrl, path.join(cityDir, 'locations-reference.png'));
                        locOverlayLocalPath = `images/cities/${cityId}/locations-reference.png`;
                        console.log('[AI] Locations reference saved:', locOverlayLocalPath);
                    } catch (e) {
                        console.warn('[AI] Locations overlay download failed:', e.message);
                    }
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    crest: {
                        found: !!crestLocalPath,
                        localPath: crestLocalPath,
                        originalUrl: crestSrcUrl
                    },
                    map: {
                        found: !!mapLocalPath,
                        localPath: mapLocalPath,
                        originalUrl: mapSrcUrl
                    },
                    locationsOverlay: {
                        found: !!locOverlayLocalPath,
                        localPath: locOverlayLocalPath,
                        originalUrl: locOverlaySrcUrl
                    },
                    locations: {
                        found: !!locSection,
                        heading: locSection ? locSection.heading : '',
                        text: locSection ? locSection.text : ''
                    },
                    mapSection: {
                        found: !!mapSection,
                        heading: mapSection ? mapSection.heading : '',
                        text: mapSection ? mapSection.text : ''
                    },
                    sections: sections.map(s => ({
                        heading: s.heading,
                        imageCount: s.images.length,
                        textLength: s.text.length
                    })),
                    fullText: stripHtml(html),
                    imageCount: allImages.length
                }));

            } catch (err) {
                console.error('[AI] parse-gazetteer error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        })();
        return;
    }

    // Proxy to AI Summarize (Gemini)
    if (req.method === 'POST' && url === '/api/ai/summarize') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                if (!GEMINI_API_KEY) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'GEMINI_API_KEY not found in .env file.' }));
                    return;
                }

                const { text } = JSON.parse(body);
                const aiPrompt = `Identify and summarize ALL numbered locations from the map or notable locations section of this city gazetteer.

CONSTRAINTS:
1. Find every location entry that follows a pattern like "1. Name" or "1) Name" or a numbered table — include ALL of them.
2. IGNORE tables containing prices (gp, sp, cp), item lists (Saddles, Barding), or lodging rate schedules.
3. For each location, write a 2-3 sentence 'Box Text' description. Focus on atmosphere, smells, and immediate visual layout.
4. EXCLUDE NPC stat blocks, prices, and mechanical game rules.
5. FORMAT each entry as: "Number. Name: Description"
6. Output ONLY the numbered list. No intro, no outro, no section headers.

GAZETTEER TEXT:
${text}`;

                const https = require('https');
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
                
                const aiReqBody = JSON.stringify({
                    contents: [{ parts: [{ text: aiPrompt }] }]
                });

                const aiReq = https.request(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                }, (aiRes) => {
                    let aiResponseBody = '';
                    aiRes.on('data', chunk => aiResponseBody += chunk);
                    aiRes.on('end', () => {
                        try {
                            const aiData = JSON.parse(aiResponseBody);
                            if (aiData.candidates && aiData.candidates[0].content) {
                                const summary = aiData.candidates[0].content.parts[0].text;
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ summary }));
                            } else {
                                throw new Error('AI Error: ' + JSON.stringify(aiData.error || aiData));
                            }
                        } catch (e) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: e.message }));
                        }
                    });
                });

                aiReq.on('error', (err) => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'AI Request failed: ' + err.message }));
                });

                aiReq.write(aiReqBody);
                aiReq.end();

            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    if (req.method === 'POST' && url === '/save') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                // Ensure the path is correct
                const filePath = resolveWritablePath('js/locations-db.js');
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
    let reqPath = url === '/' ? '/editor.html' : url;

    // Decode URL-encoded characters so filenames with spaces (e.g. %20) resolve correctly
    try {
        reqPath = decodeURIComponent(reqPath);
    } catch (err) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
        return;
    }

    let filePath;
    try {
        filePath = resolvePublicPath(reqPath);
    } catch (err) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }
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
}

function logServerReady(port) {
    console.log(`===============================================`);
    console.log(`World of Myrdae - Local Map Editor Server`);
    console.log(`===============================================`);
    console.log(`Ready! Open your browser and go to:`);
    console.log(`http://localhost:${port}/editor.html`);
    if (runtimeConfig.dataRootReal !== runtimeConfig.bundledRootReal) {
        console.log(`Writable data directory: ${runtimeConfig.dataRootReal}`);
    }
    console.log(`===============================================`);
    console.log(`Press Ctrl+C to stop the server.`);
}

function startServer(options = {}) {
    runtimeConfig = createRuntimeConfig(options);

    if (server && server.listening) {
        const address = server.address();
        return Promise.resolve({
            server,
            port: address && typeof address === 'object' ? address.port : runtimeConfig.port,
            dataRoot: runtimeConfig.dataRootReal
        });
    }

    server = http.createServer(handleRequest);

    return new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(runtimeConfig.port, () => {
            const address = server.address();
            const actualPort = address && typeof address === 'object' ? address.port : runtimeConfig.port;

            logServerReady(actualPort);

            if (runtimeConfig.autoStartComfy) {
                startComfyUI().catch(err => {
                    console.warn(`[AI] Failed to auto-start ComfyUI: ${err.message}`);
                });
            }

            resolve({ server, port: actualPort, dataRoot: runtimeConfig.dataRootReal });
        });
    });
}

function stopServer() {
    return new Promise((resolve) => {
        if (comfyProcess) {
            console.log(`[AI] Shutting down ComfyUI...`);
            comfyProcess.kill();
            comfyProcess = null;
        }

        if (server && server.listening) {
            server.close(() => {
                server = null;
                resolve();
            });
            return;
        }

        server = null;
        resolve();
    });
}

const cleanup = () => {
    stopServer().finally(() => process.exit());
};

if (require.main === module) {
    startServer().catch((err) => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
}

module.exports = {
    startServer,
    stopServer,
    getRuntimeConfig: () => ({ ...runtimeConfig })
};
