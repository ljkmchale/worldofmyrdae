/**
 * World of Myrdae - Static layered map renderer
 * Keeps #map-image as the coordinate anchor while showing runtime map layers.
 */
const MapLayerStack = (function () {
    const WORLD_ANCHOR_SRC = 'images/map-layers/Myrdae-layered-preview.jpg';
    const layers = [
        { id: 'ocean-base', src: 'images/map-layers/display-ocean-base.jpg', zIndex: 0 },
        { id: 'land-composite', src: 'images/map-layers/display-land-composite.png', zIndex: 2 }
    ];

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
        return img;
    }

    function setAnchorMode(mapImg, layered) {
        mapImg.style.opacity = layered ? '0' : '1';
        mapImg.style.pointerEvents = 'none';
    }

    function init(containerId, imageId) {
        const mapImg = document.getElementById(imageId);
        if (!mapImg) return null;

        const layerParent = document.getElementById('map-layer-group') || mapImg.parentNode;
        let instance = instances.get(containerId);
        if (!instance) {
            const layerImages = layers.map(createLayerImage);
            let insertAfter = mapImg;
            layerImages.forEach((layerImg) => {
                layerParent.insertBefore(layerImg, insertAfter.nextSibling);
                insertAfter = layerImg;
            });
            instance = { layerImages, mapImg };
            instances.set(containerId, instance);
        }

        mapImg.src = WORLD_ANCHOR_SRC;
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
    }

    function showWorld(containerId, imageId) {
        return init(containerId, imageId);
    }

    function showSingleImage(containerId, imageId, src) {
        const mapImg = document.getElementById(imageId);
        const instance = instances.get(containerId);
        if (instance) {
            instance.layerImages.forEach((layerImg) => {
                layerImg.style.display = 'none';
            });
        }
        if (mapImg) {
            setAnchorMode(mapImg, false);
            if (src) mapImg.src = src;
        }
    }

    return {
        init,
        setTransform,
        showWorld,
        showSingleImage,
        WORLD_ANCHOR_SRC
    };
})();
