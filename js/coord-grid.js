/**
 * Hex grid overlay and lookup helpers for World of Myrdae.
 */
const CoordGrid = (function () {
  let active = false;
  const instances = new Map();

  const HEX_SIZE_RATIO = 0.028;
  const HEX_STROKE = 'rgba(236, 225, 190, 0.58)';
  const HEX_FILL = 'rgba(212, 175, 55, 0.05)';
  const HEX_LABEL_FILL = 'rgba(246, 236, 206, 0.88)';
  const HEX_LABEL_SHADOW = 'rgba(8, 16, 24, 0.62)';

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

  function getHexPoints(cx, cy, size) {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i);
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  }

  function buildGridMetrics(natW, natH) {
    const size = natW * HEX_SIZE_RATIO;
    const hexHeight = Math.sqrt(3) * size;
    const horizontalStep = 1.5 * size;
    const verticalStep = hexHeight;
    const cells = [];

    for (let col = 0; ; col++) {
      const cx = size + col * horizontalStep;
      if (cx - size > natW + size) break;

      const yOffset = col % 2 === 0 ? 0 : hexHeight / 2;
      for (let row = 0; ; row++) {
        const cy = hexHeight / 2 + yOffset + row * verticalStep;
        if (cy - hexHeight / 2 > natH + hexHeight / 2) break;

        cells.push({
          col,
          row,
          code: `${toColumnLabel(col)}${row + 1}`,
          cx,
          cy,
          xPercent: (cx / natW) * 100,
          yPercent: (cy / natH) * 100
        });
      }
    }

    return {
      natW,
      natH,
      size,
      hexHeight,
      cells
    };
  }

  function findNearestCell(metrics, xPx, yPx) {
    if (!metrics || !metrics.cells.length) return null;

    let nearest = null;
    let nearestDistanceSq = Infinity;

    metrics.cells.forEach((cell) => {
      const dx = cell.cx - xPx;
      const dy = cell.cy - yPx;
      const distanceSq = dx * dx + dy * dy;
      if (distanceSq < nearestDistanceSq) {
        nearestDistanceSq = distanceSq;
        nearest = cell;
      }
    });

    return nearest;
  }

  function ensureMetrics(containerId, mapImg) {
    const natW = mapImg.naturalWidth;
    const natH = mapImg.naturalHeight;
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
      viewBox: `0 0 ${metrics.natW} ${metrics.natH}`,
      preserveAspectRatio: 'xMinYMin meet'
    });

    svg.style.width = '100%';
    svg.style.height = 'auto';
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.pointerEvents = 'none';
    svg.style.display = active ? '' : 'none';
    svg.style.zIndex = '6';

    const cellGroup = makeSvgElement('g', {
      opacity: '0.92',
      'shape-rendering': 'geometricPrecision'
    });
    const labelGroup = makeSvgElement('g', {
      opacity: '0.9'
    });

    metrics.cells.forEach((cell) => {
      const polygon = makeSvgElement('polygon', {
        points: getHexPoints(cell.cx, cell.cy, metrics.size),
        fill: HEX_FILL,
        stroke: HEX_STROKE,
        'stroke-width': Math.max(1, metrics.natW * 0.00022)
      });
      cellGroup.appendChild(polygon);

      const label = makeSvgElement('text', {
        x: cell.cx,
        y: cell.cy + metrics.size * 0.12,
        fill: HEX_LABEL_FILL,
        stroke: HEX_LABEL_SHADOW,
        'stroke-width': '0.65',
        'paint-order': 'stroke',
        'font-size': Math.max(10, metrics.natW * 0.0046),
        'font-family': 'Cinzel, serif',
        'letter-spacing': '0.06em',
        'text-anchor': 'middle'
      });
      label.textContent = cell.code;
      labelGroup.appendChild(label);
    });

    const frame = makeSvgElement('rect', {
      x: '1',
      y: '1',
      width: metrics.natW - 2,
      height: metrics.natH - 2,
      fill: 'none',
      stroke: 'rgba(231, 222, 192, 0.55)',
      'stroke-width': '1.3'
    });

    svg.appendChild(cellGroup);
    svg.appendChild(frame);
    svg.appendChild(labelGroup);
    mapImg.parentNode.insertBefore(svg, mapImg.nextSibling);
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
