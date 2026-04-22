/**
 * Water repaint overlay for the World of Myrdae.
 *
 * The original map image remains untouched. We render a static water tint
 * once, then animate lightweight texture canvases that are explicitly
 * clipped by precomputed water masks so motion never spills onto land.
 */
const WaterRepaintRenderer = (function () {
  let baseCanvas = null;
  let motionCanvas = null;
  let foamCanvas = null;
  let resizeTimer = null;
  let animationFrameId = null;
  let animationState = null;

  const MAX_RENDER_WIDTH = 2560;
  const BLUR_PASSES = 8;
  const SHALLOW_COLOR = [184, 222, 240];
  const MID_COLOR = [82, 165, 216];
  const DEEP_COLOR = [20, 68, 128];
  const FOAM_COLOR = [246, 251, 255];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function mixColor(a, b, t) {
    return [
      Math.round(lerp(a[0], b[0], t)),
      Math.round(lerp(a[1], b[1], t)),
      Math.round(lerp(a[2], b[2], t))
    ];
  }

  function sampleNoise(x, y) {
    return (
      Math.sin(x * 0.025 + y * 0.011) * 0.45 +
      Math.sin(x * 0.010 - y * 0.019) * 0.35 +
      Math.sin((x + y) * 0.014) * 0.20
    ) * 0.5 + 0.5;
  }

  function sampleCurrent(x, y) {
    return (
      Math.sin(x * 0.022 + y * 0.004) * 0.42 +
      Math.sin((x + y) * 0.012) * 0.34 +
      Math.sin(y * 0.018 - x * 0.006) * 0.24
    ) * 0.5 + 0.5;
  }

  function getWaterConfidence(r, g, b) {
    const blueLead = b - Math.max(r, g);
    const blueGreenLead = b - g;
    const greenRedLead = g - r;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const blueScore = clamp((b - 0.28) * 1.8, 0, 1);
    const leadScore = clamp((blueLead + 0.06) * 4.2, 0, 1);
    const tealScore = clamp((blueGreenLead + 0.04) * 4.0, 0, 1);
    const lightScore = clamp((luminance - 0.24) * 1.8, 0, 1);
    const greenBiasPenalty = clamp((0.03 - greenRedLead) * 8, 0, 0.28);

    return clamp(
      blueScore * 0.34 +
      leadScore * 0.30 +
      tealScore * 0.20 +
      lightScore * 0.16 -
      greenBiasPenalty,
      0,
      1
    );
  }

  function blurMask(buffer, width, height, passes) {
    const temp = new Float32Array(buffer.length);
    const current = new Float32Array(buffer);

    for (let pass = 0; pass < passes; pass++) {
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          temp[y * width + x] = (
            current[(y - 1) * width + (x - 1)] +
            current[(y - 1) * width + x] +
            current[(y - 1) * width + (x + 1)] +
            current[y * width + (x - 1)] +
            current[y * width + x] +
            current[y * width + (x + 1)] +
            current[(y + 1) * width + (x - 1)] +
            current[(y + 1) * width + x] +
            current[(y + 1) * width + (x + 1)]
          ) / 9;
        }
      }

      for (let x = 0; x < width; x++) {
        temp[x] = current[x];
        temp[(height - 1) * width + x] = current[(height - 1) * width + x];
      }

      for (let y = 0; y < height; y++) {
        temp[y * width] = current[y * width];
        temp[y * width + width - 1] = current[y * width + width - 1];
      }

      current.set(temp);
    }

    return current;
  }

  function ensureCanvases(img) {
    const baseStyle = [
      'position:absolute',
      'top:0',
      'left:0',
      'width:100%',
      'height:auto',
      'pointer-events:none',
      'z-index:1',
      'image-rendering:auto'
    ].join(';');

    if (!baseCanvas) {
      baseCanvas = document.createElement('canvas');
      baseCanvas.id = 'water-repaint-canvas';
      baseCanvas.style.cssText = baseStyle;
      img.insertAdjacentElement('afterend', baseCanvas);
    }

    if (!motionCanvas) {
      motionCanvas = document.createElement('canvas');
      motionCanvas.id = 'water-motion-canvas';
      motionCanvas.style.cssText = baseStyle;
      baseCanvas.insertAdjacentElement('afterend', motionCanvas);
    }

    if (!foamCanvas) {
      foamCanvas = document.createElement('canvas');
      foamCanvas.id = 'water-foam-canvas';
      foamCanvas.style.cssText = baseStyle;
      motionCanvas.insertAdjacentElement('afterend', foamCanvas);
    }
  }

  function createMotionTexture(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const gradientA = ctx.createLinearGradient(0, height * 0.15, width, height * 0.65);
    gradientA.addColorStop(0.00, 'rgba(255,255,255,0.00)');
    gradientA.addColorStop(0.14, 'rgba(214,241,255,0.07)');
    gradientA.addColorStop(0.30, 'rgba(130,206,245,0.16)');
    gradientA.addColorStop(0.46, 'rgba(255,255,255,0.06)');
    gradientA.addColorStop(0.64, 'rgba(42,118,190,0.07)');
    gradientA.addColorStop(1.00, 'rgba(255,255,255,0.00)');
    ctx.fillStyle = gradientA;
    ctx.fillRect(0, 0, width, height);

    const gradientB = ctx.createLinearGradient(width * 0.1, 0, width * 0.85, height);
    gradientB.addColorStop(0.00, 'rgba(255,255,255,0.00)');
    gradientB.addColorStop(0.22, 'rgba(177,228,255,0.08)');
    gradientB.addColorStop(0.42, 'rgba(255,255,255,0.05)');
    gradientB.addColorStop(0.68, 'rgba(32,96,162,0.08)');
    gradientB.addColorStop(1.00, 'rgba(255,255,255,0.00)');
    ctx.fillStyle = gradientB;
    ctx.fillRect(0, 0, width, height);

    const gradientC = ctx.createLinearGradient(width * 0.2, height * 0.1, width * 0.9, height * 0.85);
    gradientC.addColorStop(0.00, 'rgba(255,255,255,0.00)');
    gradientC.addColorStop(0.26, 'rgba(150,218,248,0.07)');
    gradientC.addColorStop(0.48, 'rgba(255,255,255,0.04)');
    gradientC.addColorStop(0.72, 'rgba(18,78,142,0.06)');
    gradientC.addColorStop(1.00, 'rgba(255,255,255,0.00)');
    ctx.fillStyle = gradientC;
    ctx.fillRect(0, 0, width, height);

    return canvas;
  }

  function createFoamTexture(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const spots = [
      [0.18, 0.42, 0.26, 0.12, 0.34],
      [0.58, 0.55, 0.22, 0.10, 0.28],
      [0.82, 0.28, 0.20, 0.09, 0.24],
      [0.36, 0.72, 0.18, 0.08, 0.22],
      [0.68, 0.78, 0.16, 0.07, 0.18]
    ];

    spots.forEach(([cx, cy, rx, ry, alpha]) => {
      const grad = ctx.createRadialGradient(
        width * cx, height * cy, 0,
        width * cx, height * cy, Math.max(width * rx, height * ry)
      );
      grad.addColorStop(0, `rgba(255,255,255,${alpha * 0.8})`);
      grad.addColorStop(0.55, `rgba(245,250,255,${alpha * 0.32})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    });

    return canvas;
  }

  function drawDriftTexture(ctx, texture, width, height, offsetX, offsetY, alpha, scale) {
    const drawWidth = texture.width * scale;
    const drawHeight = texture.height * scale;
    const x = (width - drawWidth) / 2 + offsetX;
    const y = (height - drawHeight) / 2 + offsetY;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(texture, x, y, drawWidth, drawHeight);
    ctx.restore();
  }

  function renderMotionFrame(timestamp) {
    if (!animationState) return;

    const {
      width,
      height,
      motionTexture,
      foamTexture,
      waterMaskCanvas,
      shoreMaskCanvas,
      motionCtx,
      foamCtx
    } = animationState;

    const time = timestamp * 0.001;

    const motionX = Math.sin(time * 0.18) * width * 0.035;
    const motionY = Math.cos(time * 0.14) * height * 0.022;
    const motionX2 = Math.cos(time * 0.11 + 1.3) * width * 0.026;
    const motionY2 = Math.sin(time * 0.16 + 0.7) * height * 0.018;

    motionCtx.clearRect(0, 0, width, height);
    drawDriftTexture(motionCtx, motionTexture, width, height, motionX, motionY, 0.88, 0.64);
    drawDriftTexture(motionCtx, motionTexture, width, height, motionX2, motionY2, 0.42, 0.68);
    motionCtx.globalCompositeOperation = 'destination-in';
    motionCtx.drawImage(waterMaskCanvas, 0, 0);
    motionCtx.globalCompositeOperation = 'source-over';

    const foamX = Math.sin(time * 0.32) * width * 0.018;
    const foamY = Math.cos(time * 0.28) * height * 0.015;
    const foamX2 = Math.cos(time * 0.21 + 0.9) * width * 0.014;
    const foamY2 = Math.sin(time * 0.24 + 1.7) * height * 0.012;

    foamCtx.clearRect(0, 0, width, height);
    drawDriftTexture(foamCtx, foamTexture, width, height, foamX, foamY, 0.92, 0.92);
    drawDriftTexture(foamCtx, foamTexture, width, height, foamX2, foamY2, 0.46, 0.98);
    foamCtx.globalCompositeOperation = 'destination-in';
    foamCtx.drawImage(shoreMaskCanvas, 0, 0);
    foamCtx.globalCompositeOperation = 'source-over';

    animationFrameId = requestAnimationFrame(renderMotionFrame);
  }

  function compute(img) {
    if (!img.naturalWidth || !img.naturalHeight) return;

    ensureCanvases(img);

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    const renderWidth = Math.min(MAX_RENDER_WIDTH, img.naturalWidth);
    const renderHeight = Math.max(1, Math.round(img.naturalHeight * (renderWidth / img.naturalWidth)));
    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = renderWidth;
    sourceCanvas.height = renderHeight;

    const sourceCtx = sourceCanvas.getContext('2d', { willReadFrequently: true });
    sourceCtx.drawImage(img, 0, 0, renderWidth, renderHeight);
    const sourceImage = sourceCtx.getImageData(0, 0, renderWidth, renderHeight);
    const src = sourceImage.data;

    const waterMask = new Float32Array(renderWidth * renderHeight);
    for (let i = 0; i < waterMask.length; i++) {
      const r = src[i * 4] / 255;
      const g = src[i * 4 + 1] / 255;
      const b = src[i * 4 + 2] / 255;
      const confidence = getWaterConfidence(r, g, b);
      waterMask[i] = confidence > 0.16 ? confidence : 0;
    }

    const depthField = blurMask(waterMask, renderWidth, renderHeight, BLUR_PASSES);
    const output = sourceCtx.createImageData(renderWidth, renderHeight);
    const waterMaskCanvas = document.createElement('canvas');
    const shoreMaskCanvas = document.createElement('canvas');
    waterMaskCanvas.width = shoreMaskCanvas.width = renderWidth;
    waterMaskCanvas.height = shoreMaskCanvas.height = renderHeight;
    const waterMaskCtx = waterMaskCanvas.getContext('2d');
    const shoreMaskCtx = shoreMaskCanvas.getContext('2d');
    const waterMaskImage = waterMaskCtx.createImageData(renderWidth, renderHeight);
    const shoreMaskImage = shoreMaskCtx.createImageData(renderWidth, renderHeight);
    const dst = output.data;
    const waterMaskDst = waterMaskImage.data;
    const shoreMaskDst = shoreMaskImage.data;

    for (let y = 0; y < renderHeight; y++) {
      for (let x = 0; x < renderWidth; x++) {
        const idx1d = y * renderWidth + x;
        const idx = idx1d * 4;
        const waterPresence = clamp(depthField[idx1d], 0, 1);

        if (waterPresence < 0.14) {
          dst[idx + 3] = 0;
          waterMaskDst[idx + 3] = 0;
          shoreMaskDst[idx + 3] = 0;
          continue;
        }

        const depth = smoothstep(0.14, 0.98, waterPresence);
        const shelf = smoothstep(0.06, 0.48, depth);
        const abyss = smoothstep(0.42, 0.88, depth);
        const coastalBand = 1 - smoothstep(0.08, 0.38, depth);
        const openSeaBand = smoothstep(0.30, 0.82, depth);
        const baseNoise = sampleNoise(x, y);
        const current = sampleCurrent(x, y);
        const shimmer = Math.pow(clamp(baseNoise, 0, 1), 1.8) * (0.22 + openSeaBand * 0.58);
        const currentBands = Math.pow(clamp(current, 0, 1), 1.7) * openSeaBand;
        const deepShade = Math.pow(clamp(1 - current, 0, 1), 1.55) * abyss;

        let color = mixColor(SHALLOW_COLOR, MID_COLOR, shelf);
        color = mixColor(color, DEEP_COLOR, abyss * 0.92);
        color = mixColor(color, [236, 247, 255], shimmer * 0.30);
        color = mixColor(color, [116, 203, 246], currentBands * 0.12);
        color = mixColor(color, [12, 44, 92], deepShade * 0.18);
        color = mixColor(color, FOAM_COLOR, coastalBand * 0.22);

        const alpha = clamp(
          0.08 +
          shelf * 0.13 +
          abyss * 0.20 +
          shimmer * 0.07 +
          currentBands * 0.05 +
          deepShade * 0.03,
          0.08,
          0.36
        ) * smoothstep(0.14, 0.34, waterPresence);

        dst[idx] = color[0];
        dst[idx + 1] = color[1];
        dst[idx + 2] = color[2];
        dst[idx + 3] = Math.round(alpha * 255);

        const waterMaskAlpha = Math.round(255 * smoothstep(0.14, 0.42, waterPresence));
        waterMaskDst[idx] = 255;
        waterMaskDst[idx + 1] = 255;
        waterMaskDst[idx + 2] = 255;
        waterMaskDst[idx + 3] = waterMaskAlpha;

        const shoreAlpha = Math.round(255 * coastalBand * smoothstep(0.08, 0.34, waterPresence));
        shoreMaskDst[idx] = 255;
        shoreMaskDst[idx + 1] = 255;
        shoreMaskDst[idx + 2] = 255;
        shoreMaskDst[idx + 3] = shoreAlpha;
      }
    }

    baseCanvas.width = motionCanvas.width = foamCanvas.width = renderWidth;
    baseCanvas.height = motionCanvas.height = foamCanvas.height = renderHeight;

    const baseCtx = baseCanvas.getContext('2d');
    baseCtx.clearRect(0, 0, renderWidth, renderHeight);
    baseCtx.putImageData(output, 0, 0);

    waterMaskCtx.putImageData(waterMaskImage, 0, 0);
    shoreMaskCtx.putImageData(shoreMaskImage, 0, 0);

    animationState = {
      width: renderWidth,
      height: renderHeight,
      motionTexture: createMotionTexture(Math.ceil(renderWidth * 1.8), Math.ceil(renderHeight * 1.8)),
      foamTexture: createFoamTexture(Math.ceil(renderWidth * 1.35), Math.ceil(renderHeight * 1.35)),
      waterMaskCanvas,
      shoreMaskCanvas,
      motionCtx: motionCanvas.getContext('2d'),
      foamCtx: foamCanvas.getContext('2d')
    };

    animationFrameId = requestAnimationFrame(renderMotionFrame);
  }

  function init(imgId) {
    const img = document.getElementById(imgId);
    if (!img) return;

    ensureCanvases(img);

    if (img.complete && img.naturalWidth > 0) {
      setTimeout(() => compute(img), 100);
    } else {
      img.addEventListener('load', () => setTimeout(() => compute(img), 100), { once: true });
    }

    window.addEventListener('resize', () => {
      if (!img.naturalWidth) return;
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => compute(img), 180);
    });
  }

  return { init };
})();
