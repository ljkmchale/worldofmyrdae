/**
 * Relief Shading — World of Myrdae
 *
 * Generates a hillshade overlay from the map image at page load.
 * Simulates terrain elevation using pixel color analysis:
 *   blue (water) → low elevation  |  grey/white (mountains) → high elevation
 *
 * The overlay is rendered once at 1/4 resolution and upscaled via CSS,
 * then blended over the map with mix-blend-mode:soft-light.
 */
const ReliefShading = (function () {
  let _canvas   = null;
  let _active   = false;
  let _computed = false;

  const OPACITY  = 0.70;  // blend intensity when active
  const Z_SCALE  = 4.5;   // vertical exaggeration — higher = sharper relief
  const DOWNSAMPLE = 0.20; // process at 20% of full resolution for speed

  function init(imgId, layerGroupId) {
    const img   = document.getElementById(imgId);
    const group = document.getElementById(layerGroupId);
    if (!img || !group) return;

    // Relief canvas lives above the base map (z-index 1), below locations (z-index 10+)
    _canvas = document.createElement('canvas');
    _canvas.id = 'relief-canvas';
    _canvas.style.cssText = [
      'position:absolute',
      'top:0',
      'left:0',
      'width:100%',
      'height:auto',
      'pointer-events:none',
      'z-index:1',
      'opacity:0',
      'mix-blend-mode:soft-light',
      'transition:opacity 0.5s ease',
    ].join(';');
    img.insertAdjacentElement('afterend', _canvas);

    function compute() {
      const W = Math.floor(img.naturalWidth  * DOWNSAMPLE);
      const H = Math.floor(img.naturalHeight * DOWNSAMPLE);

      // ── Step 1: Downsample the source image ────────────────────
      const tmp  = document.createElement('canvas');
      tmp.width  = W; tmp.height = H;
      const tCtx = tmp.getContext('2d', { willReadFrequently: true });
      tCtx.drawImage(img, 0, 0, W, H);
      const src = tCtx.getImageData(0, 0, W, H).data;

      // ── Step 2: Build elevation map ────────────────────────────
      // Fantasy-map heuristic:
      //   High blue  → ocean/water → low elevation
      //   High R+G   → warm land   → medium-high elevation
      //   High R+G+B → snow/peaks  → maximum elevation
      const elev = new Float32Array(W * H);
      for (let i = 0; i < W * H; i++) {
        const r = src[i * 4]     / 255;
        const g = src[i * 4 + 1] / 255;
        const b = src[i * 4 + 2] / 255;
        elev[i] = Math.min(1, Math.max(0, r * 0.52 + g * 0.42 - b * 0.30 + 0.22));
      }

      // ── Step 3: Smooth with 4-pass box blur ────────────────────
      // Smoothing prevents harsh hillshade edges at color boundaries.
      const buf = new Float32Array(W * H);
      for (let pass = 0; pass < 4; pass++) {
        for (let y = 1; y < H - 1; y++) {
          for (let x = 1; x < W - 1; x++) {
            buf[y * W + x] = (
              elev[(y-1)*W + (x-1)] + elev[(y-1)*W + x] + elev[(y-1)*W + (x+1)] +
              elev[ y   *W + (x-1)] + elev[ y   *W + x] + elev[ y   *W + (x+1)] +
              elev[(y+1)*W + (x-1)] + elev[(y+1)*W + x] + elev[(y+1)*W + (x+1)]
            ) / 9;
          }
        }
        // Copy edges and interior
        for (let i = 0; i < W * H; i++) elev[i] = buf[i];
      }

      // ── Step 4: Compute hillshade via Sobel + Lambertian light ─
      _canvas.width  = W;
      _canvas.height = H;
      const ctx = _canvas.getContext('2d');
      const out = ctx.createImageData(W, H);

      // Light direction: from NW (upper-left), slightly elevated — standard cartography
      const lx = -0.55, ly = -0.55, lz = 0.62;
      const llen = Math.sqrt(lx*lx + ly*ly + lz*lz);
      const AMBIENT = 0.28; // floor brightness so shadows aren't pure black

      for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
          // Sobel gradient (horizontal and vertical)
          const gx = (
            elev[(y-1)*W+(x+1)] + 2*elev[y*W+(x+1)] + elev[(y+1)*W+(x+1)] -
            elev[(y-1)*W+(x-1)] - 2*elev[y*W+(x-1)] - elev[(y+1)*W+(x-1)]
          ) / (8 * Z_SCALE);
          const gy = (
            elev[(y+1)*W+(x-1)] + 2*elev[(y+1)*W+x] + elev[(y+1)*W+(x+1)] -
            elev[(y-1)*W+(x-1)] - 2*elev[(y-1)*W+x] - elev[(y-1)*W+(x+1)]
          ) / (8 * Z_SCALE);

          // Surface normal (up-pointing)
          const nx = -gx, ny = -gy, nz = 1.0;
          const nlen = Math.sqrt(nx*nx + ny*ny + nz*nz);

          // Lambertian diffuse + ambient
          const dot   = (nx/nlen)*(lx/llen) + (ny/nlen)*(ly/llen) + (nz/nlen)*(lz/llen);
          const shade = Math.max(0, dot) * (1 - AMBIENT) + AMBIENT;

          const val = Math.round(shade * 255);
          const idx = (y * W + x) * 4;
          out.data[idx]     = val;
          out.data[idx + 1] = val;
          out.data[idx + 2] = val;
          out.data[idx + 3] = 255;
        }
      }
      ctx.putImageData(out, 0, 0);
      _computed = true;

      if (_active) _canvas.style.opacity = OPACITY;
    }

    // Defer computation until after first paint so the page doesn't stall
    if (img.complete && img.naturalWidth > 0) {
      setTimeout(compute, 150);
    } else {
      img.addEventListener('load', () => setTimeout(compute, 150), { once: true });
    }
  }

  /** Toggle the relief overlay on/off. Returns the new active state. */
  function toggle() {
    _active = !_active;
    if (_canvas) _canvas.style.opacity = _active ? OPACITY : '0';
    return _active;
  }

  return { init, toggle };
})();
