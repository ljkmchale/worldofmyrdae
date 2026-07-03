/**
 * World of Myrdae - Static layered map renderer
 * Keeps #map-image as the coordinate anchor while showing runtime map layers.
 */
const MapLayerStack = (function () {
    const WORLD_COORDINATE_SPACE = Object.freeze({ width: 6400, height: 3600 });
    const WORLD_REGISTRATION_OFFSET = Object.freeze({ x: 0, y: 0 });
    const WORLD_LAYER_DIR = 'images/myrdae-map-layers';
    const WORLD_ANCHOR_SRC = `${WORLD_LAYER_DIR}/Myrdae (v.4.3.a - Runtime Composite 6400).png?v=riverfix-20260521-1`;
    const layers = [];

    const instances = new Map();

    function createLayerImage(layer) {
        const img = document.createElement('img');
        img.src = layer.src;
        img.alt = '';
        img.draggable = false;
        img.dataset.mapLayerId = layer.id;
        img.className = 'map-source-layer';
        img.style.position = 'absolute';
        img.style.top = '0';
        img.style.left = '0';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.pointerEvents = 'none';
        img.style.userSelect = 'none';
        img.style.zIndex = String(layer.zIndex);
        if (typeof layer.opacity === 'number') {
            img.style.opacity = String(layer.opacity);
        }
        return img;
    }

    function createRealmOverlay() {
        const img = document.createElement('img');
        img.alt = '';
        img.draggable = false;
        img.className = 'map-source-layer map-realm-overlay';
        img.style.position = 'absolute';
        img.style.top = '0';
        img.style.left = '0';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.pointerEvents = 'none';
        img.style.userSelect = 'none';
        img.style.zIndex = '4';
        img.style.display = 'none';
        img.style.opacity = '0';
        img.style.transition = 'opacity 160ms ease-out';
        return img;
    }

    function setAnchorMode(mapImg, layered) {
        mapImg.style.opacity = '1';
        mapImg.style.pointerEvents = 'none';
    }

    function init(containerId, imageId) {
        const mapImg = document.getElementById(imageId);
        if (!mapImg) return null;

        const layerParent = document.getElementById('map-layer-group') || mapImg.parentNode;
        let instance = instances.get(containerId);
        if (!instance) {
            const layerImages = layers.map(createLayerImage);
            const realmOverlay = createRealmOverlay();
            let insertAfter = mapImg;
            layerImages.forEach((layerImg) => {
                layerParent.insertBefore(layerImg, insertAfter.nextSibling);
                insertAfter = layerImg;
            });
            layerParent.insertBefore(realmOverlay, insertAfter.nextSibling);
            instance = { layerImages, mapImg, realmOverlay };
            instances.set(containerId, instance);
        }

        if (mapImg.getAttribute('src') !== WORLD_ANCHOR_SRC) {
            mapImg.src = WORLD_ANCHOR_SRC;
        }
        setAnchorMode(mapImg, true);
        instance.layerImages.forEach((layerImg) => {
            layerImg.style.display = 'block';
        });
        return instance;
    }

    function setTransform(containerId, transformStr, transformOrigin = '0 0') {
        const instance = instances.get(containerId);
        if (!instance) return;
        instance.layerImages.forEach((layerImg) => {
            layerImg.style.transform = transformStr;
            layerImg.style.transformOrigin = transformOrigin;
        });
        instance.realmOverlay.style.transform = transformStr;
        instance.realmOverlay.style.transformOrigin = transformOrigin;
    }

    function showWorld(containerId, imageId) {
        const instance = init(containerId, imageId);
        if (instance) {
            instance.realmOverlay.style.opacity = '0';
            instance.realmOverlay.style.display = 'none';
            instance.realmOverlay.onerror = null;
        }
        return instance;
    }

    function showSingleImage(containerId, imageId, src) {
        const mapImg = document.getElementById(imageId);
        const instance = instances.get(containerId);
        if (instance) {
            instance.layerImages.forEach((layerImg) => {
                layerImg.style.display = 'none';
            });
            instance.realmOverlay.style.opacity = '0';
            instance.realmOverlay.style.display = 'none';
            instance.realmOverlay.onerror = null;
        }
        if (mapImg) {
            setAnchorMode(mapImg, false);
            if (src) mapImg.src = src;
        }
    }

    function showOverlayImage(containerId, imageId, src, options = {}) {
        const instance = init(containerId, imageId);
        if (!instance || !src) return null;

        const overlay = instance.realmOverlay;
        const opacity = Number.isFinite(Number(options.opacity))
            ? Math.max(0, Math.min(1, Number(options.opacity)))
            : 0.58;
        if (overlay.getAttribute('src') !== src) {
            overlay.src = src;
        }
        overlay.style.display = 'block';
        overlay.style.opacity = String(opacity);
        return overlay;
    }

    function preloadImage(src) {
        if (!src) return null;
        const img = new Image();
        img.decoding = 'async';
        img.src = src;
        return img;
    }

    function getCoordinateSpace() {
        return WORLD_COORDINATE_SPACE;
    }

    function getRegistrationOffset() {
        return WORLD_REGISTRATION_OFFSET;
    }

    return {
        init,
        setTransform,
        showWorld,
        showSingleImage,
        showOverlayImage,
        preloadImage,
        getCoordinateSpace,
        getRegistrationOffset,
        WORLD_ANCHOR_SRC
    };
})();
