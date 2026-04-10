// Boat animation system for World of Myrdae
// Draws SVG sailing vessels that move slowly along water routes

class BoatFleet {
    constructor(svg, waterRoutes, locMap, natW, natH) {
        this.svg    = svg;
        this.waterRoutes = waterRoutes.filter(r => r.type === 'water-route');
        this.locMap = locMap;
        this.natW   = natW;
        this.natH   = natH;
        this.boats  = [];
        this.animationId = null;

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

            const baseDuration = 90000 + (routeIdx * 8000) + (Math.random() * 30000); // 90-120+ sec

            // Boat traveling forward
            this.boats.push({
                route,
                id: `boat-${route.id}-fwd`,
                reversed: false,
                startOffset: routeIdx * 0.13,
                duration: baseDuration,
                pathPoints,
                element: null
            });

            // Boat traveling backwards (bidirectional)
            this.boats.push({
                route,
                id: `boat-${route.id}-bwd`,
                reversed: true,
                startOffset: (routeIdx * 0.13) + 0.5, // Start on opposite end
                duration: baseDuration,
                pathPoints,
                element: null
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
                if (loc) points.push({ x: loc.x, y: loc.y });
                else console.warn(`Boat route "${route.id}": location "${pt}" not found in map`);
            } else if (Array.isArray(pt)) {
                points.push({ x: pt[0], y: pt[1] });
            } else if (pt && typeof pt.x === 'number') {
                points.push({ x: pt.x, y: pt.y });
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

    createBoatElement() {
        const s = this.boatSize;
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'boat');

        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', '0');
        dot.setAttribute('cy', '0');
        dot.setAttribute('r', Math.max(2, s * 0.45));
        dot.setAttribute('fill', '#4da6ff');
        dot.setAttribute('stroke', '#002f5e');
        dot.setAttribute('stroke-width', Math.max(0.5, s * 0.1));

        g.appendChild(dot);
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
        const raw      = ((Date.now() / boat.duration) + boat.startOffset) % 1;
        const progress = boat.reversed ? 1 - raw : raw;

        // Fade in/out near each endpoint so boats don't pop on/off
        let opacity = 1;
        if      (raw < 0.04)  opacity = raw / 0.04;
        else if (raw > 0.96)  opacity = (1 - raw) / 0.04;

        const pos  = this.interpolatePosition(boat.pathPoints, progress);
        const rot  = this.calculateRotation(boat.pathPoints, progress);
        const svgX = (pos.x / 100) * this.natW;
        const svgY = (pos.y / 100) * this.natH;

        if (!boat.element) {
            boat.element = this.createBoatElement();
        }

        boat.element.setAttribute('transform', `translate(${svgX},${svgY})`);
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
