/**
 * World of Myrdae - Surface / Underdark map realm switching.
 * The Underdark uses the same percentage coordinate system as the surface map.
 */
const MapRealmController = (function () {
    const UNDERDARK_OVERLAY_OPACITY = 0.58;
    let activeRealm = 'surface';

    function getUnderdarkImage() {
        return (typeof CampaignData !== 'undefined' && typeof CampaignData.getUnderdarkMapImage === 'function')
            ? CampaignData.getUnderdarkMapImage()
            : 'images/myrdae-map-layers/underdark-map.webp';
    }

    function updateButton(realm, buttonId = 'underdark-toggle') {
        const button = document.getElementById(buttonId);
        const surfaceButton = document.getElementById('surface-toggle');
        const isUnderdark = realm === 'underdark';
        if (button) {
            button.style.opacity = '1';
            button.classList.toggle('active', isUnderdark);
            button.title = 'Show Underdark';
            button.setAttribute('aria-pressed', isUnderdark ? 'true' : 'false');
        }
        if (surfaceButton) {
            surfaceButton.classList.toggle('active', !isUnderdark);
            surfaceButton.setAttribute('aria-pressed', isUnderdark ? 'false' : 'true');
        }
    }

    function updateSurfaceOnlyControls(realm) {
        const awakeningButton = document.getElementById('awakening-btn');
        if (!awakeningButton) return;
        const isUnderdark = realm === 'underdark';
        awakeningButton.disabled = isUnderdark;
        awakeningButton.style.opacity = isUnderdark ? '0.25' : '1';
        awakeningButton.title = isUnderdark
            ? 'The Great Awakening is available on the Surface map'
            : 'Replay the Great Awakening';
    }

    function setVisualRealm(realm, options = {}) {
        const nextRealm = realm === 'underdark' ? 'underdark' : 'surface';
        const containerId = options.containerId || 'map-container';
        const imageId = options.imageId || 'map-image';
        const mapImage = document.getElementById(imageId);
        activeRealm = nextRealm;

        if (nextRealm === 'underdark') {
            const underdarkImage = options.imageSrc || getUnderdarkImage();
            if (window.OCEAN_SHADER_ENABLED && typeof OceanShader !== 'undefined') {
                OceanShader.destroy(containerId);
            }
            let underdarkOverlay = null;
            if (underdarkImage) {
                underdarkOverlay = MapLayerStack.showOverlayImage(containerId, imageId, underdarkImage, {
                    opacity: UNDERDARK_OVERLAY_OPACITY
                });
            }
            if (mapImage) {
                mapImage.style.filter = '';
                mapImage.onerror = null;
            }
            if (underdarkOverlay) {
                underdarkOverlay.onerror = () => {
                    underdarkOverlay.onerror = null;
                    MapLayerStack.showWorld(containerId, imageId);
                    document.dispatchEvent(new CustomEvent('map-realm-image-missing', { detail: { realm: nextRealm, src: underdarkImage } }));
                };
            }
        } else {
            if (mapImage) {
                mapImage.onerror = null;
                mapImage.style.filter = '';
            }
            MapLayerStack.showWorld(containerId, imageId);
            if (window.OCEAN_SHADER_ENABLED && typeof OceanShader !== 'undefined') {
                OceanShader.init(containerId, imageId);
            }
        }

        document.body.dataset.mapRealm = nextRealm;
        updateButton(nextRealm, options.buttonId);
        updateSurfaceOnlyControls(nextRealm);
        if (typeof MapOverlay !== 'undefined' && typeof MapOverlay.updateRealmControls === 'function') {
            MapOverlay.updateRealmControls();
        }
        document.dispatchEvent(new CustomEvent('map-realm-changed', { detail: { realm: nextRealm } }));
        return nextRealm;
    }

    function setRealm(realm, options = {}) {
        const nextRealm = setVisualRealm(realm, options);
        if (!options.visualOnly && typeof CampaignData !== 'undefined' && typeof CampaignData.setRealm === 'function') {
            CampaignData.setRealm(nextRealm);
        }
        return nextRealm;
    }

    function toggle(options = {}) {
        return setRealm(activeRealm === 'surface' ? 'underdark' : 'surface', options);
    }

    function getRealm() {
        return activeRealm;
    }

    function preloadUnderdark(imageSrc) {
        const src = imageSrc || getUnderdarkImage();
        return src ? MapLayerStack.preloadImage(src) : null;
    }

    document.addEventListener('campaign-data-updated', (event) => {
        const detail = event.detail || {};
        preloadUnderdark(detail.underdarkMapImage || detail.underdark?.mapImage);
    });

    return { setRealm, setVisualRealm, toggle, getRealm, getUnderdarkImage, preloadUnderdark };
})();
