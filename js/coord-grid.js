/**
 * Coordinate grid overlay for World of Myrdae.
 * Draws a 0-100 percentage grid aligned to the map image.
 */
const CoordGrid = (function () {
  let active = false;

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

      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      shadow.setAttribute('id', containerId + '-coord-grid-shadow');
      shadow.setAttribute('x', '-20%');
      shadow.setAttribute('y', '-20%');
      shadow.setAttribute('width', '140%');
      shadow.setAttribute('height', '140%');
      const drop = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
      drop.setAttribute('dx', '0');
      drop.setAttribute('dy', '0');
      drop.setAttribute('stdDeviation', '1.4');
      drop.setAttribute('flood-color', '#081018');
      drop.setAttribute('flood-opacity', '0.65');
      shadow.appendChild(drop);
      defs.appendChild(shadow);
      svg.appendChild(defs);

      const minorGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const majorGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const labelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

      minorGroup.setAttribute('opacity', '0.28');
      majorGroup.setAttribute('opacity', '0.65');
      labelGroup.setAttribute('filter', `url(#${containerId}-coord-grid-shadow)`);

      for (let value = 0; value <= 100; value += 5) {
        const x = (value / 100) * natW;
        const y = (value / 100) * natH;
        const isMajor = value % 10 === 0;

        const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        vLine.setAttribute('x1', x);
        vLine.setAttribute('y1', 0);
        vLine.setAttribute('x2', x);
        vLine.setAttribute('y2', natH);
        vLine.setAttribute('stroke', isMajor ? '#d8d2b2' : '#c4bea1');
        vLine.setAttribute('stroke-width', isMajor ? '1.15' : '0.65');
        vLine.setAttribute('stroke-dasharray', isMajor ? '8 5' : '4 7');

        const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        hLine.setAttribute('x1', 0);
        hLine.setAttribute('y1', y);
        hLine.setAttribute('x2', natW);
        hLine.setAttribute('y2', y);
        hLine.setAttribute('stroke', isMajor ? '#d8d2b2' : '#c4bea1');
        hLine.setAttribute('stroke-width', isMajor ? '1.15' : '0.65');
        hLine.setAttribute('stroke-dasharray', isMajor ? '8 5' : '4 7');

        (isMajor ? majorGroup : minorGroup).appendChild(vLine);
        (isMajor ? majorGroup : minorGroup).appendChild(hLine);

        if (!isMajor) continue;

        if (value < 100) {
          const topLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          topLabel.setAttribute('x', Math.min(x + 4, natW - 26));
          topLabel.setAttribute('y', 18);
          topLabel.setAttribute('fill', '#f3ecd0');
          topLabel.setAttribute('font-size', Math.max(11, natW * 0.008));
          topLabel.setAttribute('font-family', 'Cinzel, serif');
          topLabel.setAttribute('letter-spacing', '0.08em');
          topLabel.textContent = value.toString();
          labelGroup.appendChild(topLabel);
        }

        if (value > 0 && value < 100) {
          const sideLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          sideLabel.setAttribute('x', 8);
          sideLabel.setAttribute('y', Math.min(y - 4, natH - 10));
          sideLabel.setAttribute('fill', '#f3ecd0');
          sideLabel.setAttribute('font-size', Math.max(11, natW * 0.008));
          sideLabel.setAttribute('font-family', 'Cinzel, serif');
          sideLabel.setAttribute('letter-spacing', '0.08em');
          sideLabel.textContent = value.toString();
          labelGroup.appendChild(sideLabel);
        }
      }

      svg.appendChild(minorGroup);
      svg.appendChild(majorGroup);
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
