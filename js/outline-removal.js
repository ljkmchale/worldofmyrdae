/**
 * Outline Removal — World of Myrdae
 *
 * Translates the GLSL coastline outline removal from map-3d-planet.html
 * to a 2D canvas pass for the flat map.
 *
 * Dark pixels (luminance < 0.12) are detected and blended toward the
 * average of their 4 cardinal neighbours — same logic as the fragment shader.
 * The result is drawn at 35% scale and blended with mix-blend-mode:lighten,
 * which only affects pixels darker than the processed canvas.
 */
const OutlineRemoval = (function () {

  function init(imgId, layerGroupId) {
    const img   = document.getElementById(imgId);
    const group = document.getElementById(layerGroupId);
    if (!img || !group) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'outline-removal-canvas';
    canvas.style.cssText = [
      'position:absolute',
      'top:0',
      'left:0',
      'width:100%',
      'height:auto',
      'pointer-events:none',
      'z-index:1',
      'mix-blend-mode:lighten',
    ].join(';');
    img.insertAdjacentElement('afterend', canvas);

    function compute() {
      const SCALE = 0.35;
      const W = Math.floor(img.naturalWidth  * SCALE);
      const H = Math.floor(img.naturalHeight * SCALE);

      // Downsample source image
      const tmp  = document.createElement('canvas');
      tmp.width  = W; tmp.height = H;
      const tCtx = tmp.getContext('2d', { willReadFrequently: true });
      tCtx.drawImage(img, 0, 0, W, H);
      const src = tCtx.getImageData(0, 0, W, H).data;

      canvas.width  = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      const out = ctx.createImageData(W, H);

      // Match 3D planet shader thresholds: smoothstep(0.12, 0.02, lum)
      const LUM_HIGH = 0.12 * 255; // above this → no change
      const LUM_LOW  = 0.02 * 255; // below this → full replacement
      const OFF = 3; // neighbour pixel offset (~0.0015 UV at 35% scale)

      for (let y = OFF; y < H - OFF; y++) {
        for (let x = OFF; x < W - OFF; x++) {
          const i   = (y * W + x) * 4;
          const r   = src[i], g = src[i + 1], b = src[i + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;

          if (lum < LUM_HIGH) {
            // Sample 4 cardinal neighbours (mirrors shader _off sample)
            const iU = ((y - OFF) * W +  x      ) * 4;
            const iD = ((y + OFF) * W +  x      ) * 4;
            const iL = ( y        * W + (x - OFF)) * 4;
            const iR = ( y        * W + (x + OFF)) * 4;

            const nbR = (src[iU] + src[iD] + src[iL] + src[iR]) * 0.25;
            const nbG = (src[iU+1]+src[iD+1]+src[iL+1]+src[iR+1]) * 0.25;
            const nbB = (src[iU+2]+src[iD+2]+src[iL+2]+src[iR+2]) * 0.25;

            // smoothstep blend factor — 1.0 at darkest pixels, 0.0 at LUM_HIGH
            const t     = Math.max(0, Math.min(1, (lum - LUM_LOW) / (LUM_HIGH - LUM_LOW)));
            const blend = 1 - t * t * (3 - 2 * t);

            out.data[i]     = Math.round(r + (nbR - r) * blend);
            out.data[i + 1] = Math.round(g + (nbG - g) * blend);
            out.data[i + 2] = Math.round(b + (nbB - b) * blend);
          } else {
            out.data[i]     = r;
            out.data[i + 1] = g;
            out.data[i + 2] = b;
          }
          out.data[i + 3] = 255;
        }
      }
      ctx.putImageData(out, 0, 0);
    }

    if (img.complete && img.naturalWidth > 0) {
      setTimeout(compute, 200);
    } else {
      img.addEventListener('load', () => setTimeout(compute, 200), { once: true });
    }
  }

  return { init };
})();
