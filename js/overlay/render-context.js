/**
 * Shared render context for the world map overlay.
 */
const MapOverlayRenderContext = (function () {
    function createRenderContext() {
        return {
            data: null,
            tooltip: null,
            hideTimer: null,
            overlayVisible: true,
            tooltipsEnabled: true,
            locMap: new Map(),
            natW: 0,
            natH: 0,
            roadGroup: null,
            roadLinksByLocation: new Map(),
            settlementLinksByLocation: new Map(),
            initializedContainers: [],
            tooltipHeaderImageCache: new Map(),
            tooltipImageAvailabilityCache: new Map(),
            tooltipHtmlCache: new Map(),
            activeTooltipLocationId: null
        };
    }

    function setRenderData(ctx, data) {
        ctx.data = data || null;
        return ctx.data;
    }

    function setRenderMetrics(ctx, natW, natH) {
        ctx.natW = natW || 0;
        ctx.natH = natH || 0;
    }

    function rebuildLocationIndex(ctx, locations) {
        ctx.locMap.clear();
        (locations || []).forEach((loc) => {
            if (loc && loc.id) ctx.locMap.set(loc.id, loc);
        });
        return ctx.locMap;
    }

    return {
        createRenderContext,
        setRenderData,
        setRenderMetrics,
        rebuildLocationIndex
    };
})();
