// Dragon overlay module for World of Myrdae
// Renders a golden top-down dragon flyover above Arbescar

const DragonFlyover = (function () {
    let svg = null;
    let dragonGroup = null;
    let dragonElement = null;
    let dragonPathPoints = [
        { x: 72.89, y: 69.49 }, // Gliddering Falls (home)
        { x: 75.0,  y: 65.5  }, // northeast (Blustery Waste / Tal'besar)
        { x: 73.0,  y: 63.5  }, // north
        { x: 69.5,  y: 64.5  }, // northwest
        { x: 67.5,  y: 67.5  }, // west (Siltbay coast)
        { x: 67.5,  y: 72.5  }, // southwest (Nebisill)
        { x: 69.5,  y: 74.5  }, // south (Dire of Arbescar)
        { x: 72.5,  y: 73.5  }, // southeast (Farview)
        { x: 75.0,  y: 71.0  }, // east
        { x: 72.89, y: 69.49 }  // Return home to Gliddering Falls
    ];
    let natW = 0;
    let natH = 0;
    let animationId = null;
    let startTime = Date.now();
    const cycle = 240000; // complete path in 4 minutes
    const pulseInterval = 70000; // appear roughly every 70 seconds
    const visibleDuration = 7000; // visible for 7 seconds
    const dragonScaleFactor = 0.0015;

    function getOverlay(containerId) {
        return document.getElementById(containerId + '-overlay');
    }

    function mkPath(d, fill, stroke, sw, extra) {
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        el.setAttribute('d', d);
        el.setAttribute('fill', fill || 'none');
        if (stroke) el.setAttribute('stroke', stroke);
        if (sw)     el.setAttribute('stroke-width', sw);
        el.setAttribute('stroke-linejoin', 'round');
        el.setAttribute('stroke-linecap', 'round');
        if (extra) Object.entries(extra).forEach(([k,v]) => el.setAttribute(k, v));
        return el;
    }

    function createDragon() {
        const s = Math.max(5, natW * dragonScaleFactor);
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'overlay-dragon');
        g.setAttribute('opacity', '0');
        g.style.pointerEvents = 'none';

        // Dragon faces up (negative y) in local space; +90° rotation offset aligns with travel dir.
        const gold      = 'rgba(240, 190, 40, 0.95)';
        const goldLight = 'rgba(255, 235, 130, 0.98)';
        const goldWing  = 'rgba(200, 145, 18, 0.82)';
        const goldDark  = 'rgba(130, 68, 4, 0.95)';
        const sw        = Math.max(0.6, s * 0.05);
        const swThin    = Math.max(0.4, s * 0.025);

        // --- Left wing: wide leathery wing, 4 bone spars, scalloped trailing edge ---
        g.appendChild(mkPath(
            `M ${-s*0.2}  ${-s*0.32}
             C ${-s*0.9}  ${-s*0.9},  ${-s*1.4} ${-s*1.05}, ${-s*1.65} ${-s*0.88}
             L ${-s*2.35} ${-s*0.08}
             C ${-s*2.2}  ${s*0.28},  ${-s*2.05} ${s*0.42}, ${-s*1.88} ${s*0.38}
             C ${-s*1.72} ${s*0.34},  ${-s*1.62} ${s*0.58}, ${-s*1.45} ${s*0.54}
             C ${-s*1.28} ${s*0.5},   ${-s*1.18} ${s*0.72}, ${-s*1.02} ${s*0.68}
             C ${-s*0.82} ${s*0.64},  ${-s*0.52} ${s*0.62}, ${-s*0.2}  ${s*0.42}
             Z`,
            goldWing, goldDark, sw
        ));
        // Left bone spars
        g.appendChild(mkPath(`M ${-s*0.18} ${-s*0.28} L ${-s*1.6}  ${-s*0.82}`, 'none', 'rgba(110,55,4,0.45)', swThin));
        g.appendChild(mkPath(`M ${-s*0.18} ${-s*0.28} L ${-s*2.2}  ${-s*0.02}`, 'none', 'rgba(110,55,4,0.45)', swThin));
        g.appendChild(mkPath(`M ${-s*0.18} ${-s*0.28} L ${-s*1.85} ${s*0.38}`,  'none', 'rgba(110,55,4,0.45)', swThin));
        g.appendChild(mkPath(`M ${-s*0.18} ${-s*0.28} L ${-s*1.42} ${s*0.54}`,  'none', 'rgba(110,55,4,0.45)', swThin));
        // Left elbow claw
        g.appendChild(mkPath(
            `M ${-s*1.55} ${-s*0.82} L ${-s*1.72} ${-s*1.08} M ${-s*1.55} ${-s*0.82} L ${-s*1.85} ${-s*0.88}`,
            'none', goldDark, sw
        ));

        // --- Right wing (mirror) ---
        g.appendChild(mkPath(
            `M ${s*0.2}  ${-s*0.32}
             C ${s*0.9}  ${-s*0.9},  ${s*1.4} ${-s*1.05}, ${s*1.65} ${-s*0.88}
             L ${s*2.35} ${-s*0.08}
             C ${s*2.2}  ${s*0.28},  ${s*2.05} ${s*0.42}, ${s*1.88} ${s*0.38}
             C ${s*1.72} ${s*0.34},  ${s*1.62} ${s*0.58}, ${s*1.45} ${s*0.54}
             C ${s*1.28} ${s*0.5},   ${s*1.18} ${s*0.72}, ${s*1.02} ${s*0.68}
             C ${s*0.82} ${s*0.64},  ${s*0.52} ${s*0.62}, ${s*0.2}  ${s*0.42}
             Z`,
            goldWing, goldDark, sw
        ));
        // Right bone spars
        g.appendChild(mkPath(`M ${s*0.18} ${-s*0.28} L ${s*1.6}  ${-s*0.82}`, 'none', 'rgba(110,55,4,0.45)', swThin));
        g.appendChild(mkPath(`M ${s*0.18} ${-s*0.28} L ${s*2.2}  ${-s*0.02}`, 'none', 'rgba(110,55,4,0.45)', swThin));
        g.appendChild(mkPath(`M ${s*0.18} ${-s*0.28} L ${s*1.85} ${s*0.38}`,  'none', 'rgba(110,55,4,0.45)', swThin));
        g.appendChild(mkPath(`M ${s*0.18} ${-s*0.28} L ${s*1.42} ${s*0.54}`,  'none', 'rgba(110,55,4,0.45)', swThin));
        // Right elbow claw
        g.appendChild(mkPath(
            `M ${s*1.55} ${-s*0.82} L ${s*1.72} ${-s*1.08} M ${s*1.55} ${-s*0.82} L ${s*1.85} ${-s*0.88}`,
            'none', goldDark, sw
        ));

        // --- Body (long, narrow) ---
        g.appendChild(mkPath(
            `M 0 ${-s*0.9}
             C ${s*0.24} ${-s*0.68}, ${s*0.28} ${-s*0.1}, ${s*0.24} ${s*0.3}
             C ${s*0.18} ${s*0.6},   ${s*0.1}  ${s*0.85}, 0 ${s*1.15}
             C ${-s*0.1} ${s*0.85},  ${-s*0.18} ${s*0.6}, ${-s*0.24} ${s*0.3}
             C ${-s*0.28} ${-s*0.1}, ${-s*0.24} ${-s*0.68}, 0 ${-s*0.9}
             Z`,
            gold, goldDark, sw
        ));

        // --- Rear legs/claws at hips ---
        g.appendChild(mkPath(
            `M ${-s*0.22} ${s*0.35} L ${-s*0.45} ${s*0.6} L ${-s*0.55} ${s*0.5}
             M ${-s*0.22} ${s*0.35} L ${-s*0.5}  ${s*0.72}`,
            'none', goldDark, sw
        ));
        g.appendChild(mkPath(
            `M ${s*0.22} ${s*0.35} L ${s*0.45} ${s*0.6} L ${s*0.55} ${s*0.5}
             M ${s*0.22} ${s*0.35} L ${s*0.5}  ${s*0.72}`,
            'none', goldDark, sw
        ));

        // --- Long whip tail with spade tip ---
        g.appendChild(mkPath(
            `M ${s*0.1}  ${s*1.1}
             C ${s*0.2}  ${s*1.4},  ${s*0.28} ${s*1.7},  ${s*0.2}  ${s*1.95}
             L 0         ${s*2.2}
             L ${-s*0.2} ${s*1.95}
             C ${-s*0.28} ${s*1.7}, ${-s*0.2} ${s*1.4}, ${-s*0.1} ${s*1.1}
             Z`,
            gold, goldDark, sw
        ));

        // --- Neck ---
        g.appendChild(mkPath(
            `M ${-s*0.2} ${-s*0.88} C ${-s*0.18} ${-s*1.1}, ${-s*0.14} ${-s*1.3}, ${-s*0.1} ${-s*1.5}
             M  ${s*0.2} ${-s*0.88} C  ${s*0.18} ${-s*1.1},  ${s*0.14} ${-s*1.3},  ${s*0.1} ${-s*1.5}`,
            'none', goldDark, swThin
        ));

        // --- Head (from reference: oval with pointed snout) ---
        g.appendChild(mkPath(
            `M 0 ${-s*1.75}
             C ${s*0.16} ${-s*1.6}, ${s*0.24} ${-s*1.3}, ${s*0.2}  ${-s*1.08}
             C ${s*0.16} ${-s*0.96}, ${s*0.08} ${-s*0.9}, 0 ${-s*0.88}
             C ${-s*0.08} ${-s*0.9}, ${-s*0.16} ${-s*0.96}, ${-s*0.2} ${-s*1.08}
             C ${-s*0.24} ${-s*1.3}, ${-s*0.16} ${-s*1.6}, 0 ${-s*1.75}
             Z`,
            goldLight, goldDark, sw
        ));

        // --- Horns ---
        g.appendChild(mkPath(`M ${-s*0.1} ${-s*1.55} L ${-s*0.24} ${-s*1.88}`, 'none', goldDark, Math.max(0.5, s*0.045)));
        g.appendChild(mkPath(`M ${s*0.1}  ${-s*1.55} L ${s*0.24}  ${-s*1.88}`, 'none', goldDark, Math.max(0.5, s*0.045)));

        // --- Eyes ---
        function dot(cx, cy, r, fill) {
            const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r);
            c.setAttribute('fill', fill);
            return c;
        }
        const er = Math.max(0.5, s * 0.065);
        g.appendChild(dot(-s*0.1, -s*1.28, er, 'rgba(15,5,0,0.95)'));
        g.appendChild(dot( s*0.1, -s*1.28, er, 'rgba(15,5,0,0.95)'));

        g.setAttribute('filter', 'drop-shadow(0 0 6px rgba(255,210,60,0.5))');

        return g;
    }

    function interpolatePosition(points, t) {
        if (points.length < 2) return points[0] || { x: 0, y: 0 };
        const n = points.length - 1;
        const seg = Math.min(Math.floor(t * n), n - 1);
        const st = (t * n) - seg;
        const p1 = points[seg];
        const p2 = points[seg + 1];
        return {
            x: p1.x + (p2.x - p1.x) * st,
            y: p1.y + (p2.y - p1.y) * st
        };
    }

    function calculateRotation(points, t) {
        if (points.length < 2) return 0;
        const n = points.length - 1;
        const seg = Math.min(Math.floor(t * n), n - 1);
        const p1 = points[seg];
        const p2 = points[seg + 1];
        return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI + 90;
    }

    function updateDragon() {
        if (!dragonElement || !svg) return;

        const now = Date.now();
        const cycleProgress = ((now - startTime) % cycle) / cycle;
        const pathPos = interpolatePosition(dragonPathPoints, cycleProgress);

        const pulseProgress = ((now - startTime) % pulseInterval) / pulseInterval;
        const visiblePulseThreshold = visibleDuration / pulseInterval;
        const isVisible = pulseProgress < visiblePulseThreshold;
        const visibleProgress = isVisible ? (pulseProgress / visiblePulseThreshold) : 0;

        const rise = isVisible ? Math.sin(visibleProgress * Math.PI) * 0.35 : 0;
        const x = pathPos.x;
        const y = pathPos.y - rise;
        const svgX = (x / 100) * natW;
        const svgY = (y / 100) * natH;
        const rotation = calculateRotation(dragonPathPoints, cycleProgress);

        dragonElement.setAttribute('transform', `translate(${svgX},${svgY}) rotate(${rotation})`);
        dragonElement.setAttribute('opacity', isVisible ? `${0.6 + rise * 0.25}` : '0');
    }

    function animate() {
        updateDragon();
        animationId = requestAnimationFrame(animate);
    }

    function init(containerId, imageId) {
        if (document.body?.dataset?.mapRealm === 'underdark') {
            destroy();
            return;
        }
        const overlay = getOverlay(containerId);
        if (!overlay) {
            // SVG overlay not ready yet — retry until it appears
            setTimeout(() => init(containerId, imageId), 200);
            return;
        }

        if (dragonGroup && dragonGroup.parentNode === overlay) {
            return; // Already initialized
        }

        svg = overlay;

        const viewBox = overlay.getAttribute('viewBox')?.split(' ');
        natW = viewBox ? parseFloat(viewBox[2]) : overlay.clientWidth;
        natH = viewBox ? parseFloat(viewBox[3]) : overlay.clientHeight;

        dragonGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        dragonGroup.setAttribute('class', 'overlay-dragon');
        dragonGroup.style.pointerEvents = 'none';
        overlay.appendChild(dragonGroup);

        dragonElement = createDragon();
        dragonGroup.appendChild(dragonElement);

        if (!animationId) {
            animate();
        }
    }

    function destroy() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        if (dragonGroup && dragonGroup.parentNode) {
            dragonGroup.parentNode.removeChild(dragonGroup);
        }
        dragonGroup = null;
        dragonElement = null;
        svg = null;
    }

    if (typeof document !== 'undefined') {
        document.addEventListener('campaign-data-updated', () => {
            destroy();
            if (document.body?.dataset?.mapRealm !== 'underdark') {
                const containerId = 'map-container';
                init(containerId, 'map-image');
            }
        });
    }

    return {
        init,
        destroy
    };
})();
