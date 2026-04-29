/**
 * Re-composites display-land-composite.png from source layers, skipping 07-dark-line-detail.png.
 * Run: node scripts/recomposite-land.js
 */
const sharp = require('sharp');
const path = require('path');

const LAYERS_DIR = path.join(__dirname, '..', 'images', 'map-layers');
const OUTPUT = path.join(LAYERS_DIR, 'display-land-composite.png');

// Source layers in order, skipping 07-dark-line-detail
const LAYERS = [
    { file: '02-land-base.png',       opacity: 1.0 },
    { file: '03-lowlands-green.png',  opacity: 0.55 },
    { file: '04-desert.png',          opacity: 1.0 },
    { file: '05-mountains-relief.png',opacity: 1.0 },
    { file: '06-snow-and-ice.png',    opacity: 1.0 },
    { file: '08-coastline-mask.png',  opacity: 1.0 },
];

async function main() {
    console.log('Reading base layer...');
    const basePath = path.join(LAYERS_DIR, LAYERS[0].file);
    const base = sharp(basePath).png();
    const { width, height } = await base.metadata();
    console.log(`Canvas: ${width}x${height}`);

    const compositeInputs = [];
    for (const layer of LAYERS.slice(1)) {
        const layerPath = path.join(LAYERS_DIR, layer.file);
        console.log(`  Adding ${layer.file} (opacity ${layer.opacity})`);
        const input = sharp(layerPath).png();
        if (layer.opacity < 1) {
            // Apply opacity by premultiplying alpha channel
            const { data, info } = await input.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
            const adjusted = Buffer.from(data);
            for (let i = 3; i < adjusted.length; i += 4) {
                adjusted[i] = Math.round(adjusted[i] * layer.opacity);
            }
            compositeInputs.push({
                input: adjusted,
                raw: { width: info.width, height: info.height, channels: 4 },
                blend: 'over',
            });
        } else {
            compositeInputs.push({ input: layerPath, blend: 'over' });
        }
    }

    console.log('Compositing...');
    await sharp(basePath)
        .composite(compositeInputs)
        .png({ compressionLevel: 8 })
        .toFile(OUTPUT);

    console.log(`Done → ${OUTPUT}`);
}

main().catch(err => { console.error(err); process.exit(1); });
