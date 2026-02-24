/**
 * World of Myrdae - Map Overlay
 * Renders interactive SVG markers, labels, and tooltips over the world map
 */

const MapOverlay = (function () {
    let data = null;
    let tooltip = null;
    let hideTimer = null;
    let overlayVisible = true;
    let locMap = new Map(); // Shared location map
    let natW = 0;
    let natH = 0;
    let roadGroup = null;

    function getData() { return data; }

    /**
     * Initialize the overlay on a map container
     */
    async function init(containerId, imageId, dataOverride) {
        const container = document.getElementById(containerId);
        const mapImg = document.getElementById(imageId);
        if (!container || !mapImg) return;

        if (dataOverride) {
            data = dataOverride;
        } else {
            // Load location data from CampaignData
            if (typeof CampaignData !== 'undefined') {
                data = CampaignData.getData();
                if (!data || !data.locations || data.locations.length === 0) {
                    data = await CampaignData.init();
                }
            } else if (typeof window.CampaignData !== 'undefined') {
                data = window.CampaignData.getData();
                if (!data || !data.locations || data.locations.length === 0) {
                    data = await window.CampaignData.init();
                }
            } else {
                console.error('CampaignData module not found!');
                return;
            }
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
            // Safety measure to ensure we clean up immediately before drawing
            // in case multiple updates were fired while waiting for the image to load
            let existing = document.getElementById(containerId + '-overlay');
            if (existing) existing.remove();

            const strayOverlays = container.querySelectorAll('svg.map-overlay');
            strayOverlays.forEach(o => o.remove());

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

            // Add filter definitions for special label styles
            const filterDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const waterFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            waterFilter.setAttribute('id', 'water-label-shadow');
            waterFilter.setAttribute('x', '-20%');
            waterFilter.setAttribute('y', '-20%');
            waterFilter.setAttribute('width', '140%');
            waterFilter.setAttribute('height', '140%');
            const feShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
            feShadow.setAttribute('dx', '1');
            feShadow.setAttribute('dy', '1');
            feShadow.setAttribute('stdDeviation', '1.5');
            feShadow.setAttribute('flood-color', '#555555');
            feShadow.setAttribute('flood-opacity', '0.7');
            waterFilter.appendChild(feShadow);
            filterDefs.appendChild(waterFilter);

            // River glow: centered grey glow (no directional offset)
            const riverFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            riverFilter.setAttribute('id', 'river-label-glow');
            riverFilter.setAttribute('x', '-30%');
            riverFilter.setAttribute('y', '-30%');
            riverFilter.setAttribute('width', '160%');
            riverFilter.setAttribute('height', '160%');
            const riverGlow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
            riverGlow.setAttribute('dx', '0');
            riverGlow.setAttribute('dy', '0');
            riverGlow.setAttribute('stdDeviation', '3');
            riverGlow.setAttribute('flood-color', '#888888');
            riverGlow.setAttribute('flood-opacity', '0.8');
            riverFilter.appendChild(riverGlow);
            filterDefs.appendChild(riverFilter);

            svg.appendChild(filterDefs);

            // Create ID lookup map for road routing
            locMap.clear();
            if (data.locations) {
                data.locations.forEach(loc => {
                    if (loc.id) locMap.set(loc.id, loc);
                });
                console.log(`Location map built: ${locMap.size} locations`);
            } else {
                console.warn('No locations data available for road routing');
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
            if (data.roads && data.roads.length > 0) {
                roadGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                roadGroup.setAttribute('class', 'overlay-roads');
                let roadsRendered = 0;
                data.roads.forEach(road => {
                    if (road.points && road.points.length >= 2) {
                        addRoad(roadGroup, road, locMap, natW, natH);
                        roadsRendered++;
                    } else {
                        console.warn('Road skipped (needs at least 2 points):', road.id, 'points:', road.points?.length || 0);
                    }
                });
                svg.appendChild(roadGroup);
                console.log(`Rendered ${roadsRendered} of ${data.roads.length} roads`);
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
            // Remove old listeners so we don't stack setups
            mapImg.onload = setupOverlay;
        }
    }

    // Listen to data updates from outside to trigger a redraw (only bind once)
    let isListenerBound = false;
    if (typeof document !== 'undefined' && !isListenerBound) {
        document.addEventListener('campaign-data-updated', async (e) => {
            data = e.detail;
            console.log('Map overlay: Data updated. Roads:', data.roads?.length || 0, 'Locations:', data.locations?.length || 0);

            if (data.roads && data.roads.length > 0) {
                console.log('Roads to render:', data.roads.map(r => ({ id: r.id, points: r.points?.length || 0 })));
            }

            // Find all map containers and re-init overlay
            const containers = document.querySelectorAll('.map-container');
            for (const c of containers) {
                const img = c.querySelector('.map-image');
                if (img && img.id) {
                    console.log(`Re-initializing overlay for container: ${c.id}, image: ${img.id}`);
                    await init(c.id, img.id, data);
                }
            }
        });
        isListenerBound = true;
    }

    /**
     * Add a region label (italic text, no marker)
     */
    function addRegionLabel(group, region, px, py, natW) {
        // Skip label rendering if hideLabel is set
        if (region.hideLabel) return;

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

        if (region.textCurve !== undefined) {
            // Apply curved text
            const curveValue = parseFloat(region.textCurve) * 5; // scaled up to be visible
            const pathId = `curve-region-${region.id || Math.random().toString(36).substr(2, 9)}`;

            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('id', pathId);

            // Generate a tighter bezier curve centered at px, py
            const hRadius = natW * 0.05; // ~400px on an 8k map, keeping the bend contained
            path.setAttribute('d', `M ${px - hRadius} ${py} Q ${px} ${py + curveValue} ${px + hRadius} ${py}`);

            defs.appendChild(path);
            group.appendChild(defs);

            const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
            textPath.setAttribute('href', `#${pathId}`);
            textPath.setAttribute('startOffset', '50%');
            textPath.textContent = lines.join('  ');
            text.appendChild(textPath);

            text.removeAttribute('x');
            text.removeAttribute('y');
        } else if (lines.length > 1) {
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
        markerGroup.setAttribute('data-location-id', loc.id || '');
        markerGroup.style.pointerEvents = 'auto';
        markerGroup.style.cursor = 'pointer';

        if (loc.opacity !== undefined) {
            markerGroup.setAttribute('opacity', loc.opacity);
        }

        const sizeMultiplier = loc.markerSize !== undefined ? loc.markerSize : 1.0;
        const baseRadius = natW * 0.003 * (sizeMultiplier || 1.0);
        const brown = '#3e2723'; // Dark Brown
        const darkBrown = '#1b1612'; // Almost Black

        // Region/water/river type or zero markerSize: label only, no marker shape
        if (loc.type === 'region' || loc.type === 'river' || sizeMultiplier === 0) {
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
                // White ring (glow) behind
                const glow = makeCircle(px, py, r, 'none', 'rgba(255, 255, 255, 0.8)', 6);
                markerGroup.appendChild(glow);

                // White filled circle, brown outline, star in center
                const outer = makeCircle(px, py, r, brown, brown, 2.5);
                markerGroup.appendChild(outer);
                // 8-pointed star
                const star = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                const starR = r * 1.0;
                const innerR = starR * 0.4;
                let points = '';
                for (let i = 0; i < 8; i++) {
                    const outerAngle = (Math.PI / 2 * -1) + (i * 2 * Math.PI / 8);
                    const innerAngle = outerAngle + Math.PI / 8;
                    points += `${px + starR * Math.cos(outerAngle)},${py + starR * Math.sin(outerAngle)} `;
                    points += `${px + innerR * Math.cos(innerAngle)},${py + innerR * Math.sin(innerAngle)} `;
                }
                star.setAttribute('points', points.trim());
                star.setAttribute('fill', '#FFFFFF');
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
        // Skip label rendering if hideLabel is set
        if (loc.hideLabel) return;

        const defaultX = radius * 2.5;
        const defaultY = radius * 0.4;
        let offsetX = loc.labelOffsetX !== undefined ? loc.labelOffsetX : defaultX;
        let offsetY = loc.labelOffsetY !== undefined ? loc.labelOffsetY : defaultY;

        // If the label would land on/near the marker, shift it above instead
        const collisionZone = radius * 1.5;
        const wouldCollide = Math.abs(offsetX) < collisionZone && Math.abs(offsetY) < collisionZone;

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        let labelX, labelY;
        if (wouldCollide) {
            labelX = px;
            labelY = py - radius * 1.4;
            label.setAttribute('text-anchor', 'middle');
        } else {
            labelX = px + offsetX;
            labelY = py + offsetY;
        }
        label.setAttribute('x', labelX);
        label.setAttribute('y', labelY);

        if (loc.rotation) {
            label.setAttribute('transform', `rotate(${loc.rotation}, ${labelX}, ${labelY})`);
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

        // Water type: light blue text with grey shadow
        if (loc.type === 'water') {
            label.setAttribute('fill', '#7EC8E3');
            label.setAttribute('filter', 'url(#water-label-shadow)');
        }

        // River type: light blue text with centered grey glow
        if (loc.type === 'river') {
            label.setAttribute('fill', '#7EC8E3');
            label.setAttribute('filter', 'url(#river-label-glow)');
        }

        // Split on real newlines OR literal "\n" strings
        const lines = loc.name.split(/\r?\n|\\n/);
        if (loc.textCurve !== undefined) {
            const curveValue = parseFloat(loc.textCurve) * 5;
            const pathId = `curve-label-${loc.id || Math.random().toString(36).substr(2, 9)}`;

            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('id', pathId);
            const hRadius = natW * 0.05;

            const xPos = wouldCollide ? px : (px + offsetX);
            path.setAttribute('d', `M ${xPos - hRadius} ${labelY} Q ${xPos} ${labelY + curveValue} ${xPos + hRadius} ${labelY}`);

            defs.appendChild(path);
            markerGroup.appendChild(defs);

            const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
            textPath.setAttribute('href', `#${pathId}`);
            textPath.setAttribute('startOffset', '50%');
            textPath.textContent = lines.join('  ');
            label.appendChild(textPath);

            label.removeAttribute('x');
            label.removeAttribute('y');
        } else if (lines.length > 1) {
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

        // Cancel any pending hide — prevents flicker when moving between marker dot and label
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }

        const typeIcons = {
            city: '🏰', town: '🏠', village: '🏡', port: '⚓',
            ruins: '🏚️', landmark: '⭐', mountain: '⛰️', pass: '🏔️',
            forest: '🌲', region: '🗺️', river: '🌊', water: '💧'
        };

        const icon = typeIcons[loc.type] || '📍';
        const typeName = loc.type.charAt(0).toUpperCase() + loc.type.slice(1);

        tooltip.innerHTML = `
            <div class="tooltip-header" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem;">
                <span class="tooltip-icon" style="font-size: 1.1rem;">${icon}</span>
                <span class="tooltip-name" style="font-family: 'Cinzel', serif; font-size: 1rem; font-weight: 700; color: #ffd700; text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);">${loc.name}</span>
            </div>
            <div class="tooltip-type" style="font-family: 'Inter', sans-serif; font-size: 0.7rem; color: #a0a0a0; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.4rem; padding-bottom: 0.4rem; border-bottom: 1px solid rgba(212,175,55,0.2);">${typeName}${loc.region ? ' • ' + loc.region : ''}</div>
            ${loc.description ? `<div class="tooltip-desc" style="font-family: 'Cormorant Garamond', serif; font-size: 0.95rem; color: #d0d0d0; line-height: 1.4;">${loc.description}</div>` : ''}
            ${loc.details ? `<div class="tooltip-details" style="font-family: 'Cormorant Garamond', serif; font-size: 0.85rem; color: #888; font-style: italic; margin-top: 0.3rem;">${loc.details}</div>` : ''}
            ${loc.link ? `<div class="tooltip-link" style="margin-top: 0.5rem; padding-top: 0.4rem; border-top: 1px solid rgba(212,175,55,0.2);"><a href="${loc.link}" target="_blank" rel="noopener noreferrer" style="font-family: 'Inter', sans-serif; font-size: 0.8rem; color: #ffd700; text-decoration: none; display: inline-flex; align-items: center; gap: 0.3rem; transition: color 0.2s;" onmouseenter="this.style.color='#fff'" onmouseleave="this.style.color='#ffd700'">Learn More <span style="font-size: 0.9em;">→</span></a></div>` : ''}
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
        // Tooltip is locked in place after initial show — don't follow the mouse.
        // This makes it much easier to move the cursor into the tooltip to click links.
    }

    function hideTooltip(e) {
        if (!tooltip) return;

        // Cancel any previous pending hide
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }

        // Generous delay to allow moving mouse between marker parts or into the tooltip
        hideTimer = setTimeout(() => {
            const currentHover = document.querySelectorAll(':hover');
            const isHoveringTooltip = Array.from(currentHover).some(el => el === tooltip || tooltip.contains(el));
            const isHoveringTrigger = Array.from(currentHover).some(el => el.closest && (el.closest('.marker-group') || el.closest('.region-label')));

            if (!isHoveringTooltip && !isHoveringTrigger) {
                // Second check after another delay — gives extra time if user is mid-move
                hideTimer = setTimeout(() => {
                    const hover2 = document.querySelectorAll(':hover');
                    const stillOnTooltip = Array.from(hover2).some(el => el === tooltip || tooltip.contains(el));
                    const stillOnTrigger = Array.from(hover2).some(el => el.closest && (el.closest('.marker-group') || el.closest('.region-label')));

                    if (!stillOnTooltip && !stillOnTrigger) {
                        tooltip.style.display = 'none';
                        tooltip.style.pointerEvents = 'none';
                    }
                    hideTimer = null;
                }, 300);
            } else {
                hideTimer = null;
            }
        }, 500);
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
        let strokeColor = '#3a271d'; // Base ink brown
        let strokeWidth = Math.max(natW * 0.0001, 1);
        let strokeOpacity = '0.9';
        let dashArray = '';
        let haloColor = 'rgba(235, 225, 205, 0.8)'; // Sharp cream outline

        switch (road.type) {
            case 'major':
                strokeColor = '#9c8c78ff'; // Light brown inner
                strokeWidth = Math.max(natW * 0.00018, 1.5);
                strokeOpacity = '0.95';
                haloColor = 'rgba(88, 68, 51, 0.9)'; // Dark brown glow
                break;
            case 'minor':
                strokeColor = '#9c8c78ff'; // Light brown inner
                strokeWidth = Math.max(natW * 0.00012, 1);
                strokeOpacity = '0.9';
                dashArray = `${natW * 0.00025}, ${natW * 0.00025}`; // Tight dots/short dashes
                haloColor = 'rgba(88, 68, 51, 0.9)'; // Dark brown glow
                break;
            case 'river':
                strokeColor = '#4682B4'; // SteelBlue
                strokeWidth = Math.max(natW * 0.0003, 2);
                strokeOpacity = '0.85';
                haloColor = 'rgba(200, 220, 240, 0.6)';
                break;
            case 'border':
                strokeColor = '#5c4a4a'; // Muted brownish red
                strokeWidth = Math.max(natW * 0.00015, 1);
                strokeOpacity = '0.7';
                dashArray = `${natW * 0.001}, ${natW * 0.0008}`;
                haloColor = 'none';
                break;
        }

        // Apply overrides from JSON
        if (road.color) strokeColor = road.color;
        if (road.width) strokeWidth = Math.max(natW * 0.0001 * road.width, 1); // Width as multiplier of base unit

        let dashLen = road.dashLength || 1.0; // Multiplier for dash only
        let gapLen = road.gapLength || dashLen; // Multiplier for gap only (defaults to dashLen if not set)

        if (road.dashed !== undefined) {
            // If true, use default dash scaled by length multipliers.
            if (road.dashed === true) {
                dashArray = `${natW * 0.00025 * dashLen}, ${natW * 0.00025 * gapLen}`;
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

        // --- Create Highlight / Drop Shadow Stroke underneath main line ---
        if (haloColor !== 'none') {
            const halo = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            halo.setAttribute('d', d);
            halo.setAttribute('fill', 'none');
            halo.setAttribute('stroke', haloColor);
            halo.setAttribute('stroke-width', strokeWidth * 2.2); // Tighter halo, looks like a sharp outline
            halo.setAttribute('stroke-linecap', 'round');
            halo.setAttribute('stroke-linejoin', 'round');

            // Shift slightly to act like a drop-shadow edge
            const offset = Math.max(natW * 0.00005, 0.5);
            halo.setAttribute('transform', `translate(${offset}, ${offset})`);

            if (dashArray) halo.setAttribute('stroke-dasharray', dashArray);
            group.appendChild(halo);
        }
        // -------------------------------------------------------------

        path.setAttribute('stroke', strokeColor);
        path.setAttribute('stroke-width', strokeWidth);
        path.setAttribute('stroke-opacity', strokeOpacity);
        if (dashArray) path.setAttribute('stroke-dasharray', dashArray);

        group.appendChild(path);

        // --- Render road name label along the path ---
        if (road.name) {
            // Need a unique ID for the textPath reference
            let labelPathId = 'road-path-' + (road.id || Math.random().toString(36).substr(2, 9));
            path.setAttribute('id', labelPathId);

            // If labelReverse is set, create a reversed copy of the path for text
            if (road.labelReverse) {
                const reversedPathId = labelPathId + '-reversed';
                const reversedPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                reversedPath.setAttribute('id', reversedPathId);
                reversedPath.setAttribute('fill', 'none');
                reversedPath.setAttribute('stroke', 'none');

                // Reverse the path: re-calculate from road points in reverse order
                const reversedRoad = { ...road, points: [...road.points].reverse() };
                const reversedD = calculatePathD(reversedRoad);
                if (reversedD) {
                    reversedPath.setAttribute('d', reversedD);
                    group.appendChild(reversedPath);
                    labelPathId = reversedPathId;
                }
            }

            // Split on real newlines OR literal "\n" strings
            const lines = road.name.split(/\r?\n|\\n/);
            const fontSize = road.fontSize || Math.max(natW * 0.004, 10);
            const startOffset = (road.labelOffset !== undefined ? road.labelOffset : 50) + '%';
            const opacity = road.labelOpacity !== undefined ? road.labelOpacity : '0.7';

            lines.forEach((line, lineIndex) => {
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('class', 'road-label');
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('font-size', fontSize);

                if (road.fontFamily) text.style.fontFamily = road.fontFamily;
                if (road.fontWeight) text.style.fontWeight = road.fontWeight;
                if (road.fontStyle) text.style.fontStyle = road.fontStyle;

                // Default road label styling (matches POI text)
                text.setAttribute('fill', '#faf3e0');
                text.setAttribute('stroke', '#3e2723');
                text.setAttribute('stroke-width', '2px');
                text.setAttribute('paint-order', 'stroke fill');
                text.setAttribute('stroke-linejoin', 'round');

                // Stack lines vertically: position above or below the path based on labelSide
                const isBottom = road.labelSide === 'bottom';
                const baseDy = isBottom ? 1.2 : -0.35; // em offset: positive = below, negative = above
                const lineDy = baseDy + (lineIndex * 1.2); // 1.2em per line
                text.setAttribute('dy', lineDy + 'em');

                text.setAttribute('opacity', opacity);

                const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
                textPath.setAttribute('href', '#' + labelPathId);
                textPath.setAttribute('startOffset', startOffset);
                textPath.textContent = line;

                text.appendChild(textPath);
                group.appendChild(text);
            });
        }
    }

    /**
     * Toggle overlay visibility
     */
    function toggle(containerId) {
        const svg = document.getElementById(containerId + '-overlay');
        if (!svg) return overlayVisible;
        overlayVisible = !overlayVisible;
        svg.style.display = overlayVisible ? '' : 'none';
        return overlayVisible;
    }

    /**
     * Calculate path string for a road (internal helper)
     */
    function calculatePathD(road) {
        if (!road.points || road.points.length < 2) {
            console.warn('Road has insufficient points:', road.id, 'points:', road.points?.length || 0);
            return '';
        }

        // Resolve points
        const points = [];
        road.points.forEach((pt, idx) => {
            if (typeof pt === 'string') {
                const loc = locMap.get(pt);
                if (loc) {
                    const px = (loc.x / 100) * natW + (loc.markerOffsetX || 0);
                    const py = (loc.y / 100) * natH + (loc.markerOffsetY || 0);
                    points.push({ x: px, y: py });
                } else {
                    console.warn(`Road ${road.id}: Location ID "${pt}" not found in locMap (point ${idx})`);
                }
            } else if (Array.isArray(pt) && pt.length === 2) {
                points.push({ x: (pt[0] / 100) * natW, y: (pt[1] / 100) * natH });
            }
        });

        if (points.length < 2) {
            console.warn(`Road ${road.id}: Could not resolve enough points (got ${points.length}, need 2)`);
            return '';
        }

        let d = '';
        if (road.curved) {
            // Smooth Midpoint Quadratic Bezier curves for gradual sweeps
            d = `M ${points[0].x} ${points[0].y}`;
            if (points.length === 2) {
                d += ` L ${points[1].x} ${points[1].y}`;
            } else if (points.length === 3) {
                d += ` Q ${points[1].x} ${points[1].y}, ${points[2].x} ${points[2].y}`;
            } else {
                for (let i = 1; i < points.length - 2; i++) {
                    const xc = (points[i].x + points[i + 1].x) / 2;
                    const yc = (points[i].y + points[i + 1].y) / 2;
                    d += ` Q ${points[i].x} ${points[i].y}, ${xc} ${yc}`;
                }
                const lastControl = points[points.length - 2];
                const lastPoint = points[points.length - 1];
                d += ` Q ${lastControl.x} ${lastControl.y}, ${lastPoint.x} ${lastPoint.y}`;
            }
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
