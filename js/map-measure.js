/**
 * Interactive ruler for measuring direct distance and named-road travel.
 */
const MapMeasureTool = (function () {
  const DEFAULT_PACES = Object.freeze({
    road: { label: 'Road March', milesPerDay: 24 },
    trail: { label: 'Trail Pace', milesPerDay: 18 },
    wild: { label: 'Wilderness', milesPerDay: 15 },
    mounted: { label: 'Mounted', milesPerDay: 30 },
    ship: { label: 'By Ship', milesPerDay: 72 }
  });

  const instances = new Map();

  function makeSvgElement(tagName, attrs) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
    Object.entries(attrs || {}).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  }

  function formatMiles(value) {
    if (!Number.isFinite(value)) return '--';
    return value >= 100 ? Math.round(value).toLocaleString() : value.toFixed(1);
  }

  function formatDays(value) {
    if (!Number.isFinite(value)) return '--';
    return value >= 10 ? value.toFixed(1) : value.toFixed(2);
  }

  function getMapPointFromEvent(instance, event) {
    const container = instance.container;
    const mapImg = instance.mapImg;
    if (!mapImg.naturalWidth || !mapImg.naturalHeight) return null;

    const imgRect = mapImg.getBoundingClientRect();
    if (!imgRect.width || !imgRect.height) return null;

    const x = (event.clientX - imgRect.left) / imgRect.width * 100;
    const y = (event.clientY - imgRect.top) / imgRect.height * 100;

    if (x < 0 || x > 100 || y < 0 || y > 100) return null;
    return { x, y };
  }

  function getMapCoordinateSpace(mapImg) {
    const stack = (typeof MapLayerStack !== 'undefined') ? MapLayerStack : null;
    const coordinateSpace = stack && typeof stack.getCoordinateSpace === 'function'
      ? stack.getCoordinateSpace()
      : null;
    return {
      width: coordinateSpace?.width || mapImg.naturalWidth || 1,
      height: coordinateSpace?.height || mapImg.naturalHeight || 1
    };
  }

  function getMapRegistrationOffset() {
    const stack = (typeof MapLayerStack !== 'undefined') ? MapLayerStack : null;
    return stack && typeof stack.getRegistrationOffset === 'function'
      ? stack.getRegistrationOffset()
      : { x: 0, y: 0 };
  }

  function getRegisteredViewBox(mapImg) {
    const coordinateSpace = getMapCoordinateSpace(mapImg);
    const offset = getMapRegistrationOffset();
    return `${-offset.x} ${-offset.y} ${coordinateSpace.width} ${coordinateSpace.height}`;
  }

  function buildPointDescriptor(instance, point, target) {
    const locationId = target && target.closest ? target.closest('[data-location-id]')?.getAttribute('data-location-id') : null;
    let location = locationId ? MapOverlay.getLocationById(locationId) : null;
    if (!location) {
      location = MapOverlay.findNearestLocation(point.x, point.y, 1.1);
    }

    const hex = typeof CoordGrid !== 'undefined' ? CoordGrid.describePoint(point.x, point.y, instance.containerId) : null;

    if (location) {
      const coordinateSpace = getMapCoordinateSpace(instance.mapImg);
      return {
        type: 'location',
        id: location.id,
        name: location.name,
        x: location.x + (location.markerOffsetX || 0) / coordinateSpace.width * 100,
        y: location.y + (location.markerOffsetY || 0) / coordinateSpace.height * 100,
        hexCode: hex ? hex.code : '--'
      };
    }

    return {
      type: 'point',
      id: null,
      name: hex ? `Hex ${hex.code}` : `Point ${point.x.toFixed(1)}, ${point.y.toFixed(1)}`,
      x: point.x,
      y: point.y,
      hexCode: hex ? hex.code : '--'
    };
  }

  function setRouteSection(copyEl, text) {
    if (!copyEl) return;
    const headingEl = copyEl.previousElementSibling;
    const visible = !!text;
    copyEl.style.display = visible ? '' : 'none';
    if (headingEl) headingEl.style.display = visible ? '' : 'none';
    if (visible) copyEl.textContent = text;
  }

  function updateDisplay(instance) {
    const from = instance.fromPoint;
    const to = instance.toPoint;
    const paceKey = instance.paceSelect?.value || 'road';
    const pace = DEFAULT_PACES[paceKey] || DEFAULT_PACES.road;

    instance.fromLabel.textContent = from ? `${from.name} (${from.hexCode})` : 'Click the map for a starting point';
    instance.toLabel.textContent = to ? `${to.name} (${to.hexCode})` : 'Click the map for a destination';

    if (!from || !to) {
      instance.directLabel.textContent = '--';
      instance.daysLabel.textContent = '--';
      setRouteSection(instance.routeLabel, null);
      setRouteSection(instance.seaRouteLabel, null);
      instance.statusLabel.textContent = from ? 'Choose the second point to finish the measurement.' : 'Click two locations or two points on the map.';
      return;
    }

    const directPercent = MapOverlay.measurePercentDistance(from, to);
    const directMiles = MapOverlay.percentToMiles(directPercent);
    const directDays = MapOverlay.milesToDays(directMiles, pace.milesPerDay);
    instance.directLabel.textContent = `${formatMiles(directMiles)} miles`;
    instance.daysLabel.textContent = `${formatDays(directDays)} days`;

    if (from.id && to.id) {
      const route = MapOverlay.findRouteBetweenLocations(from.id, to.id);
      if (route) {
        const pathNames = route.path
          .map((locationId) => MapOverlay.getLocationById(locationId)?.name || locationId)
          .join(' -> ');
        setRouteSection(instance.routeLabel, `${formatMiles(route.miles)} miles / ${formatDays(route.days)} days via ${pathNames}`);
      } else {
        setRouteSection(instance.routeLabel, null);
      }

      const seaRoute = instance.seaRouteLabel ? MapOverlay.findSeaRouteBetweenLocations(from.id, to.id) : null;
      if (seaRoute) {
        const seaPathNames = seaRoute.path
          .map((locationId) => MapOverlay.getLocationById(locationId)?.name || locationId)
          .join(' -> ');
        setRouteSection(instance.seaRouteLabel, `${formatMiles(seaRoute.miles)} miles / ${formatDays(seaRoute.days)} days via ${seaPathNames}`);
      } else {
        setRouteSection(instance.seaRouteLabel, null);
      }
    } else {
      setRouteSection(instance.routeLabel, null);
      setRouteSection(instance.seaRouteLabel, null);
    }

    instance.statusLabel.textContent = `Direct travel uses ${pace.label.toLowerCase()} at ${pace.milesPerDay} miles per day.`;
  }

  function redrawOverlay(instance) {
    if (!instance.overlaySvg) return;
    instance.overlaySvg.innerHTML = '';

    if (!instance.fromPoint) return;

    const coordinateSpace = getMapCoordinateSpace(instance.mapImg);
    const natW = coordinateSpace.width;
    const natH = coordinateSpace.height;
    const fromX = (instance.fromPoint.x / 100) * natW;
    const fromY = (instance.fromPoint.y / 100) * natH;

    const startMarker = makeSvgElement('circle', {
      cx: fromX,
      cy: fromY,
      r: Math.max(5, natW * 0.002),
      fill: 'rgba(212, 175, 55, 0.2)',
      stroke: '#f5deb3',
      'stroke-width': '2.2'
    });
    instance.overlaySvg.appendChild(startMarker);

    if (!instance.toPoint) return;

    const toX = (instance.toPoint.x / 100) * natW;
    const toY = (instance.toPoint.y / 100) * natH;
    const line = makeSvgElement('line', {
      x1: fromX,
      y1: fromY,
      x2: toX,
      y2: toY,
      stroke: '#f0c96a',
      'stroke-width': Math.max(1.5, natW * 0.0007),
      'stroke-dasharray': `${Math.max(9, natW * 0.003)} ${Math.max(5, natW * 0.0018)}`,
      'stroke-linecap': 'round'
    });
    instance.overlaySvg.appendChild(line);

    const endMarker = makeSvgElement('circle', {
      cx: toX,
      cy: toY,
      r: Math.max(5, natW * 0.002),
      fill: 'rgba(220, 20, 60, 0.18)',
      stroke: '#ffd7a3',
      'stroke-width': '2.2'
    });
    instance.overlaySvg.appendChild(endMarker);

    const directPercent = MapOverlay.measurePercentDistance(instance.fromPoint, instance.toPoint);
    const directMiles = MapOverlay.percentToMiles(directPercent);
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    const labelBg = makeSvgElement('rect', {
      x: midX - 64,
      y: midY - 18,
      rx: '9',
      ry: '9',
      width: '128',
      height: '26',
      fill: 'rgba(5, 5, 10, 0.82)',
      stroke: 'rgba(240, 201, 106, 0.7)',
      'stroke-width': '1'
    });
    const label = makeSvgElement('text', {
      x: midX,
      y: midY,
      fill: '#f8e9c1',
      'font-size': Math.max(13, natW * 0.0043),
      'font-family': 'Cinzel, serif',
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
      'letter-spacing': '0.04em'
    });
    label.textContent = `${formatMiles(directMiles)} mi`;

    instance.overlaySvg.appendChild(labelBg);
    instance.overlaySvg.appendChild(label);
  }

  function ensureOverlay(instance) {
    const overlayId = `${instance.containerId}-measure-overlay`;
    let overlay = document.getElementById(overlayId);
    if (overlay) {
      overlay.setAttribute('viewBox', getRegisteredViewBox(instance.mapImg));
      instance.overlaySvg = overlay;
      return;
    }

    overlay = makeSvgElement('svg', {
      id: overlayId,
      class: 'map-measure-overlay',
      viewBox: getRegisteredViewBox(instance.mapImg),
      preserveAspectRatio: 'xMinYMin meet'
    });
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = 'auto';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '11';

    instance.mapImg.parentNode.insertBefore(overlay, instance.mapImg.nextSibling);
    instance.overlaySvg = overlay;
  }

  function clearMeasurement(instance) {
    instance.fromPoint = null;
    instance.toPoint = null;
    updateDisplay(instance);
    redrawOverlay(instance);
  }

  function handleMapClick(instance, event) {
    if (!instance.active) return;
    if (
      event.target.closest('.map-controls') ||
      event.target.closest('.legend-panel') ||
      event.target.closest('.time-controls-panel') ||
      event.target.closest('.map-measure-panel') ||
      event.target.closest('.map-btn')
    ) {
      return;
    }

    const point = getMapPointFromEvent(instance, event);
    if (!point) return;

    const descriptor = buildPointDescriptor(instance, point, event.target);
    if (!instance.fromPoint || (instance.fromPoint && instance.toPoint)) {
      instance.fromPoint = descriptor;
      instance.toPoint = null;
    } else {
      instance.toPoint = descriptor;
    }

    updateDisplay(instance);
    redrawOverlay(instance);
  }

  function toggle(instance) {
    instance.active = !instance.active;
    instance.panel.style.display = instance.active ? 'block' : 'none';
    if (instance.button) {
      instance.button.style.opacity = instance.active ? '1' : '0.5';
      instance.button.title = instance.active ? 'Hide Hex Ruler' : 'Show Hex Ruler';
    }
    if (!instance.active) {
      clearMeasurement(instance);
    } else {
      updateDisplay(instance);
      redrawOverlay(instance);
    }
    return instance.active;
  }

  function init(options) {
    const container = document.getElementById(options.containerId);
    const mapImg = document.getElementById(options.imageId);
    const panel = document.getElementById(options.panelId);
    if (!container || !mapImg || !panel) return null;

    const instance = {
      ...options,
      container,
      mapImg,
      panel,
      button: document.getElementById(options.buttonId),
      fromLabel: document.getElementById(options.fromLabelId),
      toLabel: document.getElementById(options.toLabelId),
      directLabel: document.getElementById(options.directLabelId),
      daysLabel: document.getElementById(options.daysLabelId),
      routeLabel: document.getElementById(options.routeLabelId),
      seaRouteLabel: document.getElementById(options.seaRouteLabelId),
      statusLabel: document.getElementById(options.statusLabelId),
      paceSelect: document.getElementById(options.paceSelectId),
      clearButton: document.getElementById(options.clearButtonId),
      active: false,
      fromPoint: null,
      toPoint: null,
      overlaySvg: null
    };

    instances.set(options.containerId, instance);

    const setup = () => {
      ensureOverlay(instance);
      updateDisplay(instance);
      redrawOverlay(instance);
    };

    if (mapImg.complete && mapImg.naturalWidth) {
      setup();
    } else {
      mapImg.addEventListener('load', setup, { once: true });
    }

    container.addEventListener('click', (event) => handleMapClick(instance, event));
    instance.paceSelect?.addEventListener('change', () => updateDisplay(instance));
    instance.clearButton?.addEventListener('click', () => clearMeasurement(instance));

    return {
      toggle: () => toggle(instance),
      clear: () => clearMeasurement(instance)
    };
  }

  return {
    init
  };
})();
