/**
 * Inpaints baked dark outlines in 02-land-base.png, rebuilds
 * display-land-composite.png from the cleaned source layers, then applies
 * the same pixel cleanup to the runtime composite.
 *
 * The coastline/land outlines are baked into the base land image, not stored
 * as a separate layer. Dark opaque pixels are detected and replaced with a
 * weighted average of nearby non-dark pixels.
 *
 * Run: node scripts/remove-outlines.js
 */
const sharp = require('sharp');
const path = require('path');

const LAYERS_DIR = path.join(__dirname, '..', 'images', 'map-layers');

const SOURCE_FILES = [
    '02-land-base.png',
];

const DISPLAY_FILES = [
    'display-land-composite.png',
];

// Pixels with luminance below this are considered outline pixels.
const DARK_THRESHOLD = 55;
// Radius to search for non-dark neighbors.
const SEARCH_RADIUS = 6;

function luminance(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

function isDark(r, g, b, a) {
    if (a < 10) return false;
    return luminance(r, g, b) < DARK_THRESHOLD;
}

async function processFile(filename) {
    const inputPath = path.join(LAYERS_DIR, filename);
    console.log(`Processing ${filename}...`);

    const img = sharp(inputPath).ensureAlpha();
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;

    const out = Buffer.from(data);

    const darkMask = new Uint8Array(width * height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * channels;
            if (isDark(data[i], data[i + 1], data[i + 2], data[i + 3])) {
                darkMask[y * width + x] = 1;
            }
        }
    }

    let replaced = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (!darkMask[y * width + x]) continue;

            let rSum = 0;
            let gSum = 0;
            let bSum = 0;
            let wSum = 0;

            for (let dy = -SEARCH_RADIUS; dy <= SEARCH_RADIUS; dy++) {
                for (let dx = -SEARCH_RADIUS; dx <= SEARCH_RADIUS; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
                    if (darkMask[ny * width + nx]) continue;

                    const ni = (ny * width + nx) * channels;
                    const na = data[ni + 3];
                    if (na < 10) continue;

                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const weight = 1 / (dist + 0.5);
                    rSum += data[ni] * weight;
                    gSum += data[ni + 1] * weight;
                    bSum += data[ni + 2] * weight;
                    wSum += weight;
                }
            }

            const i = (y * width + x) * channels;
            if (wSum > 0) {
                out[i] = Math.round(rSum / wSum);
                out[i + 1] = Math.round(gSum / wSum);
                out[i + 2] = Math.round(bSum / wSum);
                replaced++;
            }
        }
    }

    console.log(`  Replaced ${replaced.toLocaleString()} dark pixels`);

    await sharp(out, { raw: { width, height, channels } })
        .png({ compressionLevel: 8 })
        .toFile(inputPath);

    console.log(`  Saved -> ${filename}`);
}

async function main() {
    for (const file of SOURCE_FILES) {
        await processFile(file);
    }

    console.log('\nRe-compositing display-land-composite.png...');
    const { execSync } = require('child_process');
    execSync('node scripts/recomposite-land.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

    for (const file of DISPLAY_FILES) {
        await processFile(file);
    }

    console.log('\nAll done. Reload map.html to see the result.');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
