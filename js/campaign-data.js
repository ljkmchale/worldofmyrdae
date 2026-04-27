/**
 * World of Myrdae - Campaign Data
 * Handles loading, saving, and managing campaign data (locations, roads, notes).
 */

const CampaignData = (function () {
    const STORAGE_KEY = 'world_of_myrdae_data';
    let data = {
        locations: [],
        roads: [],
        regions: [],
        notes: {}
    };
    let syncListenersBound = false;
    let pollingIntervalId = null;
    let storageListener = null;
    let unloadListener = null;

    // Configuration
    let USE_LOCAL_STORAGE = false; // Set to true to persist manual edits in browser

    // Use BroadcastChannel for more reliable cross-tab sync (works better with file:// in some cases)
    const syncChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(STORAGE_KEY) : null;

    if (syncChannel) {
        syncChannel.onmessage = (event) => {
            if (event.data) {
                data = event.data;
                console.log('Campaign data synced via BroadcastChannel.');
                document.dispatchEvent(new CustomEvent('campaign-data-updated', { detail: data }));
                document.dispatchEvent(new CustomEvent('metric-changed', { detail: data }));
            }
        };
    }

    /**
     * Initialize data
     * 1. Check localStorage
     * 2. If valid, use it
     * 3. Else, fetch default JSON
     */
    async function init() {
        if (USE_LOCAL_STORAGE) {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    data = JSON.parse(stored);
                    console.log('Loaded World of Myrdae data from localStorage');
                } catch (e) {
                    console.error('Failed to parse stored data', e);
                    await loadDefaults();
                }
            } else {
                await loadDefaults();
            }
        } else {
            // Default: Load directly from files without checking localStorage
            await loadDefaults();
            console.log('Running in Static Mode (LocalStorage Disabled)');
        }

        // Listen for changes from other windows/tabs (idempotent across re-init calls)
        if (!syncListenersBound) {
            storageListener = (e) => {
                if (e.key === STORAGE_KEY && e.newValue) {
                    try {
                        const newData = JSON.parse(e.newValue);
                        if (JSON.stringify(newData) !== JSON.stringify(data)) {
                            data = newData;
                            console.log('Campaign data synced from another window (storage event).');
                            triggerUpdate();
                        }
                    } catch (err) {
                        console.error('Failed to sync cross-window data:', err);
                    }
                }
            };
            window.addEventListener('storage', storageListener);

            // Only poll on file:// where storage events and BroadcastChannel are unreliable.
            const needsPolling = !syncChannel || (typeof location !== 'undefined' && location.protocol === 'file:');
            if (needsPolling) {
                let lastKnownStorage = localStorage.getItem(STORAGE_KEY);
                pollingIntervalId = setInterval(() => {
                    const currentStorage = localStorage.getItem(STORAGE_KEY);
                    if (currentStorage !== lastKnownStorage) {
                        lastKnownStorage = currentStorage;
                        try {
                            data = JSON.parse(currentStorage);
                            console.log('Campaign data synced from another window (polling).');
                            triggerUpdate();
                        } catch (err) {
                            console.error('Failed to sync data via polling:', err);
                        }
                    }
                }, 2000);
            }

            unloadListener = () => destroy();
            window.addEventListener('beforeunload', unloadListener);

            syncListenersBound = true;
        }

        return data;
    }

    function destroy() {
        if (pollingIntervalId !== null) {
            clearInterval(pollingIntervalId);
            pollingIntervalId = null;
        }
        if (storageListener) {
            window.removeEventListener('storage', storageListener);
            storageListener = null;
        }
        if (unloadListener) {
            window.removeEventListener('beforeunload', unloadListener);
            unloadListener = null;
        }
        syncListenersBound = false;
    }

    function triggerUpdate() {
        document.dispatchEvent(new CustomEvent('campaign-data-updated', { detail: data }));
        document.dispatchEvent(new CustomEvent('metric-changed', { detail: data }));
    }

    function validateWorldLocations(world) {
        const issues = [];
        const locations = Array.isArray(world.locations) ? world.locations : [];
        const roads = Array.isArray(world.roads) ? world.roads : [];
        const seenIds = new Set();
        const validIds = new Set();

        locations.forEach((loc, index) => {
            if (!loc || typeof loc !== 'object') {
                issues.push(`locations[${index}] is not an object`);
                return;
            }
            if (!loc.id) {
                issues.push(`locations[${index}] (${loc.name || 'unnamed'}) is missing id`);
            } else if (seenIds.has(loc.id)) {
                issues.push(`Duplicate location id: ${loc.id}`);
            } else {
                seenIds.add(loc.id);
                validIds.add(loc.id);
            }
            if (!loc.name) issues.push(`location ${loc.id || `[${index}]`} is missing name`);
            if (typeof loc.x !== 'number' || typeof loc.y !== 'number') {
                issues.push(`location ${loc.id || `[${index}]`} has non-numeric x/y`);
            } else if (loc.x < 0 || loc.x > 100 || loc.y < 0 || loc.y > 100) {
                issues.push(`location ${loc.id} has out-of-bounds coords (${loc.x}, ${loc.y})`);
            }
        });

        roads.forEach((road, index) => {
            if (!road || !Array.isArray(road.points)) return;
            road.points.forEach((point, pIdx) => {
                if (typeof point === 'string' && !validIds.has(point)) {
                    issues.push(`road "${road.id || `[${index}]`}" references unknown location id "${point}" at points[${pIdx}]`);
                }
            });
        });

        return issues;
    }

    async function loadDefaults() {
        // Use embedded data from locations-db.js
        if (typeof WORLD_LOCATIONS !== 'undefined') {
            const issues = validateWorldLocations(WORLD_LOCATIONS);
            if (issues.length) {
                console.warn(`[CampaignData] WORLD_LOCATIONS has ${issues.length} validation issue(s):`);
                issues.slice(0, 25).forEach((msg) => console.warn('  •', msg));
                if (issues.length > 25) console.warn(`  ...and ${issues.length - 25} more`);
            }
            const prep = (arr) => (arr || []).map(item => ({ ...item, fromDefault: true }));
            data = {
                locations: prep(WORLD_LOCATIONS.locations),
                roads: prep(WORLD_LOCATIONS.roads),
                regions: prep(WORLD_LOCATIONS.regions),
                notes: {}
            };
            if (USE_LOCAL_STORAGE) save();
            console.log('Initialized data from embedded WORLD_LOCATIONS');
        } else {
            console.error('WORLD_LOCATIONS not found. Ensure js/locations-db.js is loaded.');
        }
    }

    function save() {
        if (USE_LOCAL_STORAGE) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }

        // Broadcast to other windows
        if (syncChannel) {
            syncChannel.postMessage(data);
        }

        // Dispatch events for local window
        triggerUpdate();
    }

    function getData() {
        return data;
    }

    function reset() {
        localStorage.removeItem(STORAGE_KEY);
        return init(); // Reload defaults
    }

    // --- Location Methods ---

    function getLocations() {
        return data.locations;
    }

    function getLocation(id) {
        return data.locations.find(l => l.id === id);
    }

    function updateLocation(id, updates) {
        const index = data.locations.findIndex(l => l.id === id);
        if (index !== -1) {
            data.locations[index] = { ...data.locations[index], ...updates };
            save();
            return data.locations[index];
        }
        return null;
    }

    function addLocation(location) {
        // Ensure ID
        if (!location.id) {
            location.id = location.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }
        data.locations.push(location);
        save();
        return location;
    }

    // --- Road Methods ---

    function getRoads() {
        return data.roads;
    }

    function addRoad(road) {
        if (!road.id) {
            road.id = 'road-' + Date.now();
        }
        data.roads.push(road);
        save();
        return road;
    }


    // --- Public API ---
    return {
        init,
        destroy,
        save,
        reset,
        getData,
        getLocations,
        getLocation,
        updateLocation,
        addLocation,
        getRoads,
        addRoad
    };
})();
