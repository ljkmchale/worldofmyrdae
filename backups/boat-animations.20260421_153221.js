// Boat animation system for World of Myrdae
// Draws SVG sailing vessels that move slowly along water routes

// ── Boat tooltip helpers ─────────────────────────────────────────────────────
let _boatTooltip = null;

function _getBoatTooltip() {
    if (!_boatTooltip) {
        _boatTooltip = document.createElement('div');
        _boatTooltip.className = 'map-tooltip';
        _boatTooltip.style.display = 'none';
        _boatTooltip.style.pointerEvents = 'none';
        document.body.appendChild(_boatTooltip);
    }
    return _boatTooltip;
}

const RISK_COLORS = { low: '#4caf50', medium: '#ff9800', high: '#f44336', deadly: '#9c27b0' };
const PURPOSE_LABELS = { merchant: 'Merchant Trade', military: 'Military Patrol', exploration: 'Exploration', smuggling: 'Smuggling', fishing: 'Fishing', passenger: 'Passenger' };
const MAP_MILES_PER_PERCENT = 25;
const SHIP_TOOLTIP_IMAGES = {
    'Caravel': 'images/tooltips/ships/caravel.png',
    'Sloop': 'images/tooltips/ships/sloop.png',
    'Brigantine': 'images/tooltips/ships/brigantine.png',
    'Galleon': 'images/tooltips/ships/galleon.png',
    'Frigate': 'images/tooltips/ships/frigate.png',
    'Merchant Cog': 'images/tooltips/ships/merchant-cog.png',
    'Longship': 'images/tooltips/ships/longship.png'
};
const SAILING_SPEEDS = {
    'Caravel': 72,
    'Sloop': 84,
    'Brigantine': 78,
    'Galleon': 66,
    'Frigate': 82,
    'Merchant Cog': 58,
    'Longship': 88,
    'Warship': 80,
    'Fishing Vessel': 46,
    'Ship': 68,
    default: 68
};
const FALLBACK_DAY_REAL_MS = 60 * 60 * 1000;

function _measurePathMiles(points) {
    let totalPercent = 0;
    for (let i = 1; i < points.length; i += 1) {
        const dx = points[i].x - points[i - 1].x;
        const dy = points[i].y - points[i - 1].y;
        totalPercent += Math.sqrt((dx * dx) + (dy * dy));
    }
    return totalPercent * MAP_MILES_PER_PERCENT;
}

function _getSailingSpeed(shipType) {
    return SAILING_SPEEDS[shipType] || SAILING_SPEEDS.default;
}

function _getFallbackWorldHours(now = performance.now()) {
    return (now / FALLBACK_DAY_REAL_MS) * 24;
}

function _getRouteProgress(roundTripWorldHours, startOffset = 0, now = performance.now()) {
    if (window.MyrdaeWorldClock && typeof window.MyrdaeWorldClock.getRouteProgress === 'function') {
        return window.MyrdaeWorldClock.getRouteProgress(roundTripWorldHours, startOffset, now);
    }

    if (!roundTripWorldHours || roundTripWorldHours <= 0) {
        return ((startOffset % 1) + 1) % 1;
    }

    const totalWorldHours = _getFallbackWorldHours(now);
    return (((totalWorldHours / roundTripWorldHours) + startOffset) % 1 + 1) % 1;
}

function _getWaterRouteDisplayName(route, pathPoints, locMap) {
    if (route.name && route.name.trim()) return route.name.trim();

    const endpointIds = pathPoints
        .map(point => point.locationId)
        .filter(Boolean);

    if (endpointIds.length >= 2) {
        const start = locMap.get(endpointIds[0]);
        const end = locMap.get(endpointIds[endpointIds.length - 1]);
        if (start && end) return `${start.name} to ${end.name}`;
    }

    if (route.id) {
        return route.id
            .replace(/[-_]+/g, ' ')
            .replace(/\bsea\b/gi, '')
            .replace(/\bwater\b/gi, '')
            .replace(/\broute\b/gi, '')
            .replace(/\b\w/g, ch => ch.toUpperCase());
    }

    return 'Water Route';
}

