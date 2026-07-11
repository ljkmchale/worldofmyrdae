/**
 * Hex grid overlay and lookup helpers for World of Myrdae.
 *
 * The visible grid is a single SVG <pattern>-filled rect (constant DOM cost
 * regardless of map size), and cell lookups are computed mathematically
 * instead of scanning a cell list.
 */
const CoordGrid = (function () {
  let active = false;
  const instances = new Map();

  // Calibrated against images/Myrdae (v.4.2.c - Hex).jpg (12800x7200).
  const HEX_REFERENCE = Object.freeze({
    width: 12800,
    height: 7200,
    size: 21.25,
    originX: 10.625,
    originY: 18.4
  });
  const HEX_STROKE = 'rgba(236, 225, 190, 0.58)';
  const HEX_FILL = 'rgba(212, 175, 55, 0.05)';

  function toColumnLabel(index) {
    let value = index + 1;
    let result = '';
    while (value > 0) {
      const remainder = (value - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      value = Math.floor((value - 1) / 26);
    }
    return result;
  }

  function makeSvgElement(tagName, attrs) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
    Object.entries(attrs || {}).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  }

  function applyCurrentMapTransform(container, mapImg, element) {
    const transformedParent = mapImg.parentNode && mapImg.parentNode.id === 'map-layer-group';
    if (transformedParent) return;

    const controller = (typeof MapController !== 'undefined') ? MapController : null;
    const mapState = controller && typeof controller.getInstanceState === 'function'
      ? controller.getInstanceState(container.id)
      : null;

    if (mapState) {
      element.style.transform = `translate3d(${mapState.pointX}px, ${mapState.pointY}px, 0) scale(${mapState.scale})`;
      element.style.transformOrigin = '0 0';
    } else if (mapImg.style.transform) {
      element.style.transform = mapImg.style.transform;
      element.style.transformOrigin = mapImg.style.transformOrigin || '0 0';
    }
  }

  function hexPathAt(cx, cy, size) {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i);
      points.push(`${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`);
    }
    return `M ${points.join(' L ')} Z`;
  }

  function buildGridMetrics(natW, natH) {
    const scaleX = natW / HEX_REFERENCE.width;
    const scaleY = natH / HEX_REFERENCE.height;
    const size = HEX_REFERENCE.size * scaleX;
    const hexHeight = Math.sqrt(3) * size;
    const horizontalStep = 1.5 * size;
    const verticalStep = hexHeight;
    const originX = HEX_REFERENCE.originX * scaleX;
    const originY = HEX_REFERENCE.originY * scaleY;

    // Same bounds the cell loops used to enforce.
    const maxCol = Math.max(0, Math.ceil((natW + 2 * size - originX) / horizontalStep));
    const maxRow = Math.max(0, Math.ceil((natH + hexHeight - originY) / verticalStep));

    return {
      natW,
      natH,
      size,
      hexHeight,
      horizontalStep,
      verticalStep,
      originX,
      originY,
      maxCol,
      maxRow
    };
  }

  function cellAt(metrics, col, row) {
    const cx = metrics.originX + col * metrics.horizontalStep;
    const yOffset = col % 2 === 0 ? 0 : metrics.hexHeight / 2;
    const cy = metrics.originY + yOffset + row * metrics.verticalStep;
    return {
      col,
      row,
      code: `${toColumnLabel(col)}${row + 1}`,
      cx,
      cy,
      xPercent: (cx / metrics.natW) * 100,
      yPercent: (cy / metrics.natH) * 100
    };
  }

  function findNearestCell(metrics, xPx, yPx) {
    if (!metrics) return null;

    const approxCol = Math.round((xPx - metrics.originX) / metrics.horizontalStep);
    let nearest = null;
    let nearestDistanceSq = Infinity;

    for (let col = approxCol - 1; col <= approxCol + 1; col++) {
      if (col < 0 || col > metrics.maxCol) continue;
      const yOffset = col % 2 === 0 ? 0 : metrics.hexHeight / 2;
      const approxRow = Math.round((yPx - metrics.originY - yOffset) / metrics.verticalStep);
      for (let row = approxRow - 1; row <= approxRow + 1; row++) {
        if (row < 0 || row > metrics.maxRow) continue;
        const cell = cellAt(metrics, col, row);
        const dx = cell.cx - xPx;
        const dy = cell.cy - yPx;
        const distanceSq = dx * dx + dy * dy;
        if (distanceSq < nearestDistanceSq) {
          nearestDistanceSq = distanceSq;
          nearest = cell;
        }
      }
    }

    return nearest;
  }

  function ensureMetrics(containerId, mapImg) {
    const stack = (typeof MapLayerStack !== 'undefined') ? MapLayerStack : null;
    const coordinateSpace = stack && typeof stack.getCoordinateSpace === 'function'
      ? stack.getCoordinateSpace()
      : null;
    const natW = coordinateSpace?.width || mapImg.naturalWidth;
    const natH = coordinateSpace?.height || mapImg.naturalHeight;
    if (!natW || !natH) return null;

    const cached = instances.get(containerId);
    if (cached && cached.metrics && cached.metrics.natW === natW && cached.metrics.natH === natH) {
      return cached.metrics;
    }

    const metrics = buildGridMetrics(natW, natH);
    const instance = cached || {};
    instance.metrics = metrics;
    instances.set(containerId, instance);
    return metrics;
  }

  function getMapRegistrationOffset() {
    const stack = (typeof MapLayerStack !== 'undefined') ? MapLayerStack : null;
    return stack && typeof stack.getRegistrationOffset === 'function'
      ? stack.getRegistrationOffset()
      : { x: 0, y: 0 };
  }

  function drawGrid(containerId, imageId) {
    const container = document.getElementById(containerId);
    const mapImg = document.getElementById(imageId);
    if (!container || !mapImg) return;

    const existing = document.getElementById(containerId + '-coord-grid');
    if (existing) existing.remove();

    const metrics = ensureMetrics(containerId, mapImg);
    if (!metrics) return;

    const svg = makeSvgElement('svg', {
      id: containerId + '-coord-grid',
      class: 'coord-grid-overlay',
      viewBox: `${-getMapRegistrationOffset().x} ${-getMapRegistrationOffset().y} ${metrics.natW} ${metrics.natH}`,
      preserveAspectRatio: 'xMinYMin meet'
    });

    svg.style.width = '100%';
    svg.style.height = 'auto';
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.pointerEvents = 'none';
    svg.style.display = active ? '' : 'none';
    svg.style.zIndex = '9';

    // One pattern tile covers two columns (even + odd). Hexes are drawn at the
    // tile corners and center so the clipped parts are completed by adjacent
    // tiles, producing a seamless grid from a single rect fill.
    const s = metrics.size;
    const h = metrics.hexHeight;
    const tileW = 3 * s;
    const tileH = h;
    const patternId = `${containerId}-coord-grid-hex`;

    const defs = makeSvgElement('defs', {});
    const pattern = makeSvgElement('pattern', {
      id: patternId,
      x: metrics.originX,
      y: metrics.originY,
      width: tileW,
      height: tileH,
      patternUnits: 'userSpaceOnUse'
    });
    const hexes = [
      [0, 0], [tileW, 0], [0, tileH], [tileW, tileH],
      [1.5 * s, tileH / 2]
    ];
    const path = makeSvgElement('path', {
      d: hexes.map(([cx, cy]) => hexPathAt(cx, cy, s)).join(' '),
      fill: HEX_FILL,
      stroke: HEX_STROKE,
      'stroke-width': Math.max(1, metrics.natW * 0.00022)
    });
    pattern.appendChild(path);
    defs.appendChild(pattern);

    const cellGroup = makeSvgElement('g', {
      opacity: '0.92',
      'shape-rendering': 'geometricPrecision'
    });
    const fillRect = makeSvgElement('rect', {
      x: -2 * s,
      y: -2 * s,
      width: metrics.natW + 4 * s,
      height: metrics.natH + 4 * s,
      fill: `url(#${patternId})`
    });
    cellGroup.appendChild(fillRect);

    const frame = makeSvgElement('rect', {
      x: '1',
      y: '1',
      width: metrics.natW - 2,
      height: metrics.natH - 2,
      fill: 'none',
      stroke: 'rgba(231, 222, 192, 0.55)',
      'stroke-width': '1.3'
    });

    svg.appendChild(defs);
    svg.appendChild(cellGroup);
    svg.appendChild(frame);
    mapImg.parentNode.insertBefore(svg, mapImg.nextSibling);
    applyCurrentMapTransform(container, mapImg, svg);
  }

  function init(containerId, imageId) {
    const container = document.getElementById(containerId);
    const mapImg = document.getElementById(imageId);
    if (!container || !mapImg) return;

    const instance = instances.get(containerId) || {};
    instance.imageId = imageId;
    instances.set(containerId, instance);

    const render = () => drawGrid(containerId, imageId);
    if (mapImg.complete && mapImg.naturalWidth) {
      render();
    } else {
      mapImg.addEventListener('load', render, { once: true });
    }
  }

  function toggle(containerId) {
    active = !active;
    const grid = document.getElementById(containerId + '-coord-grid');
    if (grid) grid.style.display = active ? '' : 'none';
    return active;
  }

  function describePoint(xPercent, yPercent, containerId) {
    const instance = instances.get(containerId);
    if (!instance || !instance.metrics) return null;

    const xPx = (xPercent / 100) * instance.metrics.natW;
    const yPx = (yPercent / 100) * instance.metrics.natH;
    const cell = findNearestCell(instance.metrics, xPx, yPx);
    if (!cell) return null;

    return {
      code: cell.code,
      col: cell.col,
      row: cell.row,
      centerXPercent: cell.xPercent,
      centerYPercent: cell.yPercent
    };
  }

  return {
    init,
    toggle,
    describePoint
  };
})();
