/**
 * Pure helpers for percent-space geometry and named-road routing.
 */
const MapOverlayRouteGraph = (function () {
    const MAP_MILES_PER_PERCENT = 25;
    const TRAVEL_MILES_PER_DAY = {
        major: 24,
        minor: 18,
        'water-route': 72,
        default: 20
    };

    function getRoadTravelSpeed(roadType) {
        return TRAVEL_MILES_PER_DAY[roadType] || TRAVEL_MILES_PER_DAY.default;
    }

    function getRoadDisplayName(road, fromLoc, toLoc) {
        if (road.name && road.name.trim()) return road.name.trim().replace(/[\r\n]+/g, ' ');
        if (fromLoc && toLoc) return `${fromLoc.name} to ${toLoc.name}`;
        if (road.id) {
            return road.id
                .replace(/[-_]+/g, ' ')
                .replace(/\broad\b/gi, '')
                .replace(/\bcrossroad\b/gi, 'Crossroad')
                .replace(/\s+/g, ' ')
                .trim()
                .replace(/\b\w/g, (char) => char.toUpperCase());
        }
        return 'Road Connection';
    }

    function getRoadPointPercent(pt, locMap) {
        if (typeof pt === 'string') {
            const loc = locMap.get(pt);
            return loc ? { x: loc.x, y: loc.y, locationId: loc.id } : null;
        }
        if (Array.isArray(pt) && pt.length === 2) {
            return { x: pt[0], y: pt[1], locationId: null };
        }
        if (pt && typeof pt.x === 'number' && typeof pt.y === 'number') {
            return { x: pt.x, y: pt.y, locationId: pt.locationId || null };
        }
        return null;
    }

    function getRoadPointSource(road) {
        if (Array.isArray(road.points) && road.points.length > 0) return road.points;
        if (Array.isArray(road.waypoints) && road.waypoints.length > 0) return road.waypoints;
        return [];
    }

    function measurePercentPath(points) {
        let total = 0;
        for (let i = 1; i < points.length; i += 1) {
            const dx = points[i].x - points[i - 1].x;
            const dy = points[i].y - points[i - 1].y;
            total += Math.sqrt((dx * dx) + (dy * dy));
        }
        return total;
    }

    function measurePercentDistance(fromPoint, toPoint) {
        if (!fromPoint || !toPoint) return 0;
        return measurePercentPath([fromPoint, toPoint]);
    }

    function percentToMiles(percentDistance) {
        return percentDistance * MAP_MILES_PER_PERCENT;
    }

    function milesToDays(miles, milesPerDay) {
        if (!milesPerDay || milesPerDay <= 0) return 0;
        return miles / milesPerDay;
    }

    function addRoadLink(roadLinksByLocation, locMap, fromId, toId, road, percentDistance) {
        if (!fromId || !toId || fromId === toId) return;

        const fromLoc = locMap.get(fromId);
        const toLoc = locMap.get(toId);
        if (!fromLoc || !toLoc) return;

        const miles = percentDistance * MAP_MILES_PER_PERCENT;
        const speed = getRoadTravelSpeed(road.type);
        const days = miles / speed;
        const entries = roadLinksByLocation.get(fromId) || [];

        entries.push({
            destinationId: toId,
            destinationName: toLoc.name,
            roadId: road.id || '',
            roadName: getRoadDisplayName(road, fromLoc, toLoc),
            roadType: road.type || 'road',
            miles,
            days
        });

        entries.sort((a, b) => a.miles - b.miles);
        roadLinksByLocation.set(fromId, entries);
    }

    function buildRoadLinks(data, locMap) {
        const roadLinksByLocation = new Map();
        if (!data || !Array.isArray(data.roads)) return roadLinksByLocation;

        data.roads.forEach((road) => {
            const roadPoints = getRoadPointSource(road);
            if (roadPoints.length < 2) return;
            if (road.type === 'water-route') return;

            let lastNamedPoint = null;
            let segmentPoints = [];

            roadPoints.forEach((rawPoint) => {
                const point = getRoadPointPercent(rawPoint, locMap);
                if (!point) return;

                if (!segmentPoints.length) segmentPoints.push(point);
                else {
                    const prev = segmentPoints[segmentPoints.length - 1];
                    if (prev.x !== point.x || prev.y !== point.y || prev.locationId !== point.locationId) {
                        segmentPoints.push(point);
                    }
                }

                if (point.locationId) {
                    if (lastNamedPoint && lastNamedPoint.locationId !== point.locationId && segmentPoints.length >= 2) {
                        const percentDistance = measurePercentPath(segmentPoints);
                        addRoadLink(roadLinksByLocation, locMap, lastNamedPoint.locationId, point.locationId, road, percentDistance);
                        addRoadLink(roadLinksByLocation, locMap, point.locationId, lastNamedPoint.locationId, road, percentDistance);
                    }
                    lastNamedPoint = point;
                    segmentPoints = [point];
                }
            });
        });

        return roadLinksByLocation;
    }

    function buildSeaLinks(data, locMap) {
        const seaLinksByLocation = new Map();
        if (!data || !Array.isArray(data.roads)) return seaLinksByLocation;

        data.roads.forEach((road) => {
            if (road.type !== 'water-route') return;
            const roadPoints = getRoadPointSource(road);
            if (roadPoints.length < 2) return;

            let lastNamedPoint = null;
            let segmentPoints = [];

            roadPoints.forEach((rawPoint) => {
                const point = getRoadPointPercent(rawPoint, locMap);
                if (!point) return;

                if (!segmentPoints.length) segmentPoints.push(point);
                else {
                    const prev = segmentPoints[segmentPoints.length - 1];
                    if (prev.x !== point.x || prev.y !== point.y || prev.locationId !== point.locationId) {
                        segmentPoints.push(point);
                    }
                }

                if (point.locationId) {
                    if (lastNamedPoint && lastNamedPoint.locationId !== point.locationId && segmentPoints.length >= 2) {
                        const percentDistance = measurePercentPath(segmentPoints);
                        addRoadLink(seaLinksByLocation, locMap, lastNamedPoint.locationId, point.locationId, road, percentDistance);
                        addRoadLink(seaLinksByLocation, locMap, point.locationId, lastNamedPoint.locationId, road, percentDistance);
                    }
                    lastNamedPoint = point;
                    segmentPoints = [point];
                }
            });
        });

        return seaLinksByLocation;
    }

    const SETTLEMENT_TYPES = new Set(['capital', 'city', 'small-city', 'town', 'village', 'port']);

    function isSettlementLocation(locMap, locationId) {
        const loc = locMap.get(locationId);
        return Boolean(loc && SETTLEMENT_TYPES.has(loc.type));
    }

    /**
     * Contract the full road graph to settlement-to-settlement links: from each
     * settlement, walk outward through non-settlement named points (POIs,
     * landmarks, crossroads) accumulating distance, and stop at the first
     * settlement reached in each direction. Non-settlements never appear as
     * destinations; they only contribute path distance.
     */
    function buildSettlementLinks(roadLinksByLocation, locMap) {
        const settlementLinks = new Map();

        roadLinksByLocation.forEach((links, fromId) => {
            if (!isSettlementLocation(locMap, fromId)) return;

            const fromLoc = locMap.get(fromId);
            const best = new Map();
            const visited = new Map([[fromId, 0]]);
            const queue = [{ id: fromId, miles: 0, days: 0, firstLink: null, hops: 0 }];

            while (queue.length) {
                let bestIndex = 0;
                for (let i = 1; i < queue.length; i += 1) {
                    if (queue[i].miles < queue[bestIndex].miles) bestIndex = i;
                }
                const current = queue.splice(bestIndex, 1)[0];

                (roadLinksByLocation.get(current.id) || []).forEach((link) => {
                    const miles = current.miles + link.miles;
                    const days = current.days + link.days;
                    if (visited.has(link.destinationId) && visited.get(link.destinationId) <= miles) return;
                    visited.set(link.destinationId, miles);

                    const firstLink = current.firstLink || link;
                    const hops = current.hops + 1;
                    if (isSettlementLocation(locMap, link.destinationId)) {
                        const previous = best.get(link.destinationId);
                        if (!previous || miles < previous.miles) {
                            const singleLine = (text) => String(text || '').replace(/[\r\n]+/g, ' ');
                            best.set(link.destinationId, {
                                destinationId: link.destinationId,
                                destinationName: link.destinationName,
                                roadId: firstLink.roadId,
                                roadName: hops > 1 && fromLoc
                                    ? `${singleLine(fromLoc.name)} to ${singleLine(link.destinationName)}`
                                    : firstLink.roadName,
                                roadType: firstLink.roadType,
                                miles,
                                days
                            });
                        }
                        // Stop here: routes through a settlement belong to that settlement.
                    } else {
                        queue.push({ id: link.destinationId, miles, days, firstLink, hops });
                    }
                });
            }

            const entries = Array.from(best.values()).sort((a, b) => a.miles - b.miles);
            if (entries.length) settlementLinks.set(fromId, entries);
        });

        return settlementLinks;
    }

    function findRouteBetweenLocations(fromId, toId, roadLinksByLocation) {
        if (!fromId || !toId || fromId === toId) return null;
        if (!roadLinksByLocation.has(fromId) || !roadLinksByLocation.has(toId)) return null;

        const distances = new Map([[fromId, 0]]);
        const travelDays = new Map([[fromId, 0]]);
        const previous = new Map();
        const visited = new Set();

        while (true) {
            let currentId = null;
            let currentDistance = Infinity;

            distances.forEach((distance, locationId) => {
                if (!visited.has(locationId) && distance < currentDistance) {
                    currentDistance = distance;
                    currentId = locationId;
                }
            });

            if (!currentId) break;
            if (currentId === toId) break;

            visited.add(currentId);

            const links = roadLinksByLocation.get(currentId) || [];
            links.forEach((link) => {
                const nextDistance = currentDistance + link.miles;
                const knownDistance = distances.has(link.destinationId) ? distances.get(link.destinationId) : Infinity;
                if (nextDistance < knownDistance) {
                    distances.set(link.destinationId, nextDistance);
                    travelDays.set(link.destinationId, (travelDays.get(currentId) || 0) + link.days);
                    previous.set(link.destinationId, {
                        fromId: currentId,
                        link
                    });
                }
            });
        }

        if (!distances.has(toId)) return null;

        const path = [];
        let cursor = toId;
        while (cursor) {
            path.unshift(cursor);
            const previousEntry = previous.get(cursor);
            if (!previousEntry) break;
            cursor = previousEntry.fromId;
        }

        if (!path.length || path[0] !== fromId) return null;

        const segments = [];
        for (let i = 1; i < path.length; i += 1) {
            const entry = previous.get(path[i]);
            if (entry) segments.push(entry.link);
        }

        return {
            path,
            miles: distances.get(toId) || 0,
            days: travelDays.get(toId) || 0,
            segments
        };
    }

    return {
        MAP_MILES_PER_PERCENT,
        TRAVEL_MILES_PER_DAY,
        getRoadTravelSpeed,
        getRoadDisplayName,
        getRoadPointPercent,
        getRoadPointSource,
        measurePercentPath,
        measurePercentDistance,
        percentToMiles,
        milesToDays,
        buildRoadLinks,
        buildSeaLinks,
        buildSettlementLinks,
        isSettlementLocation,
        findRouteBetweenLocations
    };
})();