function _getShipTooltipImage(boat) {
    if (!boat) return null;
    return boat.shipTooltipImage || SHIP_TOOLTIP_IMAGES[boat.shipType] || null;
}

function _showBoatTooltip(e, boat) {
    const tt = _getBoatTooltip();
    let extra = '';
    const sailingDays = boat.routeMiles / boat.sailingSpeed;
    const sailingLabel = sailingDays < 1
        ? `${(sailingDays * 24).toFixed(1)} hrs by sail`
        : `${sailingDays.toFixed(1)} days by sail`;
    if (boat.routePurpose || boat.cargo || boat.riskLevel) {
        const purposeLabel = PURPOSE_LABELS[boat.routePurpose] || boat.routePurpose || '';
        const riskColor = RISK_COLORS[boat.riskLevel] || '#a0a0a0';
        const riskLabel = boat.riskLevel ? boat.riskLevel.charAt(0).toUpperCase() + boat.riskLevel.slice(1) : '';
        extra = `<div style="margin-top:0.4rem;padding-top:0.4rem;border-top:1px solid rgba(77,166,255,0.2);font-family:'Cormorant Garamond',serif;font-size:0.85rem;color:#c0c0c0;">`;
        if (purposeLabel) extra += `<div>${purposeLabel}</div>`;
        if (boat.cargo) extra += `<div style="color:#aaa;font-style:italic;">${boat.cargo}</div>`;
        if (riskLabel) extra += `<div style="margin-top:0.2rem;">Risk: <span style="color:${riskColor};font-weight:600;">${riskLabel}</span></div>`;
        extra += `</div>`;
    }
    const shipTooltipImage = _getShipTooltipImage(boat);
    tt.innerHTML = `
        <div class="${shipTooltipImage ? 'tt-img-wrap tt-water-img-wrap tt-boat-header' : 'tt-water-static-header tt-boat-header'}">
            <div class="tt-water-badge">⚓ Sea Route</div>
            ${shipTooltipImage ? `<img src="${shipTooltipImage}" alt="${boat.shipType}" onerror="this.closest('.tt-img-wrap')?.classList.remove('tt-img-wrap','tt-water-img-wrap');this.closest('div').className='tt-water-static-header tt-boat-header';this.remove();">` : ''}
            <div class="tt-name-overlay">${boat.shipName}</div>
        </div>
        <div class="tt-body">
            <div class="tt-type">${boat.shipType}</div>
            <div class="tt-desc">Captain: <em>${boat.captainName}</em></div>
            <div class="tt-desc" style="margin-top:0.2rem;"><em>${boat.routeName}</em></div>
            <div class="tt-desc" style="margin-top:0.2rem;">${Math.round(boat.routeMiles)} miles • ${sailingLabel}</div>
            ${extra}
        </div>
    `;
    tt.style.display = 'block';
    _positionBoatTooltip(e);
}

function _positionBoatTooltip(e) {
    const tt = _getBoatTooltip();
    const margin = 14;
    let x = e.clientX + margin;
    let y = e.clientY + margin;
    const rect = tt.getBoundingClientRect();
    if (x + rect.width  > window.innerWidth)  x = e.clientX - rect.width  - margin;
    if (y + rect.height > window.innerHeight) y = e.clientY - rect.height - margin;
    tt.style.left = x + 'px';
    tt.style.top  = y + 'px';
}

function _hideBoatTooltip() {
    if (_boatTooltip) _boatTooltip.style.display = 'none';
}
// ─────────────────────────────────────────────────────────────────────────────

