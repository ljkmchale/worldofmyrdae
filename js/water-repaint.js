/**
 * World of Myrdae - Water Repaint
 * Adds a non-destructive textured ocean layer above the base map image.
 */
const WaterRepaint = (function () {
    const instances = new Map();

    const DEFAULTS = {
        layerIdSuffix: '-water-repaint',
        opacity: 0.42,
        mixBlendMode: 'screen',
        textureScale: 340,
        highlightPasses: 1400,
        shimmerPasses: 700,
        cloudPasses: 42
    };

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function createCanvas(width, height) {
        if (typeof OffscreenCanvas !== 'undefined') {
            return new OffscreenCanvas(width, height);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    function getCanvasContext(canvas) {
        return canvas.getContext('2d', { willReadFrequently: true });
    }

    function buildWaterMask(mapImg, width, height) {
        const sourceCanvas = createCanvas(width, height);
        const sourceCtx = getCanvasContext(sourceCanvas);
        sourceCtx.drawImage(mapImg, 0, 0, width, height);

        const sourceData = sourceCtx.getImageData(0, 0, width, height);
        const pixels = sourceData.data;
        const maskCanvas = createCanvas(width, height);
        const maskCtx = getCanvasContext(maskCanvas);
        const maskData = maskCtx.createImageData(width, height);
        const maskPixels = maskData.data;

        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max === 0 ? 0 : (max - min) / max;
            const blueLead = b - Math.max(r, g);
            const coolBias = b - ((r * 0.65) + (g * 0.35));
            const brightness = max / 255;

            let score = 0;
            score += clamp((blueLead + 10) / 70, 0, 1) * 0.55;
            score += clamp((coolBias + 16) / 95, 0, 1) * 0.3;
            score += clamp((saturation - 0.08) / 0.45, 0, 1) * 0.15;

            if (b > 92 && g > r && brightness > 0.2 && brightness < 0.92) {
                score += 0.15;
            }

            const alpha = Math.round(clamp(score, 0, 1) * 255);
            maskPixels[i] = 255;
            maskPixels[i + 1] = 255;
            maskPixels[i + 2] = 255;
            maskPixels[i + 3] = alpha;
        }

        maskCtx.putImageData(maskData, 0, 0);
        return maskCanvas;
    }

    function renderTexture(width, height, settings) {
        const textureCanvas = createCanvas(width, height);
        const ctx = getCanvasContext(textureCanvas);

        ctx.clearRect(0, 0, width, height);

        const deepWash = ctx.createLinearGradient(0, 0, width, height);
        deepWash.addColorStop(0, 'rgba(138, 211, 242, 0.07)');
        deepWash.addColorStop(0.48, 'rgba(94, 174, 214, 0.03)');
        deepWash.addColorStop(1, 'rgba(219, 246, 255, 0.08)');
        ctx.fillStyle = deepWash;
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = 'screen';

        for (let i = 0; i < settings.cloudPasses; i += 1) {
            const radius = (Math.random() * 0.12 + 0.06) * Math.max(width, height);
            const x = Math.random() * width;
            const y = Math.random() * height;
            const alpha = 0.025 + Math.random() * 0.03;
            const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
            glow.addColorStop(0, `rgba(228, 249, 255, ${alpha})`);
            glow.addColorStop(0.58, `rgba(173, 223, 244, ${alpha * 0.4})`);
            glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = glow;
            ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        }

        ctx.lineCap = 'round';

        for (let i = 0; i < settings.highlightPasses; i += 1) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const length = settings.textureScale * (0.3 + Math.random() * 0.85);
            const angle = (-24 + Math.random() * 18) * (Math.PI / 180);
            const alpha = 0.012 + Math.random() * 0.03;

            ctx.strokeStyle = `rgba(246, 251, 255, ${alpha})`;
            ctx.lineWidth = 0.7 + Math.random() * 1.7;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
            ctx.stroke();
        }

        for (let i = 0; i < settings.shimmerPasses; i += 1) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const length = settings.textureScale * (0.08 + Math.random() * 0.18);
            const angle = (-14 + Math.random() * 20) * (Math.PI / 180);
            const alpha = 0.018 + Math.random() * 0.025;

            ctx.strokeStyle = `rgba(214, 241, 255, ${alpha})`;
            ctx.lineWidth = 0.5 + Math.random() * 0.9;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
            ctx.stroke();
        }

        return textureCanvas;
    }

    function compositeLayer(mapImg, targetCanvas, settings) {
        const width = mapImg.naturalWidth;
        const height = mapImg.naturalHeight;
        const ctx = targetCanvas.getContext('2d');

        targetCanvas.width = width;
        targetCanvas.height = height;

        const maskCanvas = buildWaterMask(mapImg, width, height);
        const textureCanvas = renderTexture(width, height, settings);

        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(textureCanvas, 0, 0);
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(maskCanvas, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
    }

    function ensureLayer(container, mapImg, options = {}) {
        const settings = { ...DEFAULTS, ...options };
        const layerId = `${container.id}${settings.layerIdSuffix}`;
        const layerGroup = document.getElementById('map-layer-group') || mapImg.parentNode;

        let canvas = document.getElementById(layerId);
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = layerId;
            canvas.className = 'water-repaint-layer';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '1';
            canvas.style.opacity = String(settings.opacity);
            canvas.style.mixBlendMode = settings.mixBlendMode;
            layerGroup.insertBefore(canvas, mapImg.nextSibling);
        }

        compositeLayer(mapImg, canvas, settings);
        instances.set(container.id, { canvas, settings });
        return canvas;
    }

    function init(containerId, imageId, options = {}) {
        const container = document.getElementById(containerId);
        const mapImg = document.getElementById(imageId);
        if (!container || !mapImg) return null;

        const setup = () => ensureLayer(container, mapImg, options);
        if (mapImg.complete && mapImg.naturalWidth) {
            return setup();
        }

        mapImg.addEventListener('load', setup, { once: true });
        return null;
    }

    function refresh(containerId, imageId, options = {}) {
        return init(containerId, imageId, options);
    }

    return {
        init,
        refresh
    };
})();
