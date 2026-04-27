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
            state.scale = Math.min(state.scale, getMaxScale());
            const iw = state.baseWidth * state.scale;
            const ih = state.baseHeight * state.scale;

            if (state.pointX > 0) state.pointX = 0;
            if (state.pointX < state.cw - iw) state.pointX = state.cw - iw;
            if (state.pointY > 0) state.pointY = 0;
            if (state.pointY < state.ch - ih) state.pointY = state.ch - ih;

            // At the base zoom level, keep fully fitting axes anchored as before,
            // but allow panning on any axis where the image still overflows.
            if (state.scale === 1) {
                if (iw <= state.cw) state.pointX = 0;
                if (ih <= state.ch) state.pointY = 0;
            }

            const transformStr = `translate3d(${state.pointX}px, ${state.pointY}px, 0) scale(${state.scale})`;
            const transformTarget = options.layerGroup ? document.getElementById(options.layerGroup) : mapImg;
            transformTarget.style.transform = transformStr;
            transformTarget.style.transformOrigin = '0 0';

            if (options.onTransform) {
                options.onTransform(transformStr, state.scale, state.pointX, state.pointY);
            }

            state.ticking = false;
        }

        const onReady = () => {
            updateDimensions();
            state.scale = Math.min(state.scale, getMaxScale());
            requestUpdate(false); // Initial draw, don't re-save immediately
        };

        if (mapImg.complete) onReady();
        mapImg.addEventListener('load', onReady);

        // Use ResizeObserver instead of window resize to handle flexbox rendering delays
        // and sidebar toggle resizing smoothly.
        const resizeObserver = new ResizeObserver(() => {
            if (container.offsetWidth === 0 || container.offsetHeight === 0) return;
            updateDimensions();
            requestUpdate(false);
        });
        resizeObserver.observe(container);

        function getMaxScale() {
            const configuredMax = typeof options.maxScale === 'number' ? options.maxScale : 15;
            if (!mapImg.naturalWidth || !state.baseWidth) return configuredMax;
            const nativePixelScale = mapImg.naturalWidth / state.baseWidth;
            return Math.max(1, Math.min(configuredMax, nativePixelScale));
        }

        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = container.getBoundingClientRect();
            const xs = (e.clientX - rect.left - state.pointX) / state.scale;
            const ys = (e.clientY - rect.top - state.pointY) / state.scale;

            const delta = -e.deltaY;
            const zoomSpeed = 0.1;
            if (delta > 0) state.scale *= (1 + zoomSpeed);
            else state.scale /= (1 + zoomSpeed);

            state.scale = Math.min(Math.max(1, state.scale), getMaxScale());
            state.pointX = (e.clientX - rect.left) - xs * state.scale;
            state.pointY = (e.clientY - rect.top) - ys * state.scale;

            requestUpdate();
        }, { passive: false });

        container.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            if (e.target.closest('.legend-panel')) return; // Let legend panel clicks (inputs, buttons) through
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

        function animatePanTo(targetScale, targetX, targetY, duration) {
            const startScale = state.scale;
            const startX = state.pointX;
            const startY = state.pointY;
            duration = duration || 500;
            const startTime = performance.now();

            function easeInOutCubic(t) {
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            }

            function step(now) {
                const elapsed = now - startTime;
                const t = Math.min(elapsed / duration, 1);
                const e = easeInOutCubic(t);

                state.scale = startScale + (targetScale - startScale) * e;
                state.pointX = startX + (targetX - startX) * e;
                state.pointY = startY + (targetY - startY) * e;

                updateTransform();

                if (t < 1) requestAnimationFrame(step);
                else saveState();
            }

            requestAnimationFrame(step);
        }

        return {
            reset: function () {
                state.scale = 1;
                state.pointX = 0;
                state.pointY = 0;
                requestUpdate();
            },
            zoomOutFull: function () {
                return new Promise(resolve => {
                    animatePanTo(1, 0, 0, 1200);
                    setTimeout(resolve, 1300);
                });
            },
            getState: () => ({ ...state }),
            panToLocation: function (x, y, targetScale) {
                updateDimensions();
                const newScale = Math.min(Math.max(2, targetScale || 4), getMaxScale());
                const pixelX = (x / 100) * state.baseWidth;
                const pixelY = (y / 100) * state.baseHeight;
                const targetPointX = (state.cw / 2) - pixelX * newScale;
                const targetPointY = (state.ch / 2) - pixelY * newScale;
                animatePanTo(newScale, targetPointX, targetPointY);
            }
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
        },
        panToLocation: function (containerId, x, y, scale) {
            if (instances[containerId]) instances[containerId].panToLocation(x, y, scale);
        },
        zoomOutFull: function (containerId) {
            if (instances[containerId]) return instances[containerId].zoomOutFull();
            return Promise.resolve();
        }
    };
})();