class BoatFleet {
    constructor(svg, waterRoutes, locMap, natW, natH) {
        this.svg    = svg;
        this.waterRoutes = waterRoutes.filter(r => r.type === 'water-route');
        this.locMap = locMap;
        this.natW   = natW;
        this.natH   = natH;
        this.boats  = [];
        this.animationId = null;

        // Default colors for different ship types
        this.typeColors = {
            'Caravel': '#ffcc00',
            'Sloop': '#4da6ff',
            'Brigantine': '#ff6600',
            'Galleon': '#ff3333',
            'Frigate': '#cc33ff',
            'Merchant Cog': '#99ff33',
            'Longship': '#964B00',
            'Warship': '#555555',
            'Fishing Vessel': '#00cccc'
        };

        // Boat dots should be small markers on the map.
        this.boatSize = Math.max(4, natW * 0.0012);

        // Create a dedicated layer for boats
        this.boatsLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.boatsLayer.setAttribute('class', 'overlay-boats');
        this.svg.appendChild(this.boatsLayer);

        this.initializeBoats();
        this.initializeSeaMonster();
        this.startAnimation();
    }

    initializeBoats() {
        this.waterRoutes.forEach((route, routeIdx) => {
            const pathPoints = this.calculatePathPoints(route);
            if (pathPoints.length < 2) return;

            const shipName    = route.shipName    || route.name || 'Unknown Vessel';
            const shipType    = route.shipType    || 'Ship';
            const captainName = route.captainName || 'Unknown';
            const routeMiles  = _measurePathMiles(pathPoints);
            const sailingSpeed = _getSailingSpeed(shipType);

            const sailingDays = routeMiles / sailingSpeed;
            const routeName   = _getWaterRouteDisplayName(route, pathPoints, this.locMap);
            
            // Use saved boatColor, or look up default by type, or fallback to blue
            const boatColor   = route.boatColor || this.typeColors[shipType] || '#4da6ff';
            
            const boatSizeMul = route.boatSizeMultiplier || 1;
            const routePurpose = route.routePurpose || '';
            const cargo        = route.cargo        || '';
            const riskLevel    = route.riskLevel    || '';
            const shipTooltipImage = route.shipTooltipImage || route.shipPreviewImage || null;

            // Create exactly ONE boat per route so name/captain are unique
            this.boats.push({
                route,
                id: `boat-${route.id}`,
                startOffset: routeIdx * 0.17, // Randomize starting position along the loop
                pathPoints,
                element: null,
                shipName,
                shipType,
                captainName,
                routeName,
                routeMiles,
                sailingSpeed,
                roundTripWorldHours: Math.max(sailingDays * 24 * 2, 0.25),
                shipTooltipImage,
                boatColor,
                boatSizeMul,
                routePurpose,
                cargo,
                riskLevel
            });
        });
    }

    initializeSeaMonster() {
        this.seaMonster = {
            pathPoints: [
                { x: 35.0, y: 58.8 },
                { x: 33.4, y: 52.1 },
                { x: 37.6, y: 51.3 },
                { x: 39.6, y: 48.3 },
                { x: 42.3, y: 54.9 },
                { x: 40.2, y: 59.2 }
            ],
            cycle: 240000,
            pulseInterval: 45000,
            visibleDuration: 7000,
            wasVisible: false,
            element: null,
            splashGroup: null,
            splashes: [],
            lastSplash: 0,
            size: Math.max(12, this.natW * 0.0012),
            startTime: Date.now()
        };

        this.monsterLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.monsterLayer.setAttribute('class', 'overlay-sea-monster');
        this.svg.appendChild(this.monsterLayer);
    }

    calculatePathPoints(route) {
        const points = [];
        const src    = route.points || route.waypoints || [];
        src.forEach(pt => {
            if (typeof pt === 'string') {
                const loc = this.locMap.get(pt);
                if (loc) points.push({ x: loc.x, y: loc.y, locationId: loc.id });
                else console.warn(`Boat route "${route.id}": location "${pt}" not found in map`);
            } else if (Array.isArray(pt)) {
                points.push({ x: pt[0], y: pt[1], locationId: null });
            } else if (pt && typeof pt.x === 'number') {
                points.push({ x: pt.x, y: pt.y, locationId: pt.locationId || null });
            }
        });
        return points;
    }

