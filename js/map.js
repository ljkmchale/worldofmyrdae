/**
 * World of Myrdae - Optimized Map Controller with Persistence
 * Uses requestAnimationFrame and GPU acceleration for smooth zoom/pan.
 * Supports synchronized overlays and saves state to localStorage.
 */

const MapController = (function () {
    const STORAGE_PREFIX = 'world_of_myrdae_map_';

    function createMapInstance(containerId, imageId, options = {}) {
        const container = document.getElementById(containerId);
        const mapImg = document.getElementById(imageId);

        if (!container || !mapImg) return null;

        const storageKey = STORAGE_PREFIX + containerId;

        let state = {
            scale: 1,
            pointX: 0,
            pointY: 0,
            isDragging: false,
            startX: 0,
            startY: 0,
            ticking: false,
            cw: 0, ch: 0, baseWidth: 0, baseHeight: 0
        };

        // Load persisted state
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                state.scale = parsed.scale || 1;
                state.pointX = parsed.pointX || 0;
                state.pointY = parsed.pointY || 0;
            } catch (e) {
                console.error('Failed to load map state', e);
            }
        }

        function updateDimensions() {
            state.cw = container.offsetWidth;
            state.ch = container.offsetHeight;
            if (mapImg.naturalWidth) {
                const ratio = state.cw / mapImg.naturalWidth;
                state.baseWidth = state.cw;
                state.baseHeight = mapImg.naturalHeight * ratio;
            }
        }

        function requestUpdate(save = true) {
            if (!state.ticking) {
                requestAnimationFrame(() => {
                    updateTransform();
                    if (save) saveState();
                });
                state.ticking = true;
            }
        }

        function saveState() {
            localStorage.setItem(storageKey, JSON.stringify({
                scale: state.scale,
                pointX: state.pointX,
                pointY: state.pointY
            }));
        }

        function updateTransform() {
            const iw = state.baseWidth * state.scale;
            const ih = state.baseHeight * state.scale;

            if (state.pointX > 0) state.pointX = 0;
            if (state.pointX < state.cw - iw) state.pointX = state.cw - iw;
            if (state.pointY > 0) state.pointY = 0;
            if (state.pointY < state.ch - ih) state.pointY = state.ch - ih;

            if (state.scale === 1) {
                state.pointX = 0;
                state.pointY = 0;
            }

            const transformStr = `translate3d(${state.pointX}px, ${state.pointY}px, 0) scale(${state.scale})`;
            mapImg.style.transform = transformStr;
            mapImg.style.transformOrigin = '0 0';

            if (options.onTransform) {
                options.onTransform(transformStr, state.scale, state.pointX, state.pointY);
            }

            state.ticking = false;
        }

        const onReady = () => {
            updateDimensions();
            requestUpdate(false); // Initial draw, don't re-save immediately
        };

        if (mapImg.complete) onReady();
        else mapImg.onload = onReady;

        window.addEventListener('resize', () => {
            updateDimensions();
            requestUpdate(false);
        });

        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = container.getBoundingClientRect();
            const xs = (e.clientX - rect.left - state.pointX) / state.scale;
            const ys = (e.clientY - rect.top - state.pointY) / state.scale;

            const delta = -e.deltaY;
            const zoomSpeed = 0.1;
            if (delta > 0) state.scale *= (1 + zoomSpeed);
            else state.scale /= (1 + zoomSpeed);

            state.scale = Math.min(Math.max(1, state.scale), 15);
            state.pointX = (e.clientX - rect.left) - xs * state.scale;
            state.pointY = (e.clientY - rect.top) - ys * state.scale;

            requestUpdate();
        }, { passive: false });

        container.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            e.preventDefault(); // Prevent text selection and default image dragging
            state.isDragging = true;
            state.startX = e.clientX - state.pointX;
            state.startY = e.clientY - state.pointY;
            container.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!state.isDragging) return;
            state.pointX = e.clientX - state.startX;
            state.pointY = e.clientY - state.startY;
            requestUpdate();
        });

        window.addEventListener('mouseup', () => {
            if (state.isDragging) {
                state.isDragging = false;
                container.style.cursor = 'grab';
            }
        });

        return {
            reset: function () {
                state.scale = 1;
                state.pointX = 0;
                state.pointY = 0;
                requestUpdate();
            },
            getState: () => ({ ...state })
        };
    }

    const instances = {};

    return {
        init: function (containerId, imageId, options) {
            instances[containerId] = createMapInstance(containerId, imageId, options);
        },
        reset: function (containerId) {
            if (instances[containerId]) instances[containerId].reset();
        },
        getInstanceState: function (containerId) {
            return instances[containerId] ? instances[containerId].getState() : null;
        }
    };
})();
