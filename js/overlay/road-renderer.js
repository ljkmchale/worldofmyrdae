/**
 * Road and route path rendering.
 */
const MapOverlayRoadRenderer = (function () {
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

    function resolveFontStack(family) {
        if (!family) return family;
        const base = family.split(',')[0].trim();
        return FONT_FALLBACKS[base] || family;
    }

    function calculatePathD(road, ctx) {
        const roadPoints = MapOverlayRouteGraph.getRoadPointSource(road);
        if (roadPoints.length < 2) {
            console.warn('Road has insufficient points:', road.id, 'points:', roadPoints.length);
            return '';
        }

        const points = [];
        roadPoints.forEach((pt, idx) => {
            if (typeof pt === 'string') {
                const loc = ctx.locMap.get(pt);
                if (loc) {
                    points.push({
                        x: (loc.x / 100) * ctx.natW + (loc.markerOffsetX || 0),
                        y: (loc.y / 100) * ctx.natH + (loc.markerOffsetY || 0)
                    });
                } else {
                    console.warn(`Road ${road.id}: Location ID "${pt}" not found in locMap (point ${idx})`);
                }
            } else if (Array.isArray(pt) && pt.length === 2) {
                points.push({ x: (pt[0] / 100) * ctx.natW, y: (pt[1] / 100) * ctx.natH });
            } else if (pt && typeof pt.x === 'number' && typeof pt.y === 'number') {
                points.push({ x: (pt.x / 100) * ctx.natW, y: (pt.y / 100) * ctx.natH });
            }
        });

        if (points.length < 2) {
            console.warn(`Road ${road.id}: Could not resolve enough points (got ${points.length}, need 2)`);
            return '';
        }

        let d = '';
        if (road.curved) {
            d = `M ${points[0].x} ${points[0].y}`;
            if (points.length === 2) {
                d += ` L ${points[1].x} ${points[1].y}`;
            } else if (points.length === 3) {
                d += ` Q ${points[1].x} ${points[1].y}, ${points[2].x} ${points[2].y}`;
            } else {
                for (let i = 1; i < points.length - 2; i += 1) {
                    const xc = (points[i].x + points[i + 1].x) / 2;
                    const yc = (points[i].y + points[i + 1].y) / 2;
                    d += ` Q ${points[i].x} ${points[i].y}, ${xc} ${yc}`;
                }
                const lastControl = points[points.length - 2];
                const lastPoint = points[points.length - 1];
                d += ` Q ${lastControl.x} ${lastControl.y}, ${lastPoint.x} ${lastPoint.y}`;
            }
        } else {
            d = `M ${points[0].x} ${points[0].y}`;
            for (let i = 1; i < points.length; i += 1) {
                d += ` L ${points[i].x} ${points[i].y}`;
            }
        }
        return d;
    }

    function addRoad(group, road, ctx) {
        if (road.type === 'water-route' && !ctx.isEditorMode() && !window.waterRoutesVisible) return;

        const d = calculatePathD(road, ctx);
        if (!d) return;

        const path = svg('path');
        path.setAttribute('d', d);
        if (road.id) path.setAttribute('id', `road-path-${road.id}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');

        let strokeColor = '#3a271d';
        let strokeWidth = Math.max(ctx.natW * 0.0001, 1);
        let strokeOpacity = '0.9';
        let dashArray = '';
        let haloColor = 'rgba(235, 225, 205, 0.8)';

        switch (road.type) {
            case 'major':
                strokeColor = '#9c8c78ff';
                strokeWidth = Math.max(ctx.natW * 0.00018, 1.5);
                strokeOpacity = '0.95';
                haloColor = 'rgba(88, 68, 51, 0.9)';
                break;
            case 'minor':
                strokeColor = '#9c8c78ff';
                strokeWidth = Math.max(ctx.natW * 0.00012, 1);
                strokeOpacity = '0.9';
                dashArray = `${ctx.natW * 0.00025}, ${ctx.natW * 0.00025}`;
                haloColor = 'rgba(88, 68, 51, 0.9)';
                break;
            case 'river':
                strokeColor = '#4682B4';
                strokeWidth = Math.max(ctx.natW * 0.0003, 2);
                strokeOpacity = '0.85';
                haloColor = 'rgba(200, 220, 240, 0.6)';
                break;
            case 'water-route':
                strokeColor = '#3b8fd6';
                strokeWidth = Math.max(ctx.natW * 0.00012, 1);
                strokeOpacity = '0.82';
                dashArray = `${ctx.natW * 0.00028}, ${ctx.natW * 0.00024}`;
                haloColor = 'rgba(33, 73, 115, 0.85)';
                break;
            case 'border':
                strokeColor = '#5c4a4a';
                strokeWidth = Math.max(ctx.natW * 0.00015, 1);
                strokeOpacity = '0.7';
                dashArray = `${ctx.natW * 0.001}, ${ctx.natW * 0.0008}`;
                haloColor = 'none';
                break;
        }

        if (road.color) strokeColor = road.color;
        if (road.width) strokeWidth = Math.max(ctx.natW * 0.0001 * road.width, 1);

        const dashLen = road.dashLength || 1.0;
        const gapLen = road.gapLength || dashLen;
        if (road.dashed !== undefined) {
            if (road.dashed === true) {
                dashArray = `${ctx.natW * 0.00025 * dashLen}, ${ctx.natW * 0.00025 * gapLen}`;
            } else if (typeof road.dashed === 'string') {
                dashArray = road.dashed;
            } else if (road.dashed === false) {
                dashArray = '';
            }
        } else if (dashArray && (road.dashLength || road.gapLength)) {
            dashArray = dashArray
                .split(',')
                .map((s) => parseFloat(s.trim()))
                .map((value, index) => value * (index % 2 === 0 ? dashLen : gapLen))
                .join(',');
        }

        if (haloColor !== 'none') {
            const halo = svg('path');
            halo.setAttribute('d', d);
            halo.setAttribute('fill', 'none');
            halo.setAttribute('stroke', haloColor);
            halo.setAttribute('stroke-width', strokeWidth * 2.2);
            halo.setAttribute('stroke-linecap', 'round');
            halo.setAttribute('stroke-linejoin', 'round');
            const offset = Math.max(ctx.natW * 0.00005, 0.5);
            halo.setAttribute('transform', `translate(${offset}, ${offset})`);
            if (dashArray) halo.setAttribute('stroke-dasharray', dashArray);
            group.appendChild(halo);
        }

        path.setAttribute('stroke', strokeColor);
        path.setAttribute('stroke-width', strokeWidth);
        path.setAttribute('stroke-opacity', strokeOpacity);
        if (dashArray) path.setAttribute('stroke-dasharray', dashArray);
        group.appendChild(path);

        if (road.name) {
            let labelPathId = `road-path-${road.id || Math.random().toString(36).slice(2, 11)}`;
            path.setAttribute('id', labelPathId);

            if (road.labelReverse) {
                const reversedPathId = `${labelPathId}-reversed`;
                const reversedPath = svg('path');
                reversedPath.setAttribute('id', reversedPathId);
                reversedPath.setAttribute('fill', 'none');
                reversedPath.setAttribute('stroke', 'none');

                const reversedRoad = { ...road, points: [...MapOverlayRouteGraph.getRoadPointSource(road)].reverse() };
                const reversedD = calculatePathD(reversedRoad, ctx);
                if (reversedD) {
                    reversedPath.setAttribute('d', reversedD);
                    group.appendChild(reversedPath);
                    labelPathId = reversedPathId;
                }
            }

            const lines = road.name.split(/\r?\n|\\n/);
            const fontSize = road.fontSize || Math.max(ctx.natW * 0.004, 10);
            const startOffset = `${road.labelOffset !== undefined ? road.labelOffset : 50}%`;
            const opacity = road.labelOpacity !== undefined ? road.labelOpacity : '0.7';

            lines.forEach((line, lineIndex) => {
                const text = svg('text');
                text.setAttribute('class', 'road-label');
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('font-size', fontSize);
                text.style.fontFamily = resolveFontStack(road.fontFamily || 'Simonetta');
                text.style.fontStyle = road.fontStyle || 'italic';
                if (road.fontWeight) text.style.fontWeight = road.fontWeight;
                text.setAttribute('fill', '#faf3e0');
                text.setAttribute('stroke', '#3e2723');
                text.setAttribute('stroke-width', '2px');
                text.setAttribute('paint-order', 'stroke fill');
                text.setAttribute('stroke-linejoin', 'round');
                const isBottom = road.labelSide === 'bottom';
                const baseDy = isBottom ? 1.2 : -0.35;
                text.setAttribute('dy', `${baseDy + (lineIndex * 1.2)}em`);
                text.setAttribute('opacity', opacity);

                const textPath = svg('textPath');
                textPath.setAttribute('href', `#${labelPathId}`);
                textPath.setAttribute('startOffset', startOffset);
                textPath.textContent = line;
                text.appendChild(textPath);
                group.appendChild(text);
            });
        }
    }

    function removeWaterRoutePaths(data) {
        if (!data || !Array.isArray(data.roads)) return;
        data.roads.forEach((road) => {
            if (road.type === 'water-route' && road.id) {
                const existing = document.getElementById(`road-path-${road.id}`);
                if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
            }
        });
    }

    return {
        calculatePathD,
        addRoad,
        removeWaterRoutePaths
    };
})();
