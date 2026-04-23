/**
 * Marker, label, and region text rendering.
 */
const MapOverlayMarkerRenderer = (function () {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const FONT_FALLBACKS = {
        'Sell Your Soul': 'Sell Your Soul, Cormorant Garamond, serif',
        'Penumbra Sans Std': 'Penumbra Sans Std, Cormorant Garamond, serif',
        'Quintessential': 'Quintessential, Cormorant Garamond, serif',
        'Simonetta': 'Simonetta, Cormorant Garamond, serif'
    };

    function svg(tagName) {
        return document.createElementNS(SVG_NS, tagName);
    }

    function makeCircle(cx, cy, r, fill, stroke, strokeWidth) {
        const c = svg('circle');
        c.setAttribute('cx', cx);
        c.setAttribute('cy', cy);
        c.setAttribute('r', r);
        c.setAttribute('fill', fill);
        c.setAttribute('stroke', stroke);
        c.setAttribute('stroke-width', strokeWidth);
        return c;
    }

    function resolveFontStack(family) {
        if (!family) return family;
        const base = family.split(',')[0].trim();
        return FONT_FALLBACKS[base] || family;
    }

    function getLocationTypeConfig(loc) {
        const typeConfig = MapOverlayLocationTypes.getTypeConfig(loc.type);
        if (loc.type === 'region' && !loc.fontFamily) {
            const nameDesc = `${loc.name || ''} ${loc.description || ''}`.toLowerCase();
            if (nameDesc.includes('mountain')) {
                return {
                    ...typeConfig,
                    labelFontFamily: 'Penumbra Sans Std'
                };
            }
        }
        return typeConfig;
    }

    function addRegionLabel(group, region, px, py, ctx) {
        if (region.hideLabel) return;

        const text = svg('text');
        text.setAttribute('x', px);
        text.setAttribute('y', py);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('class', `region-label region-type-${region.type}`);
        text.setAttribute('font-size', region.fontSize || Math.max(ctx.natW * 0.008, 12));

        if (region.fontFamily) text.style.fontFamily = resolveFontStack(region.fontFamily);
        if (region.fontWeight) text.style.fontWeight = region.fontWeight;
        if (region.fontStyle) text.style.fontStyle = region.fontStyle;

        const lines = String(region.name || '').split(/\r?\n|\\n/);
        if (region.textCurve !== undefined) {
            const curveValue = parseFloat(region.textCurve) * 5;
            const pathId = `curve-region-${region.id || Math.random().toString(36).slice(2, 11)}`;

            const defs = svg('defs');
            const path = svg('path');
            path.setAttribute('id', pathId);
            const hRadius = ctx.natW * 0.05;
            path.setAttribute('d', `M ${px - hRadius} ${py} Q ${px} ${py + curveValue} ${px + hRadius} ${py}`);
            defs.appendChild(path);
            group.appendChild(defs);

            const textPath = svg('textPath');
            textPath.setAttribute('href', `#${pathId}`);
            textPath.setAttribute('startOffset', '50%');
            textPath.textContent = lines.join('  ');
            text.appendChild(textPath);
            text.removeAttribute('x');
            text.removeAttribute('y');
        } else if (lines.length > 1) {
            lines.forEach((line, index) => {
                const tspan = svg('tspan');
                tspan.textContent = line;
                tspan.setAttribute('x', px);
                tspan.setAttribute('dy', index === 0 ? 0 : '1.2em');
                text.appendChild(tspan);
            });
        } else {
            text.textContent = region.name;
        }

        text.style.pointerEvents = 'auto';
        text.style.cursor = 'pointer';
        text.addEventListener('mouseenter', (event) => ctx.tooltipHandlers.show(event, region, ctx));
        text.addEventListener('mousemove', (event) => ctx.tooltipHandlers.move(event, ctx));
        text.addEventListener('mouseleave', (event) => ctx.tooltipHandlers.hide(event, ctx));

        if (region.opacity !== undefined) text.setAttribute('opacity', region.opacity);

        group.appendChild(text);
    }

    function addLabel(markerGroup, loc, px, py, radius, ctx) {
        if (loc.hideLabel) return;

        const typeConfig = getLocationTypeConfig(loc);
        const defaultX = radius * 2.5;
        const defaultY = radius * 0.4;
        const offsetX = loc.labelOffsetX !== undefined ? loc.labelOffsetX : defaultX;
        const offsetY = loc.labelOffsetY !== undefined ? loc.labelOffsetY : defaultY;
        const collisionZone = radius * 1.5;
        const wouldCollide = Math.abs(offsetX) < collisionZone && Math.abs(offsetY) < collisionZone;

        const label = svg('text');
        let labelX;
        let labelY;
        if (wouldCollide) {
            labelX = px;
            labelY = py - radius * 1.4;
            label.setAttribute('text-anchor', 'middle');
        } else {
            labelX = px + offsetX;
            labelY = py + offsetY;
            label.setAttribute('text-anchor', loc.labelAlign || 'start');
        }

        label.setAttribute('x', labelX);
        label.setAttribute('y', labelY);
        if (loc.rotation) label.setAttribute('transform', `rotate(${loc.rotation}, ${labelX}, ${labelY})`);
        label.setAttribute('class', 'marker-label');
        label.setAttribute('font-size', loc.fontSize || Math.max(ctx.natW * 0.005, 9));

        const fontFamily = loc.fontFamily || typeConfig.labelFontFamily;
        const fontStyle = loc.fontStyle || typeConfig.labelFontStyle;
        if (fontFamily) label.style.fontFamily = resolveFontStack(fontFamily);
        if (loc.fontWeight) label.style.fontWeight = loc.fontWeight;
        if (fontStyle) label.style.fontStyle = fontStyle;

        if (loc.type === 'water') {
            label.setAttribute('fill', '#7EC8E3');
            label.setAttribute('filter', 'url(#water-label-shadow)');
        }
        if (loc.type === 'river') {
            label.setAttribute('fill', '#8A9EA8');
            label.setAttribute('filter', 'url(#river-label-glow)');
        }

        const lines = String(loc.name || '').split(/\r?\n|\\n/);
        if (loc.textCurve !== undefined) {
            const curveValue = parseFloat(loc.textCurve) * 5;
            const pathId = `curve-label-${loc.id || Math.random().toString(36).slice(2, 11)}`;
            const defs = svg('defs');
            const path = svg('path');
            path.setAttribute('id', pathId);
            const hRadius = ctx.natW * 0.05;
            const xPos = wouldCollide ? px : px + offsetX;
            path.setAttribute('d', `M ${xPos - hRadius} ${labelY} Q ${xPos} ${labelY + curveValue} ${xPos + hRadius} ${labelY}`);
            defs.appendChild(path);
            markerGroup.appendChild(defs);

            const textPath = svg('textPath');
            textPath.setAttribute('href', `#${pathId}`);
            textPath.setAttribute('startOffset', '50%');
            textPath.textContent = lines.join('  ');
            label.appendChild(textPath);
            label.removeAttribute('x');
            label.removeAttribute('y');
        } else if (lines.length > 1) {
            lines.forEach((line, index) => {
                const tspan = svg('tspan');
                tspan.textContent = line;
                tspan.setAttribute('x', wouldCollide ? px : px + offsetX);
                tspan.setAttribute('dy', index === 0 ? 0 : '1.2em');
                label.appendChild(tspan);
            });
        } else {
            label.textContent = loc.name;
        }

        markerGroup.appendChild(label);
    }

    function addMarker(group, loc, px, py, ctx) {
        const markerGroup = svg('g');
        markerGroup.setAttribute('class', `marker-group marker-type-${loc.type}`);
        markerGroup.setAttribute('data-location-id', loc.id || '');
        markerGroup.style.pointerEvents = 'auto';
        markerGroup.style.cursor = 'pointer';

        if (loc.opacity !== undefined) markerGroup.setAttribute('opacity', loc.opacity);

        const sizeMultiplier = loc.markerSize !== undefined ? loc.markerSize : 1.0;
        const baseRadius = ctx.natW * 0.003 * (sizeMultiplier || 1.0);
        const colors = {
            brown: '#3e2723',
            darkBrown: '#1b1612'
        };

        const typeConfig = getLocationTypeConfig(loc);
        const labelOnly = !!typeConfig.labelOnly || sizeMultiplier === 0;

        if (labelOnly) {
            addLabel(markerGroup, loc, px, py, 0, ctx);
            if (ctx.tooltipHandlers.isSuppressed(loc)) {
                markerGroup.style.pointerEvents = 'none';
            } else {
                markerGroup.addEventListener('mouseenter', (event) => ctx.tooltipHandlers.show(event, loc, ctx));
                markerGroup.addEventListener('mousemove', (event) => ctx.tooltipHandlers.move(event, ctx));
                markerGroup.addEventListener('mouseleave', (event) => ctx.tooltipHandlers.hide(event, ctx));
            }
            group.appendChild(markerGroup);
            return;
        }

        const radiusMultiplier = typeConfig.radiusMultiplier || 1.0;
        const radius = baseRadius * radiusMultiplier;
        const markerPx = px + (loc.markerOffsetX || 0);
        const markerPy = py + (loc.markerOffsetY || 0);

        (typeConfig.drawMarker || MapOverlayLocationTypes.getTypeConfig('default').drawMarker)({
            markerGroup,
            px: markerPx,
            py: markerPy,
            radius,
            colors,
            makeCircle,
            svg
        });

        addLabel(markerGroup, loc, markerPx, markerPy, radius, ctx);

        if (ctx.tooltipHandlers.isSuppressed(loc)) {
            markerGroup.style.pointerEvents = 'none';
        } else {
            markerGroup.addEventListener('mouseenter', (event) => ctx.tooltipHandlers.show(event, loc, ctx));
            markerGroup.addEventListener('mousemove', (event) => ctx.tooltipHandlers.move(event, ctx));
            markerGroup.addEventListener('mouseleave', (event) => ctx.tooltipHandlers.hide(event, ctx));
        }

        group.appendChild(markerGroup);
    }

    return {
        addRegionLabel,
        addMarker,
        addLabel,
        makeCircle,
        resolveFontStack
    };
})();
