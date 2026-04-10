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