    interpolatePosition(points, t) {
        if (points.length < 2) return points[0] || { x: 0, y: 0 };
        const n   = points.length - 1;
        const seg = Math.min(Math.floor(t * n), n - 1);
        const st  = (t * n) - seg;
        const p1  = points[seg];
        const p2  = points[seg + 1];
        return { x: p1.x + (p2.x - p1.x) * st, y: p1.y + (p2.y - p1.y) * st };
    }

    calculateRotation(points, t) {
        if (points.length < 2) return 0;
        const n   = points.length - 1;
        const seg = Math.min(Math.floor(t * n), n - 1);
        const p1  = points[seg];
        const p2  = points[seg + 1];
        return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    }

    createBoatElement(boat) {
        const s = this.boatSize * (boat.boatSizeMul || 1);
        const color = boat.boatColor || '#4da6ff';
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'boat');
        g.style.cursor = 'pointer';

        // Use a simple circle as requested, colored by type
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', '0');
        dot.setAttribute('cy', '0');
        dot.setAttribute('r', Math.max(2, s * 0.45));
        dot.setAttribute('fill', color);
        dot.setAttribute('stroke', '#002f5e');
        dot.setAttribute('stroke-width', Math.max(0.5, s * 0.1));

        g.appendChild(dot);

        // Hover tooltip showing ship name, type, and captain
        g.addEventListener('mouseenter', (e) => _showBoatTooltip(e, boat));
        g.addEventListener('mousemove',  (e) => _positionBoatTooltip(e));
        g.addEventListener('mouseleave', ()  => _hideBoatTooltip());

