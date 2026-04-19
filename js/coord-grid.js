/**
 * Earth-style latitude/longitude grid overlay for World of Myrdae.
 * Assumes the map image behaves like an equirectangular projection.
 */
const CoordGrid = (function () {
  let active = false;

  const MINOR_LON_STEP = 15;
  const MAJOR_LON_STEP = 30;
  const MINOR_LAT_STEP = 15;
  const MAJOR_LAT_STEP = 30;

  function lonToX(lon, natW) {
    return ((lon + 180) / 360) * natW;
  }

  function latToY(lat, natH) {
    return ((90 - lat) / 180) * natH;
  }

  function formatLongitude(lon) {
    if (lon === 0) return '0deg';
    return `${Math.abs(lon)}deg${lon < 0 ? 'W' : 'E'}`;
  }

  function formatLatitude(lat) {
    if (lat === 0) return '0deg';
    return `${Math.abs(lat)}deg${lat < 0 ? 'S' : 'N'}`;
  }

  function makeText(svg, attrs, textContent) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    Object.entries(attrs).forEach(([key, value]) => text.setAttribute(key, value));
    text.textContent = textContent;
    svg.appendChild(text);
    return text;
  }

  function init(containerId, imageId) {
    const container = document.getElementById(containerId);
    const mapImg = document.getElementById(imageId);
    if (!container || !mapImg) return;

    const draw = () => {
      const existing = document.getElementById(containerId + '-coord-grid');
      if (existing) existing.remove();

      const natW = mapImg.naturalWidth;
      const natH = mapImg.naturalHeight;
      if (!natW || !natH) return;

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('id', containerId + '-coord-grid');
      svg.setAttribute('class', 'coord-grid-overlay');
      svg.setAttribute('viewBox', `0 0 ${natW} ${natH}`);
      svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
      svg.style.width = '100%';
      svg.style.height = 'auto';
      svg.style.position = 'absolute';
      svg.style.top = '0';
      svg.style.left = '0';
      svg.style.pointerEvents = 'none';
      svg.style.display = active ? '' : 'none';
      svg.style.zIndex = '6';

      const minorGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const majorGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const axisGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const labelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

      minorGroup.setAttribute('opacity', '0.2');
      majorGroup.setAttribute('opacity', '0.45');
      axisGroup.setAttribute('opacity', '0.7');
      minorGroup.setAttribute('shape-rendering', 'crispEdges');
      majorGroup.setAttribute('shape-rendering', 'crispEdges');
      axisGroup.setAttribute('shape-rendering', 'crispEdges');

      for (let lon = -180; lon <= 180; lon += MINOR_LON_STEP) {
        const x = lonToX(lon, natW);
        const isAxis = lon === 0;
        const isMajor = lon % MAJOR_LON_STEP === 0;
        const targetGroup = isAxis ? axisGroup : (isMajor ? majorGroup : minorGroup);

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x);
        line.setAttribute('y1', 0);
        line.setAttribute('x2', x);
        line.setAttribute('y2', natH);
        line.setAttribute('stroke', isAxis ? '#f4edd1' : (isMajor ? '#ddd4ae' : '#c8c0a0'));
        line.setAttribute('stroke-width', isAxis ? '1.4' : (isMajor ? '1' : '0.55'));
        line.setAttribute('stroke-dasharray', isAxis ? 'none' : (isMajor ? '8 7' : '3 9'));
        targetGroup.appendChild(line);

        if (!isMajor || lon === 180) continue;

        const label = formatLongitude(lon);
        const labelX = Math.max(22, Math.min(x + 4, natW - 22));
        makeText(labelGroup, {
          x: labelX,
          y: 20,
          fill: '#f3ecd0',
          stroke: 'rgba(8,16,24,0.45)',
          'stroke-width': '0.7',
          'paint-order': 'stroke',
          'font-size': Math.max(11, natW * 0.0072),
          'font-family': 'Cinzel, serif',
          'letter-spacing': '0.08em'
        }, label);
        makeText(labelGroup, {
          x: labelX,
          y: natH - 8,
          fill: '#f3ecd0',
          stroke: 'rgba(8,16,24,0.45)',
          'stroke-width': '0.7',
          'paint-order': 'stroke',
          'font-size': Math.max(11, natW * 0.0072),
          'font-family': 'Cinzel, serif',
          'letter-spacing': '0.08em'
        }, label);
      }

      for (let lat = -90; lat <= 90; lat += MINOR_LAT_STEP) {
        const y = latToY(lat, natH);
        const isAxis = lat === 0;
        const isMajor = lat % MAJOR_LAT_STEP === 0;
        const targetGroup = isAxis ? axisGroup : (isMajor ? majorGroup : minorGroup);

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', 0);
        line.setAttribute('y1', y);
        line.setAttribute('x2', natW);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', isAxis ? '#f4edd1' : (isMajor ? '#ddd4ae' : '#c8c0a0'));
        line.setAttribute('stroke-width', isAxis ? '1.4' : (isMajor ? '1' : '0.55'));
        line.setAttribute('stroke-dasharray', isAxis ? 'none' : (isMajor ? '8 7' : '3 9'));
        targetGroup.appendChild(line);

        if (!isMajor || lat === -90 || lat === 90) continue;

        const label = formatLatitude(lat);
        const labelY = Math.max(14, Math.min(y - 4, natH - 12));
        makeText(labelGroup, {
          x: 8,
          y: labelY,
          fill: '#f3ecd0',
          stroke: 'rgba(8,16,24,0.45)',
          'stroke-width': '0.7',
          'paint-order': 'stroke',
          'font-size': Math.max(11, natW * 0.0072),
          'font-family': 'Cinzel, serif',
          'letter-spacing': '0.08em'
        }, label);
        makeText(labelGroup, {
          x: natW - 42,
          y: labelY,
          fill: '#f3ecd0',
          stroke: 'rgba(8,16,24,0.45)',
          'stroke-width': '0.7',
          'paint-order': 'stroke',
          'font-size': Math.max(11, natW * 0.0072),
          'font-family': 'Cinzel, serif',
          'letter-spacing': '0.08em',
          'text-anchor': 'end'
        }, label);
      }

      const frame = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      frame.setAttribute('x', '1');
      frame.setAttribute('y', '1');
      frame.setAttribute('width', natW - 2);
      frame.setAttribute('height', natH - 2);
      frame.setAttribute('fill', 'none');
      frame.setAttribute('stroke', '#e7dec0');
      frame.setAttribute('stroke-width', '1.3');
      frame.setAttribute('opacity', '0.42');

      svg.appendChild(minorGroup);
      svg.appendChild(majorGroup);
      svg.appendChild(axisGroup);
      svg.appendChild(frame);
      svg.appendChild(labelGroup);
      mapImg.parentNode.insertBefore(svg, mapImg.nextSibling);
    };

    if (mapImg.complete && mapImg.naturalWidth) {
      draw();
    } else {
      mapImg.addEventListener('load', draw, { once: true });
    }
  }

  function toggle(containerId) {
    active = !active;
    const grid = document.getElementById(containerId + '-coord-grid');
    if (grid) grid.style.display = active ? '' : 'none';
    return active;
  }

  return { init, toggle };
})();
