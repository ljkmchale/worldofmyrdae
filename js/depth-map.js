/**
 * Depth Map Renderer — World of Myrdae
 *
 * Builds a grayscale height map from the painted world map at runtime.
 * The original image stays in the DOM for sizing and loading, while the
 * generated canvas becomes the visible base layer.
 */
const DepthMapRenderer = (function () {
  let _canvas = null;

  const BLUR_PASSES = 4;
  const CONTOUR_INTERVAL = 0.055;
  const SEA_LEVEL = 0.16;
  const CONTOUR_COLOR = [86, 78, 61];
  const SHADOW_COLOR = [56, 68, 48];
  const HIGHLIGHT_COLOR = [228, 224, 208];
  const WATER_FILL = [114, 150, 182];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function mixColor(a, b, t) {
    return [
      Math.round(lerp(a[0], b[0], t)),
      Math.round(lerp(a[1], b[1], t)),
      Math.round(lerp(a[2], b[2], t))
    ];
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function blur(buffer, width, height) {
    const temp = new Float32Array(buffer.length);

    for (let pass = 0; pass < BLUR_PASSES; pass++) {
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          temp[y * width + x] = (
            buffer[(y - 1) * width + (x - 1)] + buffer[(y - 1) * width + x] + buffer[(y - 1) * width + (x + 1)] +
            buffer[y * width + (x - 1)] + buffer[y * width + x] + buffer[y * width + (x + 1)] +
            buffer[(y + 1) * width + (x - 1)] + buffer[(y + 1) * width + x] + buffer[(y + 1) * width + (x + 1)]
          ) / 9;
        }
      }

      for (let x = 0; x < width; x++) {
        temp[x] = buffer[x];
        temp[(height - 1) * width + x] = buffer[(height - 1) * width + x];
      }

      for (let y = 0; y < height; y++) {
        temp[y * width] = buffer[y * width];
        temp[y * width + width - 1] = buffer[y * width + width - 1];
      }

      buffer.set(temp);
    }
  }

  function buildDepthValue(r, g, b) {
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const maxChannel = Math.max(r, g, b);
    const minChannel = Math.min(r, g, b);
    const chroma = maxChannel - minChannel;
    const blueDominance = b - Math.max(r, g);

    if (blueDominance > 0.05 && b > 0.28) {
      return clamp(0.02 + luminance * 0.12 - blueDominance * 0.12, 0.01, 0.13);
    }

    const aridBias = clamp((r - g) * 1.6 + (r - b) * 0.4, 0, 1);
    const mountainBias = clamp((luminance - 0.42) * 1.7 + (0.20 - chroma) * 1.8, 0, 1);
    const ridgeBias = clamp((maxChannel - b) * 0.5 + (0.55 - chroma), 0, 1);
    const snowBias = clamp((luminance - 0.62) * 2.4 + (0.18 - chroma) * 2.2, 0, 1);
    let depth = clamp(
      0.26 +
      luminance * 0.32 +
      aridBias * 0.10 +
      mountainBias * 0.34 +
      ridgeBias * 0.12 +
      snowBias * 0.10,
      0.18,
      1
    );

    const mountainLift = Math.pow(mountainBias, 1.25) * 0.12 + Math.pow(snowBias, 1.1) * 0.08;
    depth = clamp(depth + mountainLift, 0.18, 1);
    return Math.pow(depth, 0.94);
  }

  function isWaterPixel(r, g, b) {
    const blueLead = b - Math.max(r, g);
    const blueGreenLead = b - g;
    const greenRedLead = g - r;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    if (b > 0.48 && blueLead > -0.02 && greenRedLead > 0.01) return true;
    if (b > 0.38 && blueLead > 0.015 && blueGreenLead > -0.015) return true;
    if (luminance > 0.52 && b > g && g > r) return true;
    return false;
  }

  function blurBinaryMask(mask, width, height, passes) {
    const temp = new Float32Array(mask.length);
    const current = new Float32Array(mask.length);

    for (let i = 0; i < mask.length; i++) current[i] = mask[i];

    for (let pass = 0; pass < passes; pass++) {
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          temp[y * width + x] = (
            current[(y - 1) * width + (x - 1)] + current[(y - 1) * width + x] + current[(y - 1) * width + (x + 1)] +
            current[y * width + (x - 1)] + current[y * width + x] + current[y * width + (x + 1)] +
            current[(y + 1) * width + (x - 1)] + current[(y + 1) * width + x] + current[(y + 1) * width + (x + 1)]
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

    for (let i = 0; i < mask.length; i++) {
      mask[i] = current[i] > 0.5 ? 1 : 0;
    }
  }

  function sampleContourStrength(heightValue, slopeValue) {
    if (heightValue <= SEA_LEVEL) return 0;

    const nearest = Math.abs((heightValue / CONTOUR_INTERVAL) - Math.round(heightValue / CONTOUR_INTERVAL));
    const contourBand = 1 - smoothstep(0.09, 0.28, nearest);
    const slopeMask = smoothstep(0.015, 0.06, slopeValue);
    const mountainMask = smoothstep(0.48, 0.90, heightValue);
    return contourBand * (0.18 + slopeMask * 0.28 + mountainMask * 0.16);
  }

  function sampleCoastProximity(isWater, neighbors) {
    if (isWater) return 0;
    return neighbors.some(Boolean) ? 1 : 0;
  }

  function sampleInlandCoastColor(sourceData, waterMask, width, height, x, y) {
    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    let samples = 0;

    for (let oy = -2; oy <= 2; oy++) {
      for (let ox = -2; ox <= 2; ox++) {
        if (ox === 0 && oy === 0) continue;
        const sx = x + ox;
        const sy = y + oy;
        if (sx < 0 || sy < 0 || sx >= width || sy >= height) continue;
        const sIdx1d = sy * width + sx;
        if (waterMask[sIdx1d] === 1) continue;

        const sIdx = sIdx1d * 4;
        const sr = sourceData[sIdx];
        const sg = sourceData[sIdx + 1];
        const sb = sourceData[sIdx + 2];
        const lum = 0.299 * sr + 0.587 * sg + 0.114 * sb;
        if (lum < 50) continue;

        totalR += sr;
        totalG += sg;
        totalB += sb;
        samples++;
      }
    }

    if (!samples) return null;
    return [
      Math.round(totalR / samples),
      Math.round(totalG / samples),
      Math.round(totalB / samples)
    ];
  }

  function init(imgId, layerGroupId) {
    const img = document.getElementById(imgId);
    const group = document.getElementById(layerGroupId);
    if (!img || !group) return;

    _canvas = document.createElement('canvas');
    _canvas.id = 'depth-map-canvas';
    _canvas.style.cssText = [
      'position:absolute',
      'top:0',
      'left:0',
      'width:100%',
      'height:auto',
      'pointer-events:none',
      'z-index:1'
    ].join(';');
    img.insertAdjacentElement('afterend', _canvas);

    function compute() {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      if (!width || !height) return;

      const sourceCanvas = document.createElement('canvas');
      sourceCanvas.width = width;
      sourceCanvas.height = height;
      const sourceCtx = sourceCanvas.getContext('2d', { willReadFrequently: true });
      sourceCtx.drawImage(img, 0, 0, width, height);
      const sourceData = sourceCtx.getImageData(0, 0, width, height).data;
      const elevations = new Float32Array(width * height);
      const waterMaskBin = new Uint8Array(width * height);
      for (let i = 0; i < elevations.length; i++) {
        const r = sourceData[i * 4] / 255;
        const g = sourceData[i * 4 + 1] / 255;
        const b = sourceData[i * 4 + 2] / 255;
        elevations[i]    = buildDepthValue(r, g, b);
        waterMaskBin[i]  = isWaterPixel(r, g, b) ? 1 : 0;
      }
      blur(elevations, width, height);
      blurBinaryMask(waterMaskBin, width, height, 2);

      _canvas.width = width;
      _canvas.height = height;
      const outputCtx = _canvas.getContext('2d');
      const imageData = outputCtx.createImageData(width, height);
      const lightX = -0.62;
      const lightY = -0.58;
      const lightZ = 0.68;
      const lightLength = Math.sqrt(lightX * lightX + lightY * lightY + lightZ * lightZ);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx1d = y * width + x;
          const idx = idx1d * 4;
          const sr = sourceData[idx];
          const sg = sourceData[idx + 1];
          const sb = sourceData[idx + 2];
          const isWater = waterMaskBin[idx1d] === 1;
          const xm1 = Math.max(0, x - 1);
          const xp1 = Math.min(width - 1, x + 1);
          const ym1 = Math.max(0, y - 1);
          const yp1 = Math.min(height - 1, y + 1);
          const neighboringWater = [
            waterMaskBin[ym1 * width + x] === 1,
            waterMaskBin[yp1 * width + x] === 1,
            waterMaskBin[y * width + xm1] === 1,
            waterMaskBin[y * width + xp1] === 1
          ];

          if (isWater) {
            imageData.data[idx] = Math.round(sr + (WATER_FILL[0] - sr) * 0.22);
            imageData.data[idx + 1] = Math.round(sg + (WATER_FILL[1] - sg) * 0.22);
            imageData.data[idx + 2] = Math.round(sb + (WATER_FILL[2] - sb) * 0.22);
            imageData.data[idx + 3] = 255;
            continue;
          }

          const coastProximity = sampleCoastProximity(isWater, neighboringWater);
          const sourceLum = 0.299 * sr + 0.587 * sg + 0.114 * sb;
          if (coastProximity > 0 && sourceLum < 78) {
            const inlandColor = sampleInlandCoastColor(sourceData, waterMaskBin, width, height, x, y);
            const coastColor = inlandColor || [sr, sg, sb];
            imageData.data[idx] = coastColor[0];
            imageData.data[idx + 1] = coastColor[1];
            imageData.data[idx + 2] = coastColor[2];
            imageData.data[idx + 3] = 255;
            continue;
          }
          const center = elevations[idx1d];
          const gx = (
            elevations[ym1 * width + xp1] + 2 * elevations[y * width + xp1] + elevations[yp1 * width + xp1] -
            elevations[ym1 * width + xm1] - 2 * elevations[y * width + xm1] - elevations[yp1 * width + xm1]
          ) / 8;
          const gy = (
            elevations[yp1 * width + xm1] + 2 * elevations[yp1 * width + x] + elevations[yp1 * width + xp1] -
            elevations[ym1 * width + xm1] - 2 * elevations[ym1 * width + x] - elevations[ym1 * width + xp1]
          ) / 8;
          const slopeValue = Math.sqrt(gx * gx + gy * gy);
          const normalX = -gx * 10.5;
          const normalY = -gy * 10.5;
          const normalZ = 1;
          const normalLength = Math.sqrt(normalX * normalX + normalY * normalY + normalZ * normalZ);
          const shadeValue = clamp(
            ((normalX / normalLength) * (lightX / lightLength) +
             (normalY / normalLength) * (lightY / lightLength) +
             (normalZ / normalLength) * (lightZ / lightLength)) * 0.72 + 0.50,
            0.18,
            1
          );
          const contourStrength = sampleContourStrength(center, slopeValue);
          const shadowStrength = smoothstep(0.50, 0.20, shadeValue) * smoothstep(0.008, 0.06, slopeValue);
          const highlightStrength = smoothstep(0.62, 0.90, shadeValue) * smoothstep(0.008, 0.05, slopeValue);
          const overlayAlpha = clamp(
            contourStrength * 0.30 + shadowStrength * 0.18 + highlightStrength * 0.11,
            0,
            0.30
          );
          let overlayColor = SHADOW_COLOR;
          if (highlightStrength > shadowStrength && contourStrength < 0.12) {
            overlayColor = HIGHLIGHT_COLOR;
          }
          if (contourStrength >= Math.max(shadowStrength, highlightStrength) * 0.85) {
            overlayColor = CONTOUR_COLOR;
          }
          imageData.data[idx] = overlayColor[0];
          imageData.data[idx + 1] = overlayColor[1];
          imageData.data[idx + 2] = overlayColor[2];
          imageData.data[idx + 3] = Math.round(overlayAlpha * 255);
        }
      }

      outputCtx.putImageData(imageData, 0, 0);
    }

    if (img.complete && img.naturalWidth > 0) {
      setTimeout(compute, 100);
    } else {
      img.addEventListener('load', () => setTimeout(compute, 100), { once: true });
    }
  }

  return { init };
})();