        this.boatsLayer.appendChild(g);
        return g;
    }

    createSeaMonsterElement() {
        const size = this.seaMonster.size;
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'sea-serpent');
        g.setAttribute('opacity', '0');

        const splashGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        splashGroup.setAttribute('class', 'sea-serpent-splash-group');

        const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        head.setAttribute('cx', '0');
        head.setAttribute('cy', '0');
        head.setAttribute('r', Math.max(3.5, size * 0.28));
        head.setAttribute('fill', 'rgba(35, 88, 112, 0.92)');
        head.setAttribute('stroke', 'rgba(180, 235, 255, 0.9)');
        head.setAttribute('stroke-width', Math.max(1, size * 0.12));

        const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glow.setAttribute('cx', '0');
        glow.setAttribute('cy', '0');
        glow.setAttribute('r', Math.max(1.8, size * 0.18));
        glow.setAttribute('fill', 'rgba(173, 231, 255, 0.35)');

        g.appendChild(splashGroup);
        g.appendChild(glow);
        g.appendChild(head);

        this.seaMonster.splashGroup = splashGroup;
        this.monsterLayer.appendChild(g);
        return g;
    }

    updateSeaMonster() {
        if (!this.seaMonster) return;

        const now = Date.now();
        const cycleProgress = ((now - this.seaMonster.startTime) % this.seaMonster.cycle) / this.seaMonster.cycle;
        const pathPos = this.interpolatePosition(this.seaMonster.pathPoints, cycleProgress);

        const pulseProgress = ((now - this.seaMonster.startTime) % this.seaMonster.pulseInterval) / this.seaMonster.pulseInterval;
        const visiblePulseThreshold = this.seaMonster.visibleDuration / this.seaMonster.pulseInterval;
        const isVisible = pulseProgress < visiblePulseThreshold;
        const visibleProgress = isVisible ? (pulseProgress / visiblePulseThreshold) : 0;

        const rise = isVisible ? Math.sin(visibleProgress * Math.PI) * 0.45 : 0;
        const x = pathPos.x;
        const y = pathPos.y - rise;
        const svgX = (x / 100) * this.natW;
        const svgY = (y / 100) * this.natH;
        const rotation = this.calculateRotation(this.seaMonster.pathPoints, cycleProgress);

        if (!this.seaMonster.element) {
            this.seaMonster.element = this.createSeaMonsterElement();
        }

        this.seaMonster.element.setAttribute('transform', `translate(${svgX},${svgY}) rotate(${rotation})`);
        this.seaMonster.element.setAttribute('opacity', isVisible ? `${0.7 + rise * 0.18}` : '0');

        if (isVisible && !this.seaMonster.wasVisible) {
            this.createMonsterSplash();
        }
        this.seaMonster.wasVisible = isVisible;

        this.seaMonster.splashes = this.seaMonster.splashes.filter(splash => {
            const age = (now - splash.startTime) / 1200;
            if (age >= 1) {
                if (splash.element.parentNode) splash.element.parentNode.removeChild(splash.element);
                return false;
            }

            const radius = this.seaMonster.size * 0.35 + age * this.seaMonster.size * 1.1;
            splash.element.setAttribute('r', radius);
            splash.element.setAttribute('opacity', `${Math.max(0, 0.65 - age * 0.65)}`);
            splash.element.setAttribute('cx', '0');
            splash.element.setAttribute('cy', '0');
            return true;
        });
    }

    createMonsterSplash() {
        if (!this.seaMonster.splashGroup) return;

        const size = this.seaMonster.size;
        const splash = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        splash.setAttribute('fill', 'none');
        splash.setAttribute('stroke', 'rgba(198, 241, 255, 0.85)');
        splash.setAttribute('stroke-width', Math.max(1, size * 0.12));
        splash.setAttribute('opacity', '0.75');
        splash.setAttribute('cx', '0');
        splash.setAttribute('cy', '0');
        splash.setAttribute('r', `${Math.max(3, size * 0.3)}`);

        this.seaMonster.splashGroup.appendChild(splash);
        this.seaMonster.splashes.push({ element: splash, startTime: Date.now() });
    }

    updateBoat(boat) {
        // Raw progress from 0 to 1 for the total round trip
        const now = performance.now();
        const totalProgress = _getRouteProgress(boat.roundTripWorldHours, boat.startOffset, now);
        
        // Split progress: 0.0-0.5 is forward, 0.5-1.0 is backward
        let raw, reversed;
        if (totalProgress < 0.5) {
            raw = totalProgress * 2; // Map 0-0.5 to 0-1
            reversed = false;
        } else {
            raw = (totalProgress - 0.5) * 2; // Map 0.5-1.0 to 0-1
            reversed = true;
        }

        const progress = reversed ? 1 - raw : raw;

        // Fade in/out near the "docking" points (ends of the route)
        // Since it's a round trip, it only "docks" at progress 0 and 1
        let opacity = 1;
        if      (raw < 0.05) opacity = raw / 0.05;
        else if (raw > 0.95) opacity = (1 - raw) / 0.05;

        const pos  = this.interpolatePosition(boat.pathPoints, progress);
        const rot  = this.calculateRotation(boat.pathPoints, progress);
        const svgX = (pos.x / 100) * this.natW;
        const svgY = (pos.y / 100) * this.natH;

        if (!boat.element) {
            boat.element = this.createBoatElement(boat);
        }

        // Adjust rotation based on direction (reversed travels backward, so rotate 180)
        const finalRot = reversed ? rot + 180 : rot;

        // Shapes pointing Up (negative Y) need +90 to align with atan2 output
        boat.element.setAttribute('transform', `translate(${svgX},${svgY}) rotate(${finalRot + 90})`);
        boat.element.setAttribute('opacity', opacity);
    }

    animate = () => {
        this.boats.forEach(boat => this.updateBoat(boat));
        this.updateSeaMonster();
        this.animationId = requestAnimationFrame(this.animate);
    }

    startAnimation() {
        if (!this.animationId) this.animate();
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    destroy() {
        this.stopAnimation();
        if (this.boatsLayer && this.boatsLayer.parentNode) {
            this.boatsLayer.parentNode.removeChild(this.boatsLayer);
        }
    }
}

// Global fleet instance
let globalBoatFleet = null;

function initializeBoatAnimations(svg, data, locMap, natW, natH) {
    if (globalBoatFleet) globalBoatFleet.destroy();
    globalBoatFleet = new BoatFleet(svg, data.roads || [], locMap, natW, natH);
}

function destroyBoatAnimations() {
    if (globalBoatFleet) {
        globalBoatFleet.destroy();
        globalBoatFleet = null;
    }
}
