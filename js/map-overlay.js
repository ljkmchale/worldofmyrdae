/**
 * World of Myrdae - Map Overlay
 * Public coordinator for SVG markers, roads, labels, and tooltips.
 */
const MapOverlay = (function () {
    const renderCtx = MapOverlayRenderContext.createRenderContext();
    let isListenerBound = false;
    let isMotionDismissBound = false;

    function isEditorMode() {
        return typeof document !== 'undefined' && document.body && document.body.classList.contains('editor-mode');
    }

    function getData() {
        return renderCtx.data;
    }

    function getLocationById(locationId) {
        return locationId ? renderCtx.locMap.get(locationId) || null : null;
    }

    function getLocationsForRender() {
        if (renderCtx.data && Array.isArray(renderCtx.data.locations) && renderCtx.data.locations.length > 0) {
            return renderCtx.data.locations;
        }
        if (typeof WORLD_LOCATIONS !== 'undefined' && Array.isArray(WORLD_LOCATIONS.locations)) {
            return WORLD_LOCATIONS.locations;
        }
        return [];
    }

    function getRoadsForRender() {
        if (renderCtx.data && Array.isArray(renderCtx.data.roads)) return renderCtx.data.roads;
        if (typeof WORLD_LOCATIONS !== 'undefined' && Array.isArray(WORLD_LOCATIONS.roads)) return WORLD_LOCATIONS.roads;
        return [];
    }

    function findNearestLocation(x, y, maxPercentDistance = 1.5) {
        if (typeof x !== 'number' || typeof y !== 'number' || !renderCtx.locMap.size) return null;

        let nearest = null;
        let nearestDistance = Infinity;
        renderCtx.locMap.forEach((loc) => {
            if (typeof loc.x !== 'number' || typeof loc.y !== 'number') return;
            const distance = MapOverlayRouteGraph.measurePercentDistance({ x, y }, loc);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearest = loc;
            }
        });

        if (!nearest || nearestDistance > maxPercentDistance) return null;
        return nearest;
    }

    async function loadRenderData(dataOverride) {
        if (dataOverride) {
            MapOverlayRenderContext.setRenderData(renderCtx, dataOverride);
            return renderCtx.data;
        }

        const campaign = (typeof CampaignData !== 'undefined') ? CampaignData
            : (typeof window !== 'undefined' && window.CampaignData) ? window.CampaignData
            : null;

        if (!campaign) {
            throw new Error('CampaignData module not found — js/campaign-data.js must load before map-overlay.');
        }

        const cached = campaign.getData();
        if (cached && cached.locations && cached.locations.length > 0) {
            MapOverlayRenderContext.setRenderData(renderCtx, cached);
            return renderCtx.data;
        }

        const initialized = await campaign.init();
        if (!initialized || !Array.isArray(initialized.locations) || initialized.locations.length === 0) {
            throw new Error('CampaignData.init() returned no locations — check that js/locations-db.js loaded successfully.');
        }
        MapOverlayRenderContext.setRenderData(renderCtx, initialized);
        return renderCtx.data;
    }

    function createOverlayDefs() {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

        const waterFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        waterFilter.setAttribute('id', 'water-label-shadow');
        waterFilter.setAttribute('x', '-20%');
        waterFilter.setAttribute('y', '-20%');
        waterFilter.setAttribute('width', '140%');
        waterFilter.setAttribute('height', '140%');
        const waterShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
        waterShadow.setAttribute('dx', '1');
        waterShadow.setAttribute('dy', '1');
        waterShadow.setAttribute('stdDeviation', '1.5');
        waterShadow.setAttribute('flood-color', '#555555');
        waterShadow.setAttribute('flood-opacity', '0.7');
        waterFilter.appendChild(waterShadow);
        defs.appendChild(waterFilter);

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
        riverGlow.setAttribute('flood-color', '#666666');
        riverGlow.setAttribute('flood-opacity', '0.8');
        riverFilter.appendChild(riverGlow);
        defs.appendChild(riverFilter);

        return defs;
    }

    function applyCurrentMapTransform(container, mapImg, element) {
        const transformedParent = mapImg.parentNode && mapImg.parentNode.id === 'map-layer-group';
        if (transformedParent) return;

        const controller = (typeof MapController !== 'undefined') ? MapController : null;
        const mapState = controller && typeof controller.getInstanceState === 'function'
            ? controller.getInstanceState(container.id)
            : null;

        if (mapState) {
            element.style.transform = `translate3d(${mapState.pointX}px, ${mapState.pointY}px, 0) scale(${mapState.scale})`;
            element.style.transformOrigin = '0 0';
        } else if (mapImg.style.transform) {
            element.style.transform = mapImg.style.transform;
            element.style.transformOrigin = mapImg.style.transformOrigin || '0 0';
        }
    }

    function getRendererContext() {
        renderCtx.isEditorMode = isEditorMode;
        renderCtx.tooltipHandlers = {
            show: MapOverlayTooltip.showTooltip,
            move: MapOverlayTooltip.moveTooltip,
            hide: MapOverlayTooltip.hideTooltip,
            isSuppressed: MapOverlayTooltip.isTooltipSuppressedLocation
        };
        return renderCtx;
    }

    function getMapCoordinateSpace(mapImg) {
        const stack = (typeof MapLayerStack !== 'undefined') ? MapLayerStack : null;
        const space = stack && typeof stack.getCoordinateSpace === 'function'
            ? stack.getCoordinateSpace()
            : null;
        return {
            width: space?.width || mapImg.naturalWidth,
            height: space?.height || mapImg.naturalHeight
        };
    }

    function getMapRegistrationOffset() {
        const stack = (typeof MapLayerStack !== 'undefined') ? MapLayerStack : null;
        return stack && typeof stack.getRegistrationOffset === 'function'
            ? stack.getRegistrationOffset()
            : { x: 0, y: 0 };
    }

    function renderOverlay(container, mapImg) {
        let existing = document.getElementById(`${container.id}-overlay`);
        if (existing) existing.remove();

        container.querySelectorAll('svg.map-overlay').forEach((overlay) => overlay.remove());

        const coordinateSpace = getMapCoordinateSpace(mapImg);
        MapOverlayRenderContext.setRenderMetrics(renderCtx, coordinateSpace.width, coordinateSpace.height);
        if (!renderCtx.natW || !renderCtx.natH) return;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'map-overlay');
        svg.setAttribute('id', `${container.id}-overlay`);
        const registrationOffset = getMapRegistrationOffset();
        svg.setAttribute('viewBox', `${-registrationOffset.x} ${-registrationOffset.y} ${renderCtx.natW} ${renderCtx.natH}`);
        svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
        svg.style.width = '100%';
        svg.style.height = 'auto';
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.pointerEvents = 'none';
        svg.style.willChange = 'transform';
        svg.style.zIndex = '10';
        svg.style.display = renderCtx.overlayVisible ? '' : 'none';
        svg.appendChild(createOverlayDefs());

        const locations = getLocationsForRender();
        MapOverlayRenderContext.rebuildLocationIndex(renderCtx, locations);
        renderCtx.roadLinksByLocation = MapOverlayRouteGraph.buildRoadLinks(renderCtx.data, renderCtx.locMap);
        renderCtx.seaLinksByLocation = MapOverlayRouteGraph.buildSeaLinks(renderCtx.data, renderCtx.locMap);

        const rendererCtx = getRendererContext();

        if (renderCtx.data && Array.isArray(renderCtx.data.regions)) {
            const regionGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            regionGroup.setAttribute('class', 'overlay-regions');
            renderCtx.data.regions.forEach((region) => {
                const px = (region.x / 100) * renderCtx.natW;
                const py = (region.y / 100) * renderCtx.natH;
                MapOverlayMarkerRenderer.addRegionLabel(regionGroup, region, px, py, rendererCtx);
            });
            svg.appendChild(regionGroup);
        }

        const roads = getRoadsForRender();
        if (roads.length > 0) {
            renderCtx.roadGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            renderCtx.roadGroup.setAttribute('class', 'overlay-roads');
            roads.forEach((road) => {
                const roadPoints = MapOverlayRouteGraph.getRoadPointSource(road);
                if (roadPoints.length >= 2) {
                    MapOverlayRoadRenderer.addRoad(renderCtx.roadGroup, road, rendererCtx);
                } else {
                    console.warn('Road skipped (needs at least 2 points):', road.id, 'points:', roadPoints.length);
                }
            });
            svg.appendChild(renderCtx.roadGroup);

            if (!isEditorMode()) MapOverlayRoadRenderer.removeWaterRoutePaths(renderCtx.data);
            if (typeof initializeBoatAnimations === 'function') {
                initializeBoatAnimations(svg, renderCtx.data, renderCtx.locMap, renderCtx.natW, renderCtx.natH);
            }
        }

        if (locations.length > 0) {
            const locGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            locGroup.setAttribute('class', 'overlay-locations');
            locations.forEach((loc) => {
                const px = (loc.x / 100) * renderCtx.natW;
                const py = (loc.y / 100) * renderCtx.natH;
                MapOverlayMarkerRenderer.addMarker(locGroup, loc, px, py, rendererCtx);
            });
            svg.appendChild(locGroup);
        }

        mapImg.parentNode.insertBefore(svg, mapImg.nextSibling);
        applyCurrentMapTransform(container, mapImg, svg);
    }

    async function init(containerId, imageId, dataOverride) {
        const container = document.getElementById(containerId);
        const mapImg = document.getElementById(imageId);
        if (!container || !mapImg) return;

        bindMotionDismissHandlers();

        if (!renderCtx.initializedContainers.some((entry) => entry.containerId === containerId)) {
            renderCtx.initializedContainers.push({ containerId, imageId });
        }

        const data = await loadRenderData(dataOverride);
        if (!data) return;

        MapOverlayTooltip.ensureTooltipElement(renderCtx);

        const setupOverlay = () => renderOverlay(container, mapImg);
        if (mapImg.complete && mapImg.naturalWidth) {
            setupOverlay();
        } else {
            mapImg.onload = setupOverlay;
        }
    }

    function bindMotionDismissHandlers() {
        if (isMotionDismissBound || typeof window === 'undefined') return;

        const dismissForMapMotion = (event) => {
            const target = event.target;
            if (target && target.closest && target.closest('.map-tooltip a')) return;
            MapOverlayTooltip.hideTooltipImmediately(renderCtx);
        };

        window.addEventListener('wheel', dismissForMapMotion, { capture: true, passive: true });
        window.addEventListener('pointerdown', dismissForMapMotion, { capture: true, passive: true });
        isMotionDismissBound = true;
    }

    function toggle(containerId) {
        const svg = document.getElementById(`${containerId}-overlay`);
        if (!svg) return renderCtx.overlayVisible;
        renderCtx.overlayVisible = !renderCtx.overlayVisible;
        svg.style.display = renderCtx.overlayVisible ? '' : 'none';
        return renderCtx.overlayVisible;
    }

    function refreshRoad(roadId) {
        const road = renderCtx.data?.roads?.find((entry) => entry.id === roadId);
        if (!road) return;
        const path = document.getElementById(`road-path-${roadId}`);
        if (!path) return;
        const d = MapOverlayRoadRenderer.calculatePathD(road, getRendererContext());
        if (d) path.setAttribute('d', d);
    }

    function addRoadToMap(road) {
        if (!renderCtx.data) return;
        if (!renderCtx.data.roads) renderCtx.data.roads = [];
        renderCtx.data.roads.push(road);
        if (renderCtx.roadGroup) {
            MapOverlayRoadRenderer.addRoad(renderCtx.roadGroup, road, getRendererContext());
        }
    }

    if (typeof document !== 'undefined' && !isListenerBound) {
        document.addEventListener('campaign-data-updated', async (event) => {
            MapOverlayRenderContext.setRenderData(renderCtx, event.detail);
            for (const entry of renderCtx.initializedContainers) {
                await init(entry.containerId, entry.imageId, renderCtx.data);
            }
        });
        isListenerBound = true;
    }

    return {
        init,
        toggle,
        setTooltipsEnabled: (enabled) => MapOverlayTooltip.setTooltipsEnabled(renderCtx, enabled),
        areTooltipsEnabled: () => MapOverlayTooltip.areTooltipsEnabled(renderCtx),
        hideActiveTooltip: () => MapOverlayTooltip.hideTooltipImmediately(renderCtx),
        getData,
        getLocationById,
        findNearestLocation,
        measurePercentDistance: MapOverlayRouteGraph.measurePercentDistance,
        percentToMiles: MapOverlayRouteGraph.percentToMiles,
        milesToDays: MapOverlayRouteGraph.milesToDays,
        findRouteBetweenLocations: (fromId, toId) => MapOverlayRouteGraph.findRouteBetweenLocations(fromId, toId, renderCtx.roadLinksByLocation),
        findSeaRouteBetweenLocations: (fromId, toId) => MapOverlayRouteGraph.findRouteBetweenLocations(fromId, toId, renderCtx.seaLinksByLocation),
        refreshRoad,
        addRoadToMap
    };
})();
