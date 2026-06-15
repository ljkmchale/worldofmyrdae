/**
 * Generate map-based tooltip preview images for locations without true art.
 *
 * These are static crops from the active 6400x3600 runtime composite, so hover
 * tooltips can look place-specific without doing canvas work while panning.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const MAP_IMAGE = path.join(ROOT, 'images', 'myrdae-map-layers', 'Myrdae (v.4.3.a - Runtime Composite 6400).png');
const OUT_DIR = path.join(ROOT, 'images', 'tooltips', 'generated', 'locations');
const TOOLTIP_WIDTH = 560;
const TOOLTIP_HEIGHT = 300;
const CROP_WIDTH_RATIO = 0.18;
const SKIP_TYPES = new Set(['water', 'river', 'lake', 'ocean', 'sea', 'nature', 'region']);

function loadScriptGlobal(file, globalName) {
  const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${source}\nthis.__value = ${globalName};`, sandbox, { filename: file });
  return sandbox.__value;
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function hasCityArt(loc, cityMaps) {
  const keys = new Set([slugify(loc.id), slugify(loc.name)]);
  return cityMaps.some((city) => keys.has(slugify(city.id)) || keys.has(slugify(city.name)));
}

function shouldGenerate(loc, cityMaps) {
  if (!loc || !loc.id || typeof loc.x !== 'number' || typeof loc.y !== 'number') return false;
  if (loc.tooltipImage) return false;
  if (SKIP_TYPES.has(String(loc.type || '').toLowerCase())) return false;
  return !hasCityArt(loc, cityMaps);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function buildOverlaySvg(width, height, markerX, markerY, name) {
  const safeName = String(name || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  }[char]));

  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="v" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#0c0a08" stop-opacity="0.04"/>
          <stop offset="0.55" stop-color="#0a0808" stop-opacity="0.08"/>
          <stop offset="1" stop-color="#050508" stop-opacity="0.62"/>
        </linearGradient>
        <radialGradient id="g" cx="50%" cy="42%" r="72%">
          <stop offset="0" stop-color="#ffe5a6" stop-opacity="0.08"/>
          <stop offset="1" stop-color="#000000" stop-opacity="0.24"/>
        </radialGradient>
        <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#v)"/>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <circle cx="${markerX.toFixed(1)}" cy="${markerY.toFixed(1)}" r="15" fill="#d4af37" opacity="0.28" filter="url(#softGlow)"/>
      <circle cx="${markerX.toFixed(1)}" cy="${markerY.toFixed(1)}" r="8" fill="none" stroke="#f2d37b" stroke-width="2.4" opacity="0.92"/>
      <circle cx="${markerX.toFixed(1)}" cy="${markerY.toFixed(1)}" r="2.8" fill="#fff4bd" opacity="0.95"/>
      <text x="18" y="${height - 20}" font-family="Cormorant Garamond, Georgia, serif" font-size="23" fill="#f2e7c4" opacity="0.88">${safeName}</text>
    </svg>
  `);
}

async function main() {
  const world = loadScriptGlobal('js/locations-db.js', 'WORLD_LOCATIONS');
  const cityMaps = loadScriptGlobal('js/city-maps.js', 'CITY_MAPS');
  const mapMeta = await sharp(MAP_IMAGE, { limitInputPixels: false }).metadata();
  const mapWidth = mapMeta.width;
  const mapHeight = mapMeta.height;
  const cropWidth = Math.round(mapWidth * CROP_WIDTH_RATIO);
  const cropHeight = Math.round(cropWidth * TOOLTIP_HEIGHT / TOOLTIP_WIDTH);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  let generated = 0;
  let skipped = 0;

  for (const loc of world.locations || []) {
    if (!shouldGenerate(loc, cityMaps)) {
      skipped += 1;
      continue;
    }

    const centerX = (loc.x / 100) * mapWidth;
    const centerY = (loc.y / 100) * mapHeight;
    const left = Math.round(clamp(centerX - cropWidth / 2, 0, mapWidth - cropWidth));
    const top = Math.round(clamp(centerY - cropHeight * 0.58, 0, mapHeight - cropHeight));
    const markerX = (centerX - left) / cropWidth * TOOLTIP_WIDTH;
    const markerY = (centerY - top) / cropHeight * TOOLTIP_HEIGHT;
    const out = path.join(OUT_DIR, `${slugify(loc.id)}.jpg`);

    await sharp(MAP_IMAGE, { limitInputPixels: false })
      .extract({ left, top, width: cropWidth, height: cropHeight })
      .resize(TOOLTIP_WIDTH, TOOLTIP_HEIGHT, { kernel: 'lanczos3' })
      .composite([{ input: buildOverlaySvg(TOOLTIP_WIDTH, TOOLTIP_HEIGHT, markerX, markerY, loc.name), blend: 'over' }])
      .jpeg({ quality: 84, mozjpeg: true })
      .toFile(out);

    generated += 1;
  }

  console.log(`Generated ${generated} tooltip previews in ${path.relative(ROOT, OUT_DIR)}`);
  console.log(`Skipped ${skipped} locations with true art, biome/water art, or missing coordinates`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
