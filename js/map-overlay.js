/**
 * World of Myrdae - Map Overlay
 * Renders interactive SVG markers, labels, and tooltips over the world map
 */

const MapOverlay = (function () {
    let data = null;
    let tooltip = null;
    let overlayVisible = true;
    let locMap = new Map(); // Shared location map
    let natW = 0;
    let natH = 0;
    let roadGroup = null;

    function getData() { return data; }

    /**
     * Initialize the overlay on a map container
     */
    async function init(containerId, imageId) {
        const container = document.getElementById(containerId);
        const mapImg = document.getElementById(imageId);
        if (!container || !mapImg) return;

        // Clear existing overlay for this container if any
        const existing = document.getElementById(containerId + '-overlay');
        if (existing) existing.remove();

        // Load location data from CampaignData
        if (typeof CampaignData !== 'undefined') {
            data = CampaignData.getData();
            if (!data || !data.locations) {
                // If CampaignData isn't ready yet, wait for it or init it
                data = await CampaignData.init();
            }
        } else {
            console.error('CampaignData module not found!');
            return;
        }

        // Create tooltip element (shared, attached to body)
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'map-tooltip';
            tooltip.style.display = 'none';
            document.body.appendChild(tooltip);

            // Allow the user to move the mouse into the tooltip without it closing
            tooltip.addEventListener('mouseenter', () => {
                tooltip.style.display = 'block';
                tooltip.style.pointerEvents = 'auto';
            });
            tooltip.addEventListener('mouseleave', (e) => {
                hideTooltip(e);
            });
        }

        // Wait for image to load to get natural dimensions
        const setupOverlay = () => {
            natW = mapImg.naturalWidth;
            natH = mapImg.naturalHeight;
            if (!natW || !natH) return;

            // Create SVG overlay
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'map-overlay');
            svg.setAttribute('id', containerId + '-overlay');
            svg.setAttribute('viewBox', `0 0 ${natW} ${natH}`);
            svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
            svg.style.width = '100%';
            svg.style.height = 'auto';
            svg.style.position = 'absolute';
            svg.style.top = '0';
            svg.style.left = '0';
            svg.style.pointerEvents = 'none';
            svg.style.willChange = 'transform';

            // Create ID lookup map for road routing
            locMap.clear();
            if (data.locations) {
                data.locations.forEach(loc => {
                    if (loc.id) locMap.set(loc.id, loc);
                });
            }

            // Render region labels
            if (data.regions) {
                const regionGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                regionGroup.setAttribute('class', 'overlay-regions');
                data.regions.forEach(r => {
                    const px = (r.x / 100) * natW;
                    const py = (r.y / 100) * natH;
                    addRegionLabel(regionGroup, r, px, py, natW);
                });
                svg.appendChild(regionGroup);
            }

            // Render roads/paths (draw these before locations so they are underneath)
            if (data.roads) {
                roadGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                roadGroup.setAttribute('class', 'overlay-roads');
                data.roads.forEach(road => {
                    addRoad(roadGroup, road, locMap, natW, natH);
                });
                svg.appendChild(roadGroup);
            }

            // Render location markers
            if (data.locations) {
                const locGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                locGroup.setAttribute('class', 'overlay-locations');
                data.locations.forEach(loc => {
                    const px = (loc.x / 100) * natW;
                    const py = (loc.y / 100) * natH;
                    addMarker(locGroup, loc, px, py, natW);
                });
                svg.appendChild(locGroup);
            }

            // Insert SVG right after the image
            mapImg.parentNode.insertBefore(svg, mapImg.nextSibling);

            // Sync overlay transform with the map image (for restored zoom state)
            if (mapImg.style.transform) {
                svg.style.transform = mapImg.style.transform;
                svg.style.transformOrigin = mapImg.style.transformOrigin;
            }
        };

        if (mapImg.complete && mapImg.naturalWidth) {
            setupOverlay();
        } else {
            mapImg.addEventListener('load', setupOverlay);
        }
    }

    /**
     * Add a region label (italic text, no marker)
     */
    function addRegionLabel(group, region, px, py, natW) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', px);
        text.setAttribute('y', py);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('class', 'region-label region-type-' + region.type);
        text.setAttribute('font-size', region.fontSize || Math.max(natW * 0.008, 12));

        if (region.fontFamily) {
            text.style.fontFamily = region.fontFamily;
        }
        if (region.fontWeight) {
            text.style.fontWeight = region.fontWeight;
        }
        if (region.fontStyle) {
            text.style.fontStyle = region.fontStyle;
        }

        // Split on real newlines OR literal "\n" strings
        const lines = region.name.split(/\r?\n|\\n/);
        if (lines.length > 1) {
            // Multi-line support
            lines.forEach((line, index) => {
                const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                tspan.textContent = line;
                tspan.setAttribute('x', px);
                // First line stays at y, others shift down
                tspan.setAttribute('dy', index === 0 ? 0 : '1.2em');
                text.appendChild(tspan);
            });
        } else {
            text.textContent = region.name;
        }

        // Make region labels interactive too
        text.style.pointerEvents = 'auto';
        text.style.cursor = 'pointer';

        text.addEventListener('mouseenter', (e) => showTooltip(e, region));
        text.addEventListener('mousemove', (e) => moveTooltip(e));
        text.addEventListener('mouseleave', (e) => hideTooltip(e));

        if (region.opacity !== undefined) {
            text.setAttribute('opacity', region.opacity);
        }

        group.appendChild(text);
    }

    /**
     * Add a location marker with label
     */
    function addMarker(group, loc, px, py, natW) {
        const markerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        markerGroup.setAttribute('class', 'marker-group marker-type-' + loc.type);
        markerGroup.style.pointerEvents = 'auto';
        markerGroup.style.cursor = 'pointer';

        if (loc.opacity !== undefined) {
            markerGroup.setAttribute('opacity', loc.opacity);
        }

        const sizeMultiplier = loc.markerSize !== undefined ? loc.markerSize : 1.0;
        const baseRadius = natW * 0.003 * (sizeMultiplier || 1.0);
        const brown = '#3e2723'; // Dark Brown
        const darkBrown = '#1b1612'; // Almost Black

        // Region type or zero markerSize: label only, no marker shape
        if (loc.type === 'region' || sizeMultiplier === 0) {
            addLabel(markerGroup, loc, px, py, baseRadius, natW);
            markerGroup.addEventListener('mouseenter', (e) => showTooltip(e, loc));
            markerGroup.addEventListener('mousemove', (e) => moveTooltip(e));
            markerGroup.addEventListener('mouseleave', hideTooltip);
            group.appendChild(markerGroup);
            return;
        }

        // Compute per-type radius
        let r;
        switch (loc.type) {
            case 'capital': r = baseRadius * 2.2; break;
            case 'city': r = baseRadius * 1.8; break;
            case 'town': r = baseRadius * 0.9; break;
            case 'village': r = baseRadius * 0.6; break;
            case 'port': r = baseRadius * 1.4; break;
            case 'ruins': r = baseRadius * 1.2; break;
            case 'landmark': r = baseRadius * 1.3; break;
            case 'pass': r = baseRadius * 1.0; break;
            default: r = baseRadius;
        }
        // Apply user-specified marker offset (default 0 = centered on coordinate)
        px += (loc.markerOffsetX || 0);
        py += (loc.markerOffsetY || 0);

        switch (loc.type) {
            case 'capital': {
                // White filled circle, brown outline, star in center
                const outer = makeCircle(px, py, r, '#FFFFFF', brown, 2.5);
                markerGroup.appendChild(outer);
                // 5-pointed star
                const star = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                const starR = r * 0.55;
                const innerR = starR * 0.4;
                let points = '';
                for (let i = 0; i < 5; i++) {
                    const outerAngle = (Math.PI / 2 * -1) + (i * 2 * Math.PI / 5);
                    const innerAngle = outerAngle + Math.PI / 5;
                    points += `${px + starR * Math.cos(outerAngle)},${py + starR * Math.sin(outerAngle)} `;
                    points += `${px + innerR * Math.cos(innerAngle)},${py + innerR * Math.sin(innerAngle)} `;
                }
                star.setAttribute('points', points.trim());
                star.setAttribute('fill', brown);
                star.setAttribute('stroke', darkBrown);
                star.setAttribute('stroke-width', '0.5');
                markerGroup.appendChild(star);
                addLabel(markerGroup, loc, px, py, r, natW);
                break;
            }
            case 'city': {
                // White ring (glow) behind
                const glow = makeCircle(px, py, r, 'none', 'rgba(255, 255, 255, 0.6)', 5);
                markerGroup.appendChild(glow);

                // Original city marker: White filled circle, brown outline...
                const outer = makeCircle(px, py, r, '#FFFFFF', brown, 2);
                markerGroup.appendChild(outer);

                // ...brown dot in center
                const dot = makeCircle(px, py, r * 0.35, brown, darkBrown, 0.5);
                markerGroup.appendChild(dot);

                addLabel(markerGroup, loc, px, py, r, natW);
                break;
            }
            case 'town': {
                // Smaller brown filled circle with 60% white ring
                const dot = makeCircle(px, py, r, brown, 'rgba(255, 255, 255, 0.6)', 1.5);
                markerGroup.appendChild(dot);
                addLabel(markerGroup, loc, px, py, r, natW);
                break;
            }
            case 'village': {
                // Even smaller brown circle
                const dot = makeCircle(px, py, r, '#A0522D', darkBrown, 0.8);
                markerGroup.appendChild(dot);
                addLabel(markerGroup, loc, px, py, r, natW);
                break;
            }
            case 'port': {
                // Blue-white circle with brown outline
                const outer = makeCircle(px, py, r, '#E8F4FD', brown, 1.5);
                markerGroup.appendChild(outer);
                // Anchor-like dot
                const dot = makeCircle(px, py, r * 0.35, '#4682B4', '#2C5F8A', 0.5);
                markerGroup.appendChild(dot);
                addLabel(markerGroup, loc, px, py, r, natW);
                break;
            }
            case 'ruins': {
                // Hollow circle with dashed stroke
                const ring = makeCircle(px, py, r, 'none', '#888', 1.5);
                ring.setAttribute('stroke-dasharray', `${r * 0.8} ${r * 0.5}`);
                markerGroup.appendChild(ring);
                addLabel(markerGroup, loc, px, py, r, natW);
                break;
            }
            case 'landmark': {
                // Diamond shape
                const diamond = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                const pts = `${px},${py - r} ${px + r * 0.7},${py} ${px},${py + r} ${px - r * 0.7},${py}`;
                diamond.setAttribute('points', pts);
                diamond.setAttribute('fill', '#FF8C00');
                diamond.setAttribute('stroke', brown);
                diamond.setAttribute('stroke-width', '1.5');
                markerGroup.appendChild(diamond);
                addLabel(markerGroup, loc, px, py, r, natW);
                break;
            }
            case 'pass': {
                // Small triangle
                const tri = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                const pts = `${px},${py - r} ${px + r * 0.87},${py + r * 0.5} ${px - r * 0.87},${py + r * 0.5}`;
                tri.setAttribute('points', pts);
                tri.setAttribute('fill', '#AAA');
                tri.setAttribute('stroke', '#666');
                tri.setAttribute('stroke-width', '1');
                markerGroup.appendChild(tri);
                addLabel(markerGroup, loc, px, py, r, natW);
                break;
            }
            case 'poi': {
                // Square shape (same colors as town)
                const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                const side = r * 1.8; // Adjust size to match visual weight
                square.setAttribute('x', px - side / 2);
                square.setAttribute('y', py - side / 2);
                square.setAttribute('width', side);
                square.setAttribute('height', side);
                square.setAttribute('fill', brown);
                square.setAttribute('stroke', 'rgba(255, 255, 255, 0.6)');
                square.setAttribute('stroke-width', '1.5');
                markerGroup.appendChild(square);
                addLabel(markerGroup, loc, px, py, r, natW);
                break;
            }
            default: {
                // Fallback: simple dot
                const dot = makeCircle(px, py, r, '#d4af37', 'rgba(0,0,0,0.6)', 1.5);
                markerGroup.appendChild(dot);
                addLabel(markerGroup, loc, px, py, r, natW);
            }
        }

        // Hover events
        markerGroup.addEventListener('mouseenter', (e) => showTooltip(e, loc));
        markerGroup.addEventListener('mousemove', (e) => moveTooltip(e));
        markerGroup.addEventListener('mouseleave', (e) => hideTooltip(e));

        group.appendChild(markerGroup);
    }

    /** Helper: create an SVG circle */
    function makeCircle(cx, cy, r, fill, stroke, strokeWidth) {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('cx', cx);
        c.setAttribute('cy', cy);
        c.setAttribute('r', r);
        c.setAttribute('fill', fill);
        c.setAttribute('stroke', stroke);
        c.setAttribute('stroke-width', strokeWidth);
        return c;
    }

    /** Helper: add a text label next to a marker */
    function addLabel(markerGroup, loc, px, py, radius, natW) {
        const defaultX = radius * 2.5;
        const defaultY = radius * 0.4;
        let offsetX = loc.labelOffsetX !== undefined ? loc.labelOffsetX : defaultX;
        let offsetY = loc.labelOffsetY !== undefined ? loc.labelOffsetY : defaultY;

        // If the label would land on/near the marker, shift it above instead
        const collisionZone = radius * 1.5;
        const wouldCollide = Math.abs(offsetX) < collisionZone && Math.abs(offsetY) < collisionZone;

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        if (wouldCollide) {
            label.setAttribute('x', px);
            label.setAttribute('y', py - radius * 1.4);
            label.setAttribute('text-anchor', 'middle');
        } else {
            label.setAttribute('x', px + offsetX);
            label.setAttribute('y', py + offsetY);
        }
        label.setAttribute('class', 'marker-label');
        label.setAttribute('font-size', loc.fontSize || Math.max(natW * 0.005, 9));

        if (loc.fontFamily) {
            label.style.fontFamily = loc.fontFamily;
        }
        if (loc.fontWeight) {
            label.style.fontWeight = loc.fontWeight;
        }
        if (loc.fontStyle) {
            label.style.fontStyle = loc.fontStyle;
        }

        // Split on real newlines OR literal "\n" strings
        const lines = loc.name.split(/\r?\n|\\n/);
        if (lines.length > 1) {
            lines.forEach((line, index) => {
                const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                tspan.textContent = line;
                // If we calculated an X, apply it to each tspan
                // If it was centered (wouldCollide case), x is px
                // If offset, x is px + offsetX
                const xPos = wouldCollide ? px : (px + offsetX);
                tspan.setAttribute('x', xPos);

                // Align dy. First line at 0, others shifted down
                tspan.setAttribute('dy', index === 0 ? 0 : '1.2em');
                label.appendChild(tspan);
            });
        } else {
            label.textContent = loc.name;
        }
        markerGroup.appendChild(label);
    }

    /**
     * Show tooltip with location details
     */
    function showTooltip(e, loc) {
        if (!tooltip) return;

        const typeIcons = {
            city: '🏰', town: '🏠', village: '🏡', port: '⚓',
            ruins: '🏚️', landmark: '⭐', mountain: '⛰️', pass: '🏔️',
            forest: '🌲', region: '🗺️'
        };

        const icon = typeIcons[loc.type] || '📍';
        const typeName = loc.type.charAt(0).toUpperCase() + loc.type.slice(1);

        tooltip.innerHTML = `
            <div class="tooltip-header" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem;">
                <span class="tooltip-icon" style="font-size: 1.1rem;">${icon}</span>
                <span class="tooltip-name" style="font-family: 'Cinzel', serif; font-size: 1rem; font-weight: 700; color: #ffd700; text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);">${loc.name}</span>
                <button onclick="LocationEditor.open('${loc.id}')" style="margin-left: auto; background: rgba(212,175,55,0.15); border: 1px solid var(--color-gold); color: var(--color-gold); cursor: pointer; font-size: 0.75rem; padding: 3px 8px; border-radius: 4px; display: flex; align-items: center; gap: 4px; transition: all 0.2s;" onmouseover="this.style.background='var(--color-gold)'; this.style.color='#000';" onmouseout="this.style.background='rgba(212,175,55,0.15)'; this.style.color='var(--color-gold)';">
                    <i class="fa-solid fa-pen-to-square"></i> Edit
                </button>
            </div>
            <div class="tooltip-type" style="font-family: 'Inter', sans-serif; font-size: 0.7rem; color: #a0a0a0; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.4rem; padding-bottom: 0.4rem; border-bottom: 1px solid rgba(212,175,55,0.2);">${typeName}${loc.region ? ' • ' + loc.region : ''}</div>
            ${loc.description ? `<div class="tooltip-desc" style="font-family: 'Cormorant Garamond', serif; font-size: 0.95rem; color: #d0d0d0; line-height: 1.4;">${loc.description}</div>` : ''}
            ${loc.details ? `<div class="tooltip-details" style="font-family: 'Cormorant Garamond', serif; font-size: 0.85rem; color: #888; font-style: italic; margin-top: 0.3rem;">${loc.details}</div>` : ''}
        `;

        tooltip.style.display = 'block';
        tooltip.style.pointerEvents = 'auto';

        // Initial positioning
        positionTooltip(e);
    }

    function positionTooltip(e) {
        if (!tooltip) return;

        const padding = 15;
        let x = e.clientX + padding;
        let y = e.clientY + padding;

        const rect = tooltip.getBoundingClientRect();

        // Flip if hitting right edge
        if (x + rect.width > window.innerWidth) {
            x = e.clientX - rect.width - padding;
        }

        // Flip if hitting bottom edge
        if (y + rect.height > window.innerHeight) {
            y = e.clientY - rect.height - padding;
        }

        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    }

    function moveTooltip(e) {
        // Only follow mouse if we haven't "locked" onto the tooltip (optional enhancement)
        // For now, let's keep it static once visible to make it easier to click
        // but if they are still on the marker, we can update position.
        if (e.target.closest('.marker-group') || e.target.closest('.region-label')) {
            positionTooltip(e);
        }
    }

    function hideTooltip(e) {
        if (!tooltip) return;

        // Small delay to allow moving mouse into the tooltip
        setTimeout(() => {
            const currentHover = document.querySelectorAll(':hover');
            const isHoveringTooltip = Array.from(currentHover).some(el => el === tooltip || tooltip.contains(el));
            const isHoveringTrigger = Array.from(currentHover).some(el => el.closest && (el.closest('.marker-group') || el.closest('.region-label')));

            if (!isHoveringTooltip && !isHoveringTrigger) {
                tooltip.style.display = 'none';
                tooltip.style.pointerEvents = 'none';
            }
        }, 150);
    }

    /**
     * Add a road/path to the map
     */
    function addRoad(group, road, ignoredLocMap, ignoredNatW, ignoredNatH) {
        // Calculate path using the helper (uses module-scoped locMap, natW, natH)
        const d = calculatePathD(road);
        if (!d) return;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        if (road.id) path.setAttribute('id', 'road-path-' + road.id);

        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');

        // Style based on type
        let strokeColor = '#F4A460';
        let strokeWidth = Math.max(natW * 0.0008, 0.8); // Reduced from 0.0015/1.5
        let strokeOpacity = '0.7';
        let dashArray = '';

        switch (road.type) {
            case 'major':
                strokeColor = '#d4af37'; // Gold
                strokeWidth = Math.max(natW * 0.002, 2);
                strokeOpacity = '0.8';
                break;
            case 'minor':
                strokeColor = '#8B4513'; // SaddleBrown
                strokeWidth = Math.max(natW * 0.001, 1);
                strokeOpacity = '0.6';
                dashArray = `${natW * 0.005}, ${natW * 0.002}`;
                break;
            case 'river':
                strokeColor = '#4682B4'; // SteelBlue
                strokeWidth = Math.max(natW * 0.0025, 2.5);
                break;
            case 'border':
                strokeColor = '#800000'; // Maroon
                strokeWidth = Math.max(natW * 0.0015, 1.5);
                strokeOpacity = '0.5';
                dashArray = `${natW * 0.01}, ${natW * 0.005}`;
                break;
        }

        // Apply overrides from JSON
        if (road.color) strokeColor = road.color;
        if (road.width) strokeWidth = Math.max(natW * 0.001 * road.width, 1); // Width as multiplier of base unit

        let dashLen = road.dashLength || 1.0; // Multiplier for dash only
        let gapLen = road.gapLength || dashLen; // Multiplier for gap only (defaults to dashLen if not set)

        if (road.dashed !== undefined) {
            // If true, use default dash scaled by length multipliers.
            if (road.dashed === true) {
                dashArray = `${natW * 0.005 * dashLen}, ${natW * 0.003 * gapLen}`;
            } else if (typeof road.dashed === 'string') {
                dashArray = road.dashed;
            } else if (road.dashed === false) {
                dashArray = '';
            }
        } else if (dashArray && (road.dashLength || road.gapLength)) {
            // If type has default dash (like border/minor) and length props are set
            // Split dasharray into [dash, gap, dash, gap...]
            const parts = dashArray.split(',').map(s => parseFloat(s.trim()));
            // Apply multipliers: even indices are dashes, odd are gaps
            dashArray = parts.map((val, i) => {
                return val * (i % 2 === 0 ? dashLen : gapLen);
            }).join(',');
        }

        path.setAttribute('stroke', strokeColor);
        path.setAttribute('stroke-width', strokeWidth);
        path.setAttribute('stroke-opacity', strokeOpacity);
        if (dashArray) path.setAttribute('stroke-dasharray', dashArray);

        group.appendChild(path);
    }

    /**
     * Toggle overlay visibility
     */
    function toggle(containerId) {
        const svg = document.getElementById(containerId + '-overlay');
        if (!svg) return;
        overlayVisible = !overlayVisible;
        svg.style.display = overlayVisible ? '' : 'none';
        return overlayVisible;
    }

    /**
     * Calculate path string for a road (internal helper)
     */
    function calculatePathD(road) {
        if (!road.points || road.points.length < 2) return '';

        // Resolve points
        const points = [];
        road.points.forEach(pt => {
            if (typeof pt === 'string') {
                const loc = locMap.get(pt);
                if (loc) points.push({ x: (loc.x / 100) * natW, y: (loc.y / 100) * natH });
            } else if (Array.isArray(pt) && pt.length === 2) {
                points.push({ x: (pt[0] / 100) * natW, y: (pt[1] / 100) * natH });
            }
        });

        if (points.length < 2) return '';

        let d = '';
        if (road.curved) {
            // Catmull-Rom spline interpolation
            d = `M ${points[0].x} ${points[0].y}`;
            for (let i = 0; i < points.length - 1; i++) {
                const p0 = points[i === 0 ? 0 : i - 1];
                const p1 = points[i];
                const p2 = points[i + 1];
                const p3 = points[i + 2] || p2;

                const tension = 1 / 6;
                const cp1x = p1.x + (p2.x - p0.x) * tension;
                const cp1y = p1.y + (p2.y - p0.y) * tension;
                const cp2x = p2.x - (p3.x - p1.x) * tension;
                const cp2y = p2.y - (p3.y - p1.y) * tension;

                d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
            }
            // Ensure the last point is connected
            const last = points[points.length - 1];
            d += ` L ${last.x} ${last.y}`;
        } else {
            // Straight lines
            d = `M ${points[0].x} ${points[0].y}`;
            for (let i = 1; i < points.length; i++) {
                d += ` L ${points[i].x} ${points[i].y}`;
            }
        }
        return d;
    }

    /**
     * Refresh a specific road's path string after data updates
     */
    function refreshRoad(roadId) {
        const road = data.roads.find(r => r.id === roadId);
        if (!road) return;
        const path = document.getElementById('road-path-' + roadId);
        if (!path) return;
        const d = calculatePathD(road);
        if (d) path.setAttribute('d', d);
    }

    /**
     * Add a new road dynamically
     */
    function addRoadToMap(road) {
        if (!data) return;
        if (!data.roads) data.roads = [];
        data.roads.push(road);
        if (roadGroup) {
            addRoad(roadGroup, road, locMap, natW, natH);
        }
    }

    return {
        init: init,
        toggle: toggle,
        getData: getData,
        refreshRoad: refreshRoad,
        addRoadToMap: addRoadToMap
    };
})();
