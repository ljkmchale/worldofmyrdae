/**
 * Single registry for per-type marker, label, and tooltip defaults.
 */
const MapOverlayLocationTypes = (function () {
    function buildCapitalMarker(ctx) {
        const { markerGroup, px, py, radius, colors, makeCircle, svg } = ctx;
        const glow = makeCircle(px, py, radius, 'none', 'rgba(255, 255, 255, 1.0)', 4);
        markerGroup.appendChild(glow);

        const outer = makeCircle(px, py, radius, colors.brown, colors.brown, 2.5);
        markerGroup.appendChild(outer);

        const star = svg('polygon');
        const starR = radius * 1.15;
        const innerR = starR * 0.4;
        let points = '';
        for (let i = 0; i < 8; i += 1) {
            const outerAngle = (-Math.PI / 2) + (i * 2 * Math.PI / 8);
            const innerAngle = outerAngle + (Math.PI / 8);
            points += `${px + starR * Math.cos(outerAngle)},${py + starR * Math.sin(outerAngle)} `;
            points += `${px + innerR * Math.cos(innerAngle)},${py + innerR * Math.sin(innerAngle)} `;
        }
        star.setAttribute('points', points.trim());
        star.setAttribute('fill', '#FFFFFF');
        star.setAttribute('stroke', colors.darkBrown);
        star.setAttribute('stroke-width', '0.5');
        markerGroup.appendChild(star);
    }

    function buildCityMarker(ctx) {
        const { markerGroup, px, py, radius, colors, makeCircle } = ctx;
        markerGroup.appendChild(makeCircle(px, py, radius, 'none', 'rgba(255, 255, 255, 0.95)', 3));
        markerGroup.appendChild(makeCircle(px, py, radius, '#FFFFFF', colors.brown, 2));
        markerGroup.appendChild(makeCircle(px, py, radius * 0.35, colors.brown, colors.darkBrown, 0.5));
    }

    function buildSmallCityMarker(ctx) {
        const { markerGroup, px, py, radius, colors, makeCircle } = ctx;
        markerGroup.appendChild(makeCircle(px, py, radius, colors.brown, 'rgba(255, 255, 255, 0.95)', 1));
        markerGroup.appendChild(makeCircle(px, py, radius * 0.55, '#FFFFFF', colors.brown, 1));
    }

    function buildTownMarker(ctx) {
        const { markerGroup, px, py, radius, colors, makeCircle } = ctx;
        markerGroup.appendChild(makeCircle(px, py, radius, colors.brown, 'rgba(255, 255, 255, 0.95)', 1));
    }

    function buildVillageMarker(ctx) {
        const { markerGroup, px, py, radius, colors, makeCircle } = ctx;
        markerGroup.appendChild(makeCircle(px, py, radius, '#A0522D', colors.darkBrown, 0.8));
    }

    function buildPortMarker(ctx) {
        const { markerGroup, px, py, radius, colors, makeCircle } = ctx;
        markerGroup.appendChild(makeCircle(px, py, radius, '#E8F4FD', colors.brown, 1.5));
        markerGroup.appendChild(makeCircle(px, py, radius * 0.35, '#4682B4', '#2C5F8A', 0.5));
    }

    function buildRuinsMarker(ctx) {
        const { markerGroup, px, py, radius, makeCircle } = ctx;
        const ring = makeCircle(px, py, radius, 'none', '#888', 1.5);
        ring.setAttribute('stroke-dasharray', `${radius * 0.8} ${radius * 0.5}`);
        markerGroup.appendChild(ring);
    }

    function buildLandmarkMarker(ctx) {
        const { markerGroup, px, py, radius, colors, svg } = ctx;
        const diamond = svg('polygon');
        diamond.setAttribute('points', `${px},${py - radius} ${px + radius * 0.7},${py} ${px},${py + radius} ${px - radius * 0.7},${py}`);
        diamond.setAttribute('fill', colors.brown);
        diamond.setAttribute('stroke', 'rgba(255, 255, 255, 0.95)');
        diamond.setAttribute('stroke-width', '1');
        markerGroup.appendChild(diamond);
    }

    function buildPassMarker(ctx) {
        const { markerGroup, px, py, radius, svg } = ctx;
        const tri = svg('polygon');
        tri.setAttribute('points', `${px},${py - radius} ${px + radius * 0.87},${py + radius * 0.5} ${px - radius * 0.87},${py + radius * 0.5}`);
        tri.setAttribute('fill', '#AAA');
        tri.setAttribute('stroke', '#666');
        tri.setAttribute('stroke-width', '1');
        markerGroup.appendChild(tri);
    }

    function buildPoiMarker(ctx) {
        const { markerGroup, px, py, radius, colors, svg } = ctx;
        const square = svg('rect');
        const side = radius * 1.8;
        square.setAttribute('x', px - side / 2);
        square.setAttribute('y', py - side / 2);
        square.setAttribute('width', side);
        square.setAttribute('height', side);
        square.setAttribute('fill', colors.brown);
        square.setAttribute('stroke', 'rgba(255, 255, 255, 0.95)');
        square.setAttribute('stroke-width', '1');
        markerGroup.appendChild(square);
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
        getTypeConfig
    };
})();
