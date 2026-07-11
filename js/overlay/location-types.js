/**
 * Single registry for per-type marker, label, and tooltip defaults.
 *
 * Settlement markers follow the shared map key: shape encodes size tier
 * (capital star, large bullseye, mid-sized donut, small dot, landmark
 * square, POI diamond) and color encodes disposition (green friendly,
 * brown neutral, red hostile).
 */
const MapOverlayLocationTypes = (function () {
    const DISPOSITION_COLORS = {
        friendly: { fill: '#235415', edge: '#16360d' },
        neutral: { fill: '#4a331f', edge: '#2e1f12' },
        hostile: { fill: '#8a1010', edge: '#5c0a0a' }
    };
    const HALO = 'rgba(255, 255, 255, 0.95)';

    function dispositionColors(ctx) {
        return DISPOSITION_COLORS[ctx.disposition] || DISPOSITION_COLORS.neutral;
    }

    function starPoints(px, py, outerR, innerR, spikes) {
        let points = '';
        for (let i = 0; i < spikes; i += 1) {
            const outerAngle = (-Math.PI / 2) + (i * 2 * Math.PI / spikes);
            const innerAngle = outerAngle + (Math.PI / spikes);
            points += `${px + outerR * Math.cos(outerAngle)},${py + outerR * Math.sin(outerAngle)} `;
            points += `${px + innerR * Math.cos(innerAngle)},${py + innerR * Math.sin(innerAngle)} `;
        }
        return points.trim();
    }

    // Capital: colored disc with a white 8-point starburst inside (no center dot).
    function buildCapitalMarker(ctx) {
        const { markerGroup, px, py, radius, makeCircle, svg } = ctx;
        const colors = dispositionColors(ctx);

        markerGroup.appendChild(makeCircle(px, py, radius, colors.fill, HALO, 1.5));

        const star = svg('polygon');
        star.setAttribute('points', starPoints(px, py, radius * 0.8, radius * 0.32, 8));
        star.setAttribute('fill', '#FFFFFF');
        star.setAttribute('stroke', 'none');
        markerGroup.appendChild(star);
    }

    // Large: colored outer ring, white gap, colored center dot (bullseye).
    function buildCityMarker(ctx) {
        const { markerGroup, px, py, radius, makeCircle } = ctx;
        const colors = dispositionColors(ctx);
        markerGroup.appendChild(makeCircle(px, py, radius, 'none', HALO, radius * 0.62));
        markerGroup.appendChild(makeCircle(px, py, radius, '#FFFFFF', colors.fill, radius * 0.42));
        markerGroup.appendChild(makeCircle(px, py, radius * 0.42, colors.fill, 'none', 0));
    }

    // Mid-sized: colored disc with a white hole in the center.
    function buildSmallCityMarker(ctx) {
        const { markerGroup, px, py, radius, makeCircle } = ctx;
        const colors = dispositionColors(ctx);
        markerGroup.appendChild(makeCircle(px, py, radius, colors.fill, HALO, 1));
        markerGroup.appendChild(makeCircle(px, py, radius * 0.4, '#FFFFFF', 'none', 0));
    }

    // Small: solid colored dot.
    function buildTownMarker(ctx) {
        const { markerGroup, px, py, radius, makeCircle } = ctx;
        const colors = dispositionColors(ctx);
        markerGroup.appendChild(makeCircle(px, py, radius, colors.fill, HALO, 1));
    }

    function buildVillageMarker(ctx) {
        const { markerGroup, px, py, radius, makeCircle } = ctx;
        const colors = dispositionColors(ctx);
        markerGroup.appendChild(makeCircle(px, py, radius, colors.fill, HALO, 0.8));
    }

    function buildPortMarker(ctx) {
        const { markerGroup, px, py, radius, makeCircle } = ctx;
        const colors = dispositionColors(ctx);
        markerGroup.appendChild(makeCircle(px, py, radius, '#E8F4FD', colors.fill, 1.5));
        markerGroup.appendChild(makeCircle(px, py, radius * 0.35, '#4682B4', '#2C5F8A', 0.5));
    }

    function buildRuinsMarker(ctx) {
        const { markerGroup, px, py, radius, makeCircle } = ctx;
        const colors = dispositionColors(ctx);
        const ring = makeCircle(px, py, radius, 'none', ctx.disposition === 'neutral' ? '#888' : colors.fill, 1.5);
        ring.setAttribute('stroke-dasharray', `${radius * 0.8} ${radius * 0.5}`);
        markerGroup.appendChild(ring);
    }

    // Landmark: solid colored square.
    function buildLandmarkMarker(ctx) {
        const { markerGroup, px, py, radius, svg } = ctx;
        const colors = dispositionColors(ctx);
        const square = svg('rect');
        const side = radius * 1.7;
        square.setAttribute('x', px - side / 2);
        square.setAttribute('y', py - side / 2);
        square.setAttribute('width', side);
        square.setAttribute('height', side);
        square.setAttribute('rx', side * 0.08);
        square.setAttribute('fill', colors.fill);
        square.setAttribute('stroke', HALO);
        square.setAttribute('stroke-width', '1');
        markerGroup.appendChild(square);
    }

    function buildPassMarker(ctx) {
        const { markerGroup, px, py, radius, svg } = ctx;
        const colors = dispositionColors(ctx);
        const tri = svg('polygon');
        tri.setAttribute('points', `${px},${py - radius} ${px + radius * 0.87},${py + radius * 0.5} ${px - radius * 0.87},${py + radius * 0.5}`);
        tri.setAttribute('fill', '#AAA');
        tri.setAttribute('stroke', ctx.disposition === 'neutral' ? '#666' : colors.fill);
        tri.setAttribute('stroke-width', '1');
        markerGroup.appendChild(tri);
    }

    // Point of interest: solid colored diamond.
    function buildPoiMarker(ctx) {
        const { markerGroup, px, py, radius, svg } = ctx;
        const colors = dispositionColors(ctx);
        const diamond = svg('polygon');
        const r = radius * 1.15;
        diamond.setAttribute('points', `${px},${py - r} ${px + r},${py} ${px},${py + r} ${px - r},${py}`);
        diamond.setAttribute('fill', colors.fill);
        diamond.setAttribute('stroke', HALO);
        diamond.setAttribute('stroke-width', '1');
        markerGroup.appendChild(diamond);
    }

    function buildDefaultMarker(ctx) {
        const { markerGroup, px, py, radius, makeCircle } = ctx;
        markerGroup.appendChild(makeCircle(px, py, radius, '#d4af37', 'rgba(0,0,0,0.6)', 1.5));
    }

    const LOCATION_TYPES = {
        capital: {
            icon: '&#127984;',
            radiusMultiplier: 2.2,
            labelFontFamily: 'Simonetta',
            labelFontStyle: 'normal',
            drawMarker: buildCapitalMarker
        },
        city: {
            icon: '&#127984;',
            radiusMultiplier: 1.8,
            labelFontFamily: 'Simonetta',
            labelFontStyle: 'normal',
            drawMarker: buildCityMarker
        },
        'small-city': {
            icon: '&#127968;',
            radiusMultiplier: 1.2,
            labelFontFamily: 'Simonetta',
            labelFontStyle: 'normal',
            drawMarker: buildSmallCityMarker
        },
        town: {
            icon: '&#127960;',
            radiusMultiplier: 0.9,
            labelFontFamily: 'Simonetta',
            labelFontStyle: 'normal',
            drawMarker: buildTownMarker
        },
        village: {
            icon: '&#127969;',
            radiusMultiplier: 0.6,
            drawMarker: buildVillageMarker
        },
        port: {
            icon: '&#9875;',
            radiusMultiplier: 1.4,
            drawMarker: buildPortMarker
        },
        ruins: {
            icon: '&#127962;',
            radiusMultiplier: 1.2,
            labelFontFamily: 'Simonetta',
            labelFontStyle: 'italic',
            drawMarker: buildRuinsMarker
        },
        landmark: {
            icon: '&#11088;',
            radiusMultiplier: 1.3,
            labelFontFamily: 'Simonetta',
            labelFontStyle: 'italic',
            drawMarker: buildLandmarkMarker
        },
        pass: {
            icon: '&#127956;',
            radiusMultiplier: 1.0,
            drawMarker: buildPassMarker
        },
        poi: {
            icon: '&#128205;',
            radiusMultiplier: 1.0,
            labelFontFamily: 'Simonetta',
            labelFontStyle: 'italic',
            drawMarker: buildPoiMarker
        },
        water: {
            icon: '&#128167;',
            labelOnly: true,
            labelFontFamily: 'Quintessential',
            labelFontStyle: 'normal'
        },
        river: {
            icon: '&#127754;',
            labelOnly: true,
            labelFontFamily: 'Simonetta',
            labelFontStyle: 'italic'
        },
        nature: {
            icon: '&#127794;',
            labelFontFamily: 'Sell Your Soul',
            labelFontStyle: 'normal'
        },
        region: {
            icon: '&#128506;',
            labelOnly: true,
            labelFontFamily: 'Sell Your Soul',
            labelFontStyle: 'normal'
        },
        default: {
            icon: '&#128205;',
            radiusMultiplier: 1.0,
            drawMarker: buildDefaultMarker
        }
    };

    function getTypeConfig(type) {
        return LOCATION_TYPES[type] || LOCATION_TYPES.default;
    }

    return {
        LOCATION_TYPES,
        DISPOSITION_COLORS,
        getTypeConfig
    };
})();
