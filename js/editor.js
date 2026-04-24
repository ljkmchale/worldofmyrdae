/**
 * Map Editor Logic
 */

const Editor = (function () {
    let state = {
        tab: 'locations',
        selectedLocId: null,
        selectedRoadId: null,
        locations: [],
        roads: [],
        regions: [],
        locationDraft: null,
        locationDraftOriginalId: null,
        roadDraft: null,
        roadDraftOriginalId: null,
        editingWaypointIndex: null,
        undoStack: [],
        redoStack: [],
        regionFilter: '',
        typeFilter: '',
        roadRegionFilter: '',
        locationPlacementMode: false,
        moveLocationMode: false,
        isNewPreview: false
    };

    function cloneData(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function getLocationById(id) {
        return state.locations.find(location => location.id === id) || null;
    }

    function getRoadById(id) {
        return state.roads.find(road => road.id === id) || null;
    }

    function setActionMessage(id, text, isError = false) {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = text || '';
        el.style.color = text ? (isError ? '#ff9b8f' : '#8f8576') : '#8f8576';
    }

    function flashButton(id, html, successColor = '#0a0') {
        const btn = document.getElementById(id);
        if (!btn) return;
        const originalHtml = btn.innerHTML;
        const originalBackground = btn.style.background;
        btn.innerHTML = html;
        btn.style.background = successColor;
        setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.style.background = originalBackground;
        }, 2000);
    }

    function getRenderableLocations() {
        const locations = cloneData(state.locations);
        if (!state.locationDraft) return locations;

        if (state.selectedLocId === '__preview__') {
            locations.push({ ...cloneData(state.locationDraft), id: '__preview__', _ghost: true });
            return locations;
        }

        const originalId = state.locationDraftOriginalId || state.selectedLocId;
        const idx = locations.findIndex(location => location.id === originalId);
        if (idx !== -1) {
            locations[idx] = cloneData(state.locationDraft);
        }
        return locations;
    }

    function getRenderableRoads() {
        const roads = cloneData(state.roads);
        if (!state.roadDraft || !state.selectedRoadId) return roads;

        const originalId = state.roadDraftOriginalId || state.selectedRoadId;
        const idx = roads.findIndex(road => road.id === originalId);
        if (idx !== -1) {
            roads[idx] = cloneData(state.roadDraft);
        }
        return roads;
    }

    function getRenderState() {
        return {
            ...state,
            locations: getRenderableLocations(),
            roads: getRenderableRoads()
        };
    }

    function syncCampaignDataBridge() {
        const renderState = getRenderState();
        window.CampaignData = {
            init: async () => renderState,
            getData: () => renderState,
            getLocations: () => renderState.locations,
            getRoads: () => renderState.roads
        };
        return renderState;
    }

    function syncLocationDraftFromState() {
        if (!state.selectedLocId || state.selectedLocId === '__preview__') return;
        const location = getLocationById(state.selectedLocId);
        if (location) {
            state.locationDraft = cloneData(location);
            state.locationDraftOriginalId = location.id;
        }
    }

    function syncRoadDraftFromState() {
        if (!state.selectedRoadId) return;
        const road = getRoadById(state.selectedRoadId);
        if (road) {
            state.roadDraft = cloneData(road);
            state.roadDraftOriginalId = road.id;
        }
    }

    /** Initialize Editor State */
    async function init() {
        // Copy the original WORLD_LOCATIONS locally to manipulate
        if (typeof WORLD_LOCATIONS !== 'undefined') {
            state.locations = cloneData(WORLD_LOCATIONS.locations || []);
            state.roads = cloneData(WORLD_LOCATIONS.roads || []);
            state.regions = cloneData(WORLD_LOCATIONS.regions || []);
        } else {
            console.warn("WORLD_LOCATIONS not found. Creating empty map.");
        }

        syncCampaignDataBridge();

        // Broadcast the initial load to map-overlay
        document.dispatchEvent(new CustomEvent('campaign-data-updated', { detail: getRenderState() }));

        renderLists();
        updateLocationPlacementUI();

        // --- Keyboard shortcuts ---
        document.addEventListener('keydown', (e) => {
            const tag = document.activeElement?.tagName?.toLowerCase();
            const inInput = ['input', 'textarea', 'select'].includes(tag);
            const searchInput = document.getElementById('location-search');

            if (!inInput && e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                if (state.tab !== 'locations') {
                    switchTab('locations');
                }
                if (searchInput) {
                    requestAnimationFrame(() => {
                        searchInput.focus();
                        searchInput.select();
                    });
                }
                return;
            }

            // Ctrl/Cmd+Z → undo
            if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
                e.preventDefault();
                undo();
                return;
            }
            // Ctrl/Cmd+Y or Ctrl/Cmd+Shift+Z → redo
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
                e.preventDefault();
                redo();
                return;
            }
            // Ctrl/Cmd+S → save current form
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (state.tab === 'locations' && document.getElementById('location-form-area').style.display !== 'none') {
                    saveLocation();
                } else if (state.tab === 'roads' && state.selectedRoadId) {
                    saveRoad();
                }
                return;
            }
            // Esc → cancel (only when not focused in a form field)
            if (e.key === 'Escape' && !inInput) {
                if (state.tab === 'locations') cancelLocation();
                else if (state.tab === 'roads') cancelRoad();
                return;
            }
            // Arrow keys → nudge selected location x/y (only when not typing in a field)
            if (!inInput && state.tab === 'locations' && state.selectedLocId &&
                document.getElementById('location-form-area').style.display !== 'none') {
                const step = e.shiftKey ? 1.0 : 0.1;
                const xEl = document.getElementById('loc-x');
                const yEl = document.getElementById('loc-y');
                if (!xEl || !yEl) return;
                if (e.key === 'ArrowLeft')  { e.preventDefault(); xEl.value = (parseFloat(xEl.value) - step).toFixed(2); previewLocation(); }
                else if (e.key === 'ArrowRight') { e.preventDefault(); xEl.value = (parseFloat(xEl.value) + step).toFixed(2); previewLocation(); }
                else if (e.key === 'ArrowUp')   { e.preventDefault(); yEl.value = (parseFloat(yEl.value) - step).toFixed(2); previewLocation(); }
                else if (e.key === 'ArrowDown') { e.preventDefault(); yEl.value = (parseFloat(yEl.value) + step).toFixed(2); previewLocation(); }
            }
        });
    }

    function switchTab(tabName) {
        state.tab = tabName;
        document.querySelectorAll('.editor-tab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');

        document.querySelector(`button[onclick="Editor.switchTab('${tabName}')"]`).classList.add('active');
        document.getElementById(`tab-${tabName}`).style.display = 'block';

        if (tabName === 'locations') {
            const s = document.getElementById('location-search');
            if (s) s.value = '';
            updateLocationPlacementUI();
            renderLocationList();
        } else if (tabName === 'roads') {
            const s = document.getElementById('road-search');
            if (s) s.value = '';
            const roadRegionSel = document.getElementById('road-region-filter');
            if (roadRegionSel) roadRegionSel.value = state.roadRegionFilter || '';
            renderRoadList();
        }
    }

    // --- Map Interactions ---

    function handleMapClick(x, y) {
        if (state.tab === 'locations') {
            // Only placement mode or an unsaved preview should react to map clicks.
            if (state.selectedLocId === '__preview__') {
                // Reposition the unsaved preview marker while placing a new location.
                document.getElementById('loc-x').value = x.toFixed(1);
                document.getElementById('loc-y').value = y.toFixed(1);
                previewLocation();
            } else if (state.locationPlacementMode) {
                // Start new location
                newLocation(x, y);
            } else {
                return;
            }
        } else if (state.tab === 'roads') {
            if (state.selectedRoadId) {
                const road = state.roads.find(r => r.id === state.selectedRoadId);
                if (road) {
                    if (!road.points) road.points = [];

                    // If editing a waypoint, update it instead of adding new
                    if (state.editingWaypointIndex !== null && state.editingWaypointIndex > 0 && state.editingWaypointIndex < road.points.length - 1) {
                        road.points[state.editingWaypointIndex] = [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
                        state.editingWaypointIndex = null;
                        renderRoadPoints(road.points);
                        syncRoadDraftFromState();
                        refreshMap();
                        saveRoad(false, { validateComplete: false, showFeedback: false });
                        return;
                    }

                    // Check if we need start/end locations first
                    const needsStart = road.points.length === 0 || typeof road.points[0] !== 'string';
                    const needsEnd = road.points.length === 0 || typeof road.points[road.points.length - 1] !== 'string';

                    if (needsStart) {
                        // Silently return - user needs to set start location first
                        return;
                    }

                    // Add intermediate waypoint (coordinate array)
                    const point = [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
                    // Insert before the end location
                    if (road.points.length > 0 && typeof road.points[road.points.length - 1] === 'string') {
                        road.points.splice(road.points.length - 1, 0, point);
                    } else {
                        road.points.push(point);
                    }

                    renderRoadPoints(road.points);
                    syncRoadDraftFromState();
                    refreshMap();
                    // Auto-save to ensure points are persisted
                    saveRoad(false, { validateComplete: false, showFeedback: false });
                }
            }
        }
    }

    function handleLocationClick(locationId) {
        if (state.tab === 'roads' && state.selectedRoadId) {
            const road = state.roads.find(r => r.id === state.selectedRoadId);
            if (road) {
                if (!road.points) road.points = [];

                const needsStart = road.points.length === 0 || typeof road.points[0] !== 'string';
                const needsEnd = road.points.length === 0 || typeof road.points[road.points.length - 1] !== 'string';

                if (needsStart) {
                    // Set as start location
                    road.points.unshift(locationId);
                    document.getElementById('road-start-location').value = locationId;
                } else if (needsEnd) {
                    // Set as end location
                    road.points.push(locationId);
                    document.getElementById('road-end-location').value = locationId;
                } else {
                    // Automatically replace END location (most common case)
                    road.points[road.points.length - 1] = locationId;
                    document.getElementById('road-end-location').value = locationId;
                }

                renderRoadPoints(road.points);
                syncRoadDraftFromState();
                refreshMap();
                saveRoad(false, { validateComplete: false, showFeedback: false });
            } else {
                // Silently return - user needs to create/select a road first
            }
        }
    }

    // --- Locations ---

    // --- Undo / Redo ---

    function pushUndo() {
        state.undoStack.push({
            locations: cloneData(state.locations),
            roads: cloneData(state.roads)
        });
        if (state.undoStack.length > 50) state.undoStack.shift();
        state.redoStack = [];
        updateUndoButtons();
    }

    function undo() {
        if (state.undoStack.length === 0) return;
        state.redoStack.push({
            locations: cloneData(state.locations),
            roads: cloneData(state.roads)
        });
        const prev = state.undoStack.pop();
        state.locations = prev.locations;
        state.roads = prev.roads;
        syncLocationDraftFromState();
        syncRoadDraftFromState();
        renderLists();
        refreshMap();
        exportData().catch(console.error);
        updateUndoButtons();
    }

    function redo() {
        if (state.redoStack.length === 0) return;
        state.undoStack.push({
            locations: cloneData(state.locations),
            roads: cloneData(state.roads)
        });
        const next = state.redoStack.pop();
        state.locations = next.locations;
        state.roads = next.roads;
        syncLocationDraftFromState();
        syncRoadDraftFromState();
        renderLists();
        refreshMap();
        exportData().catch(console.error);
        updateUndoButtons();
    }

    function updateUndoButtons() {
        const undoBtn = document.getElementById('btn-undo');
        const redoBtn = document.getElementById('btn-redo');
        if (undoBtn) {
            undoBtn.disabled = state.undoStack.length === 0;
            const n = state.undoStack.length;
            undoBtn.title = n === 0
                ? 'Nothing to undo'
                : `Undo (Ctrl+Z) · ${n} step${n !== 1 ? 's' : ''} available`;
        }
        if (redoBtn) {
            redoBtn.disabled = state.redoStack.length === 0;
            const m = state.redoStack.length;
            redoBtn.title = m === 0
                ? 'Nothing to redo'
                : `Redo (Ctrl+Y) · ${m} step${m !== 1 ? 's' : ''} available`;
        }
    }

    function renderLists() {
        renderLocationList();
        renderRoadList();
        updateLocationDropdowns();
        populateRegionFilter();
        populateTypeFilter();
        populateRoadRegionFilter();
    }

    function renderLocationList(filter = '') {
        const list = document.getElementById('location-list');
        const q = filter.trim().toLowerCase();
        const regionQ = state.regionFilter;
        const typeQ = state.typeFilter;
        list.innerHTML = '<option value="">-- Select a Location --</option>';

        // Group locations by type
        const typeOrder = ['capital', 'city', 'small-city', 'town', 'village', 'port', 'poi', 'landmark', 'ruins', 'region', 'water', 'river'];
        const typeLabels = {
            capital: 'Capitals', city: 'Cities (Large)', 'small-city': 'Cities (Small)', town: 'Towns', village: 'Villages',
            port: 'Ports', poi: 'Points of Interest', landmark: 'Landmarks',
            ruins: 'Ruins', region: 'Region Labels', water: 'Water Labels', river: 'River Labels'
        };

        // Filter first, then group — apply both text search and region filter
        const visible = (q || regionQ || typeQ)
            ? state.locations.filter(loc =>
                (!regionQ || (loc.region || '') === regionQ) &&
                (!typeQ || (loc.type || '') === typeQ) &&
                (!q || (loc.name || '').toLowerCase().includes(q) ||
                        (loc.id || '').toLowerCase().includes(q) ||
                        (loc.type || '').toLowerCase().includes(q) ||
                        (loc.region || '').toLowerCase().includes(q)))
            : state.locations;

        const grouped = {};
        visible.forEach(loc => {
            const type = loc.type || 'other';
            if (!grouped[type]) grouped[type] = [];
            grouped[type].push(loc);
        });

        // Sort each group alphabetically
        Object.values(grouped).forEach(arr => arr.sort((a, b) => (a.name || '').localeCompare(b.name || '')));

        // Render in type order, then any remaining types
        const renderedTypes = new Set();
        const renderGroup = (type) => {
            if (!grouped[type] || renderedTypes.has(type)) return;
            renderedTypes.add(type);
            const label = typeLabels[type] || (type.charAt(0).toUpperCase() + type.slice(1));
            const optgroup = document.createElement('optgroup');
            optgroup.label = q ? `── ${label} ──` : `── ${label} ──`;
            grouped[type].forEach(loc => {
                const opt = document.createElement('option');
                opt.value = loc.id;
                opt.textContent = loc.name || loc.id;
                if (state.selectedLocId === loc.id) opt.selected = true;
                optgroup.appendChild(opt);
            });
            list.appendChild(optgroup);
        };

        typeOrder.forEach(renderGroup);
        // Any types not in typeOrder
        Object.keys(grouped).forEach(renderGroup);
    }

    function filterLocationList(query) {
        renderLocationList(query);
    }

    function focusLocationOnMap(loc, targetScale = 4) {
        if (!loc || loc.x === undefined || loc.y === undefined) return;

        const applyFocus = () => {
            const currentState = MapController.getInstanceState('map-container');
            const desiredScale = Math.max(currentState?.scale || 1, targetScale);
            MapController.panToLocation('map-container', loc.x, loc.y, desiredScale);
        };

        applyFocus();
        requestAnimationFrame(applyFocus);
        setTimeout(applyFocus, 120);
    }

    function selectLocation(id) {
        state.selectedLocId = id;
        state.locationPlacementMode = false;
        state.moveLocationMode = false;
        updateLocationPlacementUI();
        const loc = getLocationById(id);
        if (!loc) return;
        state.locationDraft = cloneData(loc);
        state.locationDraftOriginalId = loc.id;
        setActionMessage('location-form-message', '');

        document.getElementById('location-form-area').style.display = 'block';
        document.getElementById('form-title').textContent = 'Edit Location';
        document.getElementById('btn-del-loc').style.display = 'inline-block';

        // Sync dropdown
        const list = document.getElementById('location-list');
        if (list) list.value = id;

        // Populate form
        document.getElementById('loc-id').value = loc.id || '';
        document.getElementById('loc-name').value = (loc.name || '').replace(/\n/g, '\\n'); // un-escape newlines for editing
        document.getElementById('loc-x').value = loc.x || 0;
        document.getElementById('loc-y').value = loc.y || 0;
        document.getElementById('loc-type').value = loc.type || 'town';
        document.getElementById('loc-region').value = loc.region || '';
        document.getElementById('loc-biome').value = loc.biome || '';
        document.getElementById('loc-desc').value = loc.description || '';
        document.getElementById('loc-details').value = loc.details || '';
        document.getElementById('loc-link').value = loc.link || '';
        document.getElementById('loc-cityMap').value = loc.cityMap || '';

        // Advanced
        document.getElementById('loc-fontFamily').value = loc.fontFamily || '';
        document.getElementById('loc-fontSize').value = loc.fontSize || '';
        document.getElementById('loc-fontWeight').value = loc.fontWeight || '';
        document.getElementById('loc-fontStyle').value = loc.fontStyle || '';
        document.getElementById('loc-markerSize').value = loc.markerSize !== undefined ? loc.markerSize : 0.25;
        document.getElementById('loc-markerOffsetX').value = loc.markerOffsetX || 0;
        document.getElementById('loc-markerOffsetY').value = loc.markerOffsetY || 0;
        document.getElementById('loc-labelOffsetX').value = loc.labelOffsetX || '';
        document.getElementById('loc-labelOffsetY').value = loc.labelOffsetY || '';
        document.getElementById('loc-labelAlign').value = loc.labelAlign || '';
        document.getElementById('loc-rotation').value = loc.rotation || '';
        document.getElementById('loc-textCurve').value = loc.textCurve !== undefined ? loc.textCurve : '';
        document.getElementById('loc-opacity').value = loc.opacity !== undefined ? loc.opacity : '';
        document.getElementById('loc-hideLabel').checked = !!loc.hideLabel;

        // Pan map to the selected location
        if (loc.x !== undefined && loc.y !== undefined) {
            focusLocationOnMap(loc, 4);
        }
    }

    function newLocation(x, y) {
        state.selectedLocId = '__preview__';
        state.isNewPreview = true;
        state.locationPlacementMode = false;
        state.moveLocationMode = false;
        state.locationDraftOriginalId = null;
        updateLocationPlacementUI();
        document.getElementById('location-form-area').style.display = 'block';
        document.getElementById('form-title').textContent = 'New Location';
        document.getElementById('btn-del-loc').style.display = 'none';
        setActionMessage('location-form-message', 'Previewing a new location. Save when it looks right.');

        // Clear dropdown
        const list = document.getElementById('location-list');
        if (list) list.value = '';

        // Clear form
        document.getElementById('loc-id').value = '';
        document.getElementById('loc-name').value = 'New Location';
        document.getElementById('loc-x').value = x !== undefined ? x.toFixed(1) : 50;
        document.getElementById('loc-y').value = y !== undefined ? y.toFixed(1) : 50;
        document.getElementById('loc-type').value = 'town';
        document.getElementById('loc-region').value = '';
        document.getElementById('loc-biome').value = '';
        document.getElementById('loc-desc').value = '';
        document.getElementById('loc-details').value = '';
        document.getElementById('loc-link').value = '';
        document.getElementById('loc-cityMap').value = '';

        document.getElementById('loc-fontFamily').value = '';
        document.getElementById('loc-fontSize').value = '';
        document.getElementById('loc-fontWeight').value = '';
        document.getElementById('loc-fontStyle').value = '';
        document.getElementById('loc-markerSize').value = '0.25';
        document.getElementById('loc-markerOffsetX').value = '0';
        document.getElementById('loc-markerOffsetY').value = '0';
        document.getElementById('loc-labelOffsetX').value = '';
        document.getElementById('loc-labelOffsetY').value = '';
        document.getElementById('loc-labelAlign').value = '';
        document.getElementById('loc-rotation').value = '';
        document.getElementById('loc-textCurve').value = '';
        document.getElementById('loc-opacity').value = '';
        document.getElementById('loc-hideLabel').checked = false;

        state.locationDraft = {
            id: '__preview__', name: 'New Location', type: 'town',
            x: x !== undefined ? parseFloat(x.toFixed(1)) : 50,
            y: y !== undefined ? parseFloat(y.toFixed(1)) : 50,
            _ghost: true
        };
        _debouncedRefresh();
    }

    function validateLocationData(locData) {
        if (!locData.name || !locData.name.trim()) {
            return 'Location name is required.';
        }
        if (!locData.id || !locData.id.trim()) {
            return 'Location ID could not be generated. Add a name or ID.';
        }
        if (!Number.isFinite(locData.x) || locData.x < 0 || locData.x > 100) {
            return 'X coordinate must be between 0 and 100.';
        }
        if (!Number.isFinite(locData.y) || locData.y < 0 || locData.y > 100) {
            return 'Y coordinate must be between 0 and 100.';
        }

        const originalId = state.locationDraftOriginalId || (state.selectedLocId !== '__preview__' ? state.selectedLocId : null);
        const duplicate = state.locations.find(location => location.id === locData.id && location.id !== originalId);
        if (duplicate) {
            return `Location ID "${locData.id}" already exists.`;
        }
        return '';
    }

    function getLocationFromForm() {
        const rawName = document.getElementById('loc-name').value;
        const name = rawName.replace(/\\n/g, '\n');

        let id = document.getElementById('loc-id').value;
        if (!id) {
            const isPreview = state.selectedLocId === '__preview__';
            id = (state.selectedLocId && !isPreview) ? state.selectedLocId : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }

        const locType = document.getElementById('loc-type').value;
        const _lt = locType.toLowerCase();
        const isSettlement = ['city', 'small-city', 'town', 'capital'].includes(_lt);
        const isTown     = _lt === 'town';
        const isCity     = _lt === 'city' || _lt === 'small-city' || _lt === 'capital';
        const isPoi      = ['poi', 'landmark', 'ruins'].includes(_lt);
        const isRiver    = _lt === 'river';
        const isLandmark = _lt === 'landmark';
        const isWater    = _lt === 'water';
        const isNature   = _lt === 'nature';
        const isRegion   = _lt === 'region';

        let defaultDesc = "";
        if (isTown) defaultDesc = "Town";
        else if (isCity) defaultDesc = "City";
        else if (isPoi) defaultDesc = "Point of Interest";
        else if (isRiver) defaultDesc = "Nature";
        else if (isNature) defaultDesc = "Nature";

        const originalId = state.locationDraftOriginalId || (state.selectedLocId !== '__preview__' ? state.selectedLocId : null);
        const baseLocation = cloneData(
            state.locationDraft ||
            (originalId ? getLocationById(originalId) : null) ||
            {}
        );
        delete baseLocation._ghost;

        const locData = {
            ...baseLocation,
            id: id,
            name: name,
            type: locType,
            x: parseFloat(document.getElementById('loc-x').value) || 0,
            y: parseFloat(document.getElementById('loc-y').value) || 0,
            region: document.getElementById('loc-region').value,
            description: document.getElementById('loc-desc').value || defaultDesc
        };

        const biome = document.getElementById('loc-biome').value;
        if (biome) locData.biome = biome;
        else delete locData.biome;

        const details = document.getElementById('loc-details').value;
        if (details) locData.details = details;
        else delete locData.details;

        const link = document.getElementById('loc-link').value.trim();
        if (link) locData.link = link;
        else delete locData.link;

        const cityMap = document.getElementById('loc-cityMap').value;
        if (cityMap) locData.cityMap = cityMap;
        else delete locData.cityMap;

        const setIf = (key, val, parseFn, defaultVal = undefined) => {
            if (val !== '') {
                locData[key] = parseFn ? parseFn(val) : val;
            } else if (defaultVal !== undefined) {
                locData[key] = defaultVal;
            } else {
                delete locData[key];
            }
        };

        // Font family defaults by type
        const defaultFontFamily =
            isSettlement          ? "Simonetta" :
            isPoi                 ? "Simonetta" :
            isRiver               ? "Simonetta" :
            isWater               ? "Quintessential" :
            isNature              ? "Sell Your Soul" :
            isRegion              ? "Sell Your Soul" :
            undefined;

        // Font style defaults by type
        const defaultFontStyle =
            isSettlement          ? "Normal" :
            isPoi                 ? "Italic" :
            isRiver               ? "Italic" :
            isWater               ? "Normal" :
            isNature              ? "Normal" :
            isRegion              ? "Normal" :
            "Normal";

        setIf('fontFamily', document.getElementById('loc-fontFamily').value, null, defaultFontFamily);
        setIf('fontSize', document.getElementById('loc-fontSize').value, parseInt,
            isSettlement || isPoi || isRiver ? 14 : (isNature || isRegion || isWater ? 12 : undefined));
        setIf('fontWeight', document.getElementById('loc-fontWeight').value, null,
            isSettlement || isPoi || isNature || isRegion || isWater || isRiver ? "300" : undefined);
        setIf('fontStyle', document.getElementById('loc-fontStyle').value, null, defaultFontStyle);
        setIf('markerSize', document.getElementById('loc-markerSize').value, parseFloat, 0.25);
        setIf('markerOffsetX', document.getElementById('loc-markerOffsetX').value, parseInt,
            isSettlement || isPoi || isNature || isRegion || isWater || isRiver ? 16 : undefined);
        setIf('markerOffsetY', document.getElementById('loc-markerOffsetY').value, parseInt,
            isSettlement || isPoi || isNature || isRegion || isWater || isRiver ? 0 : undefined);
        setIf('labelOffsetX', document.getElementById('loc-labelOffsetX').value, parseInt,
            isSettlement ? 10 : (isPoi || isNature || isRegion || isWater || isRiver ? 0 : undefined));
        setIf('labelOffsetY', document.getElementById('loc-labelOffsetY').value, parseInt,
            isTown ? 3 : (isCity ? 5 : (isPoi || isNature || isRegion || isWater || isRiver ? 0 : undefined)));
        const labelAlign = document.getElementById('loc-labelAlign').value;
        if (labelAlign) locData.labelAlign = labelAlign;
        setIf('rotation', document.getElementById('loc-rotation').value, parseInt);
        setIf('textCurve', document.getElementById('loc-textCurve').value, parseFloat);
        setIf('opacity', document.getElementById('loc-opacity').value, parseFloat,
            isPoi || isRiver || isWater ? 0.5 : (isNature || isRegion ? 1 : undefined));

        if (document.getElementById('loc-hideLabel').checked) {
            locData.hideLabel = true;
        } else {
            delete locData.hideLabel;
        }

        return locData;
    }

    // Debounce helper for live preview
    let _previewTimer = null;
    function _debouncedRefresh() {
        if (_previewTimer) clearTimeout(_previewTimer);
        _previewTimer = setTimeout(() => {
            refreshMap();
            _previewTimer = null;
        }, 80);
    }

    function previewLocation() {
        if (!state.selectedLocId) return;
        const locData = getLocationFromForm();
        state.locationDraft = state.selectedLocId === '__preview__'
            ? { ...locData, id: '__preview__', _ghost: true }
            : locData;
        setActionMessage('location-form-message', state.selectedLocId === '__preview__'
            ? 'Previewing a new location. Save when it looks right.'
            : 'Previewing changes. Save to commit or Cancel to revert.');
        _debouncedRefresh();
    }

    function saveLocation(skipListRender = false) {
        const locData = getLocationFromForm();
        const validationError = validateLocationData(locData);
        if (validationError) {
            setActionMessage('location-form-message', validationError, true);
            return false;
        }

        if (!skipListRender) pushUndo();
        const id = locData.id;

        if (state.selectedLocId === '__preview__') {
            state.locations.push(locData);
            state.selectedLocId = id;
            state.isNewPreview = false;
        } else if (state.selectedLocId) {
            const originalId = state.locationDraftOriginalId || state.selectedLocId;
            const idx = state.locations.findIndex(l => l.id === originalId);
            if (idx !== -1) {
                state.locations[idx] = locData;
            }
        } else {
            state.locations.push(locData);
            state.selectedLocId = id;
        }

        state.locationDraft = cloneData(locData);
        state.locationDraftOriginalId = id;

        document.getElementById('loc-id').value = id;

        if (!skipListRender) {
            document.getElementById('btn-del-loc').style.display = 'inline-block';
            renderLocationList();
        }

        setActionMessage('location-form-message', 'Location saved.');
        flashButton('btn-save-location', '<i class="fa-solid fa-check"></i> Saved!');

        refreshMap();

        // Auto-save to disk
        exportData().catch(err => {
            console.error('Failed to auto-save to disk:', err);
        });
        return true;
    }

    function deleteLocation() {
        if (!state.selectedLocId) return;
        if (confirm('Are you sure you want to delete this location?')) {
            pushUndo();
            state.locations = state.locations.filter(l => l.id !== state.selectedLocId);
            state.locationDraft = null;
            state.locationDraftOriginalId = null;
            cancelLocation();
            refreshMap();
            exportData().catch(err => console.error('Failed to auto-save to disk:', err));
        }
    }

    function cancelLocation() {
        state.isNewPreview = false;
        state.selectedLocId = null;
        state.locationPlacementMode = false;
        state.moveLocationMode = false;
        state.locationDraft = null;
        state.locationDraftOriginalId = null;
        document.getElementById('location-form-area').style.display = 'none';
        setActionMessage('location-form-message', '');

        // Clear dropdown
        const list = document.getElementById('location-list');
        if (list) list.value = '';

        renderLocationList();
        _debouncedRefresh();
        updateLocationPlacementUI();
    }

    function updateLocationPlacementUI() {
        const btn = document.getElementById('btn-new-location');
        const moveBtn = document.getElementById('btn-move-location');
        const hint = document.getElementById('location-placement-hint');
        const hasSavedSelection = !!state.selectedLocId && state.selectedLocId !== '__preview__';
        if (btn) {
            btn.classList.toggle('btn-secondary', state.locationPlacementMode);
            btn.classList.toggle('btn-primary', !state.locationPlacementMode);
            btn.innerHTML = state.locationPlacementMode
                ? '<i class="fa-solid fa-ban"></i> Cancel Placement'
                : '<i class="fa-solid fa-plus"></i> New Location';
        }
        if (moveBtn) {
            moveBtn.disabled = !hasSavedSelection;
            moveBtn.classList.toggle('btn-primary', state.moveLocationMode && hasSavedSelection);
            moveBtn.classList.toggle('btn-secondary', !state.moveLocationMode || !hasSavedSelection);
            moveBtn.innerHTML = state.moveLocationMode
                ? '<i class="fa-solid fa-ban"></i> Cancel Move'
                : '<i class="fa-solid fa-up-down-left-right"></i> Move Location';
            moveBtn.title = hasSavedSelection
                ? 'Arm drag-and-drop repositioning for the selected location'
                : 'Select an existing saved location first';
        }
        if (hint) {
            hint.textContent = state.locationPlacementMode
                ? 'Placement mode is on. Click anywhere on the map to place the new location.'
                : state.moveLocationMode
                    ? 'Move mode is on. Drag the selected location on the map, then release to save its new position.'
                    : 'Placement mode is off. Clicking the map will not create or move a selected location.';
            hint.style.color = (state.locationPlacementMode || state.moveLocationMode) ? 'var(--color-gold)' : '';
        }
    }

    function toggleNewLocationMode() {
        if (state.locationPlacementMode) {
            state.locationPlacementMode = false;
            updateLocationPlacementUI();
            return;
        }

        cancelLocation();
        state.locationPlacementMode = true;
        updateLocationPlacementUI();
    }

    function toggleMoveLocationMode() {
        const hasSavedSelection = !!state.selectedLocId && state.selectedLocId !== '__preview__';
        if (!hasSavedSelection) return;

        state.locationPlacementMode = false;
        state.moveLocationMode = !state.moveLocationMode;
        updateLocationPlacementUI();
    }

    function beginLocationMove(locationId) {
        const hasSavedSelection = !!state.selectedLocId && state.selectedLocId !== '__preview__';
        if (!hasSavedSelection || !state.moveLocationMode) return false;
        if (locationId !== state.selectedLocId) return false;
        pushUndo();
        return true;
    }

    function moveSelectedLocationPreview(x, y) {
        const hasSavedSelection = !!state.selectedLocId && state.selectedLocId !== '__preview__';
        if (!hasSavedSelection || !state.moveLocationMode) return false;

        document.getElementById('loc-x').value = Math.max(0, Math.min(100, x)).toFixed(2);
        document.getElementById('loc-y').value = Math.max(0, Math.min(100, y)).toFixed(2);
        previewLocation();
        return true;
    }

    function finishLocationMove() {
        const hasSavedSelection = !!state.selectedLocId && state.selectedLocId !== '__preview__';
        if (!hasSavedSelection || !state.moveLocationMode) return false;

        const saved = saveLocation(true);
        if (!saved) return false;
        state.moveLocationMode = false;
        updateLocationPlacementUI();
        return true;
    }

    // --- Roads ---

    function renderRoadList(filter = '') {
        const list = document.getElementById('road-list');
        const q = filter.trim().toLowerCase();
        const regionQ = state.roadRegionFilter;
        list.innerHTML = '<option value="">-- Select a Road --</option>';

        const typeOrder = ['major', 'minor', 'river', 'water-route', 'border'];
        const typeLabels = {
            major: 'Major Roads', minor: 'Minor Roads', river: 'Rivers',
            'water-route': 'Boat Routes / Sea Lanes', border: 'Borders'
        };

        const visible = (q || regionQ)
            ? state.roads.filter(r =>
                (!regionQ || getRoadConnectedRegions(r).includes(regionQ)) &&
                (!q ||
                    (r.name || '').toLowerCase().includes(q) ||
                    (r.id || '').toLowerCase().includes(q) ||
                    (r.type || '').toLowerCase().includes(q)))
            : state.roads;

        // Group by type
        const grouped = {};
        visible.forEach(road => {
            const type = road.type || 'minor';
            if (!grouped[type]) grouped[type] = [];
            grouped[type].push(road);
        });

        // Sort alphabetically within each group
        Object.values(grouped).forEach(arr => arr.sort((a, b) => (a.name || a.id || '').localeCompare(b.name || b.id || '')));

        const renderedTypes = new Set();
        const renderGroup = (type) => {
            if (!grouped[type] || renderedTypes.has(type)) return;
            renderedTypes.add(type);
            const label = typeLabels[type] || (type.charAt(0).toUpperCase() + type.slice(1));
            const optgroup = document.createElement('optgroup');
            optgroup.label = `── ${label} ──`;
            grouped[type].forEach(road => {
                const opt = document.createElement('option');
                opt.value = road.id;
                opt.textContent = road.name || road.id;
                if (state.selectedRoadId === road.id) opt.selected = true;
                optgroup.appendChild(opt);
            });
            list.appendChild(optgroup);
        };

        typeOrder.forEach(renderGroup);
        Object.keys(grouped).forEach(renderGroup);
    }

    function filterRoadList(query) {
        renderRoadList(query);
    }

    function getRoadConnectedRegions(road) {
        if (!road || !Array.isArray(road.points)) return [];
        const regions = new Set();
        road.points.forEach(point => {
            if (typeof point !== 'string') return;
            const loc = state.locations.find(l => l.id === point);
            const region = (loc && loc.region) ? loc.region.trim() : '';
            if (region) regions.add(region);
        });
        return Array.from(regions).sort();
    }

    function getUniqueRoadRegions() {
        const regions = new Set();
        state.roads.forEach(road => {
            getRoadConnectedRegions(road).forEach(region => regions.add(region));
        });
        return Array.from(regions).sort();
    }

    function populateRoadRegionFilter() {
        const filterSel = document.getElementById('road-region-filter');
        if (!filterSel) return;

        const regions = getUniqueRoadRegions();
        const activeValue = state.roadRegionFilter || filterSel.value;
        filterSel.innerHTML = '<option value="">All Connected Regions</option>';
        regions.forEach(region => {
            const opt = document.createElement('option');
            opt.value = region;
            opt.textContent = region;
            if (region === activeValue) opt.selected = true;
            filterSel.appendChild(opt);
        });

        if (activeValue && !regions.includes(activeValue)) {
            state.roadRegionFilter = '';
        }
    }

    function filterRoadsByRegion(region) {
        state.roadRegionFilter = region;
        const badge = document.getElementById('road-region-filter-badge');
        const sel = document.getElementById('road-region-filter');
        if (badge) badge.style.display = region ? 'inline-block' : 'none';
        if (sel) sel.style.borderColor = region ? 'var(--color-gold)' : '#584433';
        renderRoadList(document.getElementById('road-search')?.value || '');
    }

    function selectRoad(id) {
        state.selectedRoadId = id;
        const road = getRoadById(id);
        if (!road) return;
        state.roadDraft = cloneData(road);
        state.roadDraftOriginalId = road.id;
        setActionMessage('road-form-message', '');

        document.getElementById('road-form-area').style.display = 'block';
        document.getElementById('road-form-title').textContent = 'Edit Road';
        document.getElementById('btn-del-road').style.display = 'inline-block';

        document.getElementById('road-id').value = road.id || '';
        document.getElementById('road-type').value = road.type || 'minor';
        document.getElementById('road-name').value = road.name || '';
        document.getElementById('road-curved').checked = (road.curved !== false);

        document.getElementById('road-color').value = road.color || '';
        document.getElementById('road-width').value = road.width !== undefined ? road.width : '';
        document.getElementById('road-dashed').value = road.dashed !== undefined ? road.dashed : '';
        document.getElementById('road-dashLength').value = road.dashLength !== undefined ? road.dashLength : '';
        document.getElementById('road-gapLength').value = road.gapLength !== undefined ? road.gapLength : '';

        // Road label typography
        document.getElementById('road-fontFamily').value = road.fontFamily || '';
        document.getElementById('road-fontSize').value = road.fontSize !== undefined ? road.fontSize : '';
        document.getElementById('road-fontWeight').value = road.fontWeight || '';
        document.getElementById('road-fontStyle').value = road.fontStyle || '';
        document.getElementById('road-labelOpacity').value = road.labelOpacity !== undefined ? road.labelOpacity : '';
        document.getElementById('road-labelOffset').value = road.labelOffset !== undefined ? road.labelOffset : '';
        document.getElementById('road-labelSide').value = road.labelSide || 'top';
        document.getElementById('road-labelReverse').checked = road.labelReverse || false;

        // Ship / vessel details
        document.getElementById('ship-name').value = road.shipName || '';
        const shipTypeSelect = document.getElementById('ship-type');
        const shipTypeCustom = document.getElementById('ship-type-custom');
        const knownShipTypes = Array.from(shipTypeSelect.options).map(o => o.value);
        if (road.shipType && !knownShipTypes.includes(road.shipType)) {
            shipTypeSelect.value = 'Other';
            shipTypeCustom.style.display = 'block';
            shipTypeCustom.value = road.shipType;
        } else {
            shipTypeSelect.value = road.shipType || '';
            shipTypeCustom.style.display = 'none';
            shipTypeCustom.value = '';
        }
        document.getElementById('ship-captain').value = road.captainName || '';
        document.getElementById('ship-duration').value = road.animationDuration || '';
        const loadedBoatColor = road.boatColor || '';
        document.getElementById('ship-color').value = loadedBoatColor;
        document.getElementById('ship-color-picker').value = loadedBoatColor || '#4da6ff';
        document.getElementById('ship-size').value = road.boatSizeMultiplier || '';
        document.getElementById('route-purpose').value = road.routePurpose || '';
        document.getElementById('route-cargo').value = road.cargo || '';
        document.getElementById('route-risk').value = road.riskLevel || '';
        toggleShipDetails();

        // Update location dropdowns
        updateLocationDropdowns();
        const points = road.points || [];
        if (points.length > 0 && typeof points[0] === 'string') {
            document.getElementById('road-start-location').value = points[0];
        }
        if (points.length > 0 && typeof points[points.length - 1] === 'string') {
            document.getElementById('road-end-location').value = points[points.length - 1];
        }

        renderRoadPoints(points);
        renderRoadList();
    }

    function updateLocationDropdowns() {
        const startSelect = document.getElementById('road-start-location');
        const endSelect = document.getElementById('road-end-location');
        if (!startSelect || !endSelect) return;

        // Clear and repopulate
        startSelect.innerHTML = '<option value="">-- Select Start Location --</option>';
        endSelect.innerHTML = '<option value="">-- Select End Location --</option>';

        // Sort locations by name
        const sorted = [...state.locations].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

        sorted.forEach(loc => {
            const startOpt = document.createElement('option');
            startOpt.value = loc.id;
            startOpt.textContent = `${loc.name} (${loc.type})`;
            startSelect.appendChild(startOpt);

            const endOpt = document.createElement('option');
            endOpt.value = loc.id;
            endOpt.textContent = `${loc.name} (${loc.type})`;
            endSelect.appendChild(endOpt);
        });
    }

    function newRoad() {
        const newId = Date.now() + '-road';
        const newRoadData = {
            id: newId,
            type: 'minor',
            curved: true,
            points: []
        };
        state.roads.push(newRoadData);
        state.selectedRoadId = newId;
        state.roadDraft = cloneData(newRoadData);
        state.roadDraftOriginalId = newId;
        setActionMessage('road-form-message', 'Road shell created. Add endpoints and waypoints, then save to finalize styling.');

        document.getElementById('road-form-area').style.display = 'block';
        document.getElementById('road-form-title').textContent = 'New Road';
        document.getElementById('btn-del-road').style.display = 'none';

        document.getElementById('road-id').value = newId;
        document.getElementById('road-type').value = 'minor';
        document.getElementById('road-name').value = '';
        document.getElementById('road-curved').checked = true;

        document.getElementById('road-color').value = '';
        document.getElementById('road-width').value = '';
        document.getElementById('road-dashed').value = '';
        document.getElementById('road-dashLength').value = '';
        document.getElementById('road-gapLength').value = '';
        document.getElementById('road-labelOffset').value = '';
        document.getElementById('road-labelSide').value = 'top';
        document.getElementById('road-labelReverse').checked = false;

        // Ship / vessel details
        document.getElementById('ship-name').value = '';
        document.getElementById('ship-type').value = '';
        document.getElementById('ship-type-custom').value = '';
        document.getElementById('ship-type-custom').style.display = 'none';
        document.getElementById('ship-captain').value = '';
        document.getElementById('ship-duration').value = '';
        document.getElementById('ship-color').value = '';
        document.getElementById('ship-color-picker').value = '#4da6ff';
        document.getElementById('ship-size').value = '';
        document.getElementById('route-purpose').value = '';
        document.getElementById('route-cargo').value = '';
        document.getElementById('route-risk').value = '';
        toggleShipDetails();

        // Reset location dropdowns
        updateLocationDropdowns();
        document.getElementById('road-start-location').value = '';
        document.getElementById('road-end-location').value = '';

        renderRoadPoints([]);

        // Auto save shell so we can add points
        saveRoad(true, { validateComplete: false, showFeedback: false, exportToDisk: false, pushHistory: false });
    }

    function renderRoadPoints(points) {
        const list = document.getElementById('road-points-list');
        list.innerHTML = '';
        // Show "click map to add waypoints" hint only when start+end locations are both set
        const hasStartEnd = points.length >= 2
            && typeof points[0] === 'string'
            && typeof points[points.length - 1] === 'string';
        const waypointHint = document.getElementById('waypoint-map-hint');
        if (waypointHint) waypointHint.style.display = hasStartEnd ? 'block' : 'none';

        if (points.length === 0) {
            list.innerHTML = '<div style="color:#666; font-style:italic; padding:0.5rem;">No points yet. Select start and end locations above.</div>';
            return;
        }
        points.forEach((pt, idx) => {
            const el = document.createElement('div');
            el.style.display = 'flex';
            el.style.justifyContent = 'space-between';
            el.style.alignItems = 'center';
            el.style.marginBottom = '2px';
            el.style.padding = '2px 4px';
            el.style.borderRadius = '2px';

            const isStart = idx === 0;
            const isEnd = idx === points.length - 1;
            const isLocation = typeof pt === 'string';
            const isWaypoint = !isStart && !isEnd && !isLocation;

            if (isStart) {
                el.style.background = 'rgba(0, 150, 0, 0.2)';
                el.style.borderLeft = '2px solid #0a0';
            } else if (isEnd) {
                el.style.background = 'rgba(150, 0, 0, 0.2)';
                el.style.borderLeft = '2px solid #a00';
            } else if (isWaypoint) {
                el.style.background = 'rgba(100, 100, 150, 0.1)';
                el.style.borderLeft = '2px solid #666';
            }

            let ptDisplay;
            if (isLocation) {
                // Look up location name
                const loc = state.locations.find(l => l.id === pt);
                ptDisplay = loc ? `${loc.name} (${pt})` : pt;
            } else {
                ptDisplay = `[${pt[0]}, ${pt[1]}]`;
            }

            const label = isStart ? 'START' : (isEnd ? 'END' : `Waypoint ${idx}`);
            const canEdit = isWaypoint; // Can edit waypoints
            const canRemove = isWaypoint; // Can remove waypoints

            if (canEdit && state.editingWaypointIndex === idx) {
                // Show edit mode
                el.innerHTML = `
                    <div style="flex: 1; display: flex; gap: 0.25rem; align-items: center;">
                        <strong style="color:#888; font-size:0.7rem;">${label}:</strong>
                        <input type="number" id="waypoint-x-${idx}" value="${pt[0]}" step="0.01" 
                            style="width:60px; padding:2px; font-size:0.7rem; background:#222; border:1px solid #444; color:#fff;" />
                        <span style="color:#666;">,</span>
                        <input type="number" id="waypoint-y-${idx}" value="${pt[1]}" step="0.01" 
                            style="width:60px; padding:2px; font-size:0.7rem; background:#222; border:1px solid #444; color:#fff;" />
                        <button style="background:#0a0; border:none; color:#fff; cursor:pointer; padding:2px 6px; font-size:0.7rem; border-radius:2px;" 
                            onclick="Editor.saveWaypoint(${idx})" title="Save"><i class="fa-solid fa-check"></i></button>
                        <button style="background:#666; border:none; color:#fff; cursor:pointer; padding:2px 6px; font-size:0.7rem; border-radius:2px;" 
                            onclick="Editor.cancelEditWaypoint()" title="Cancel"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                `;
                // Add live preview listeners after element is in the DOM
                setTimeout(() => {
                    const xEl = document.getElementById(`waypoint-x-${idx}`);
                    const yEl = document.getElementById(`waypoint-y-${idx}`);
                    if (xEl && yEl) {
                        const previewHandler = () => {
                            const road = state.roads.find(r => r.id === state.selectedRoadId);
                            if (!road || !road.points) return;
                            const x = parseFloat(xEl.value);
                            const y = parseFloat(yEl.value);
                            if (!isNaN(x) && !isNaN(y)) {
                                road.points[idx] = [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
                                syncRoadDraftFromState();
                                refreshMap();
                            }
                        };
                        xEl.addEventListener('input', previewHandler);
                        yEl.addEventListener('input', previewHandler);
                    }
                }, 0);
            } else {
                // Show display mode
                el.innerHTML = `
                    <span><strong style="color:${isStart ? '#0a0' : (isEnd ? '#a00' : '#888')};">${label}:</strong> ${ptDisplay}</span> 
                    <div style="display: flex; gap: 0.25rem;">
                        ${canEdit ? `<button style="background:none; border:none; color:#0a0; cursor:pointer; padding:2px 4px;" onclick="Editor.editWaypoint(${idx})" title="Edit waypoint"><i class="fa-solid fa-pencil"></i></button>` : ''}
                        ${canRemove ? `<button style="background:none; border:none; color:#800; cursor:pointer; padding:2px 4px;" onclick="Editor.removeRoadPoint(${idx})" title="Remove waypoint"><i class="fa-solid fa-xmark"></i></button>` : '<span style="color:#666; font-size:0.7rem;">Required</span>'}
                    </div>
                `;
            }
            list.appendChild(el);
        });
    }

    function editWaypoint(idx) {
        if (!state.selectedRoadId) return;
        const road = getRoadById(state.selectedRoadId);
        if (road && road.points && idx > 0 && idx < road.points.length - 1 && Array.isArray(road.points[idx])) {
            state.editingWaypointIndex = idx;
            renderRoadPoints(road.points);
        }
    }

    function saveWaypoint(idx) {
        if (!state.selectedRoadId) return;
        const road = getRoadById(state.selectedRoadId);
        if (road && road.points && idx > 0 && idx < road.points.length - 1) {
            const xInput = document.getElementById(`waypoint-x-${idx}`);
            const yInput = document.getElementById(`waypoint-y-${idx}`);
            if (xInput && yInput) {
                const x = parseFloat(xInput.value);
                const y = parseFloat(yInput.value);
                if (!isNaN(x) && !isNaN(y)) {
                    road.points[idx] = [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
                    state.editingWaypointIndex = null;
                    renderRoadPoints(road.points);
                    syncRoadDraftFromState();
                    refreshMap();
                    saveRoad(false, { validateComplete: false, showFeedback: false });
                }
            }
        }
    }

    function cancelEditWaypoint() {
        state.editingWaypointIndex = null;
        if (state.selectedRoadId) {
            const road = getRoadById(state.selectedRoadId);
            if (road && road.points) {
                renderRoadPoints(road.points);
            }
        }
    }

    function removeRoadPoint(idx) {
        if (!state.selectedRoadId) return;
        const road = getRoadById(state.selectedRoadId);
        if (road && road.points) {
            // Don't allow removing start or end locations - silently return
            if (idx === 0 || idx === road.points.length - 1) {
                return;
            }
            road.points.splice(idx, 1);
            state.editingWaypointIndex = null; // Cancel any editing
            renderRoadPoints(road.points);
            syncRoadDraftFromState();
            refreshMap();
            // Auto-save after removing point
            saveRoad(false, { validateComplete: false, showFeedback: false });
        }
    }

    function setRoadStartLocation(locationId) {
        if (!state.selectedRoadId) return;
        const road = getRoadById(state.selectedRoadId);
        if (road) {
            if (!road.points) road.points = [];
            if (road.points.length === 0) {
                road.points.push(locationId);
            } else {
                road.points[0] = locationId;
            }
            renderRoadPoints(road.points);
            syncRoadDraftFromState();
            refreshMap();
            saveRoad(false, { validateComplete: false, showFeedback: false });
        }
    }

    function setRoadEndLocation(locationId) {
        if (!state.selectedRoadId) return;
        const road = getRoadById(state.selectedRoadId);
        if (road) {
            if (!road.points) road.points = [];
            // Ensure we have a start location first - silently return if not
            if (road.points.length === 0 || typeof road.points[0] !== 'string') {
                return;
            }
            if (road.points.length === 1) {
                road.points.push(locationId);
            } else {
                road.points[road.points.length - 1] = locationId;
            }
            renderRoadPoints(road.points);
            syncRoadDraftFromState();
            refreshMap();
            saveRoad(false, { validateComplete: false, showFeedback: false });
        }
    }

    function clearRoadPoints() {
        if (!state.selectedRoadId) return;
        if (confirm('Clear all waypoints from this road? (Start and end locations will remain)')) {
            const road = getRoadById(state.selectedRoadId);
            if (road && road.points) {
                // Keep start and end locations, remove only waypoints
                const start = road.points.length > 0 && typeof road.points[0] === 'string' ? road.points[0] : null;
                const end = road.points.length > 0 && typeof road.points[road.points.length - 1] === 'string' ? road.points[road.points.length - 1] : null;
                road.points = [];
                if (start) road.points.push(start);
                if (end && end !== start) road.points.push(end);
                renderRoadPoints(road.points);
                syncRoadDraftFromState();
                refreshMap();
                saveRoad(false, { validateComplete: false, showFeedback: false });
            }
        }
    }

    function getRoadFromForm(isNew, searchId) {
        let id = document.getElementById('road-id').value;
        if (!id) id = searchId || 'road-' + Date.now();

        const existing = state.roads.find(r => r.id === searchId);
        const baseRoad = cloneData(state.roadDraft || existing || {});

        const roadData = {
            ...baseRoad,
            id: id,
            type: document.getElementById('road-type').value,
            curved: document.getElementById('road-curved').checked
        };

        const name = document.getElementById('road-name').value;
        if (name) roadData.name = name;

        const color = document.getElementById('road-color').value;
        if (color) roadData.color = color;

        const width = document.getElementById('road-width').value;
        if (width !== '') roadData.width = parseFloat(width);

        const dashed = document.getElementById('road-dashed').value;
        if (dashed !== '') {
            if (dashed.toLowerCase() === 'true') roadData.dashed = true;
            else if (dashed.toLowerCase() === 'false') roadData.dashed = false;
            else roadData.dashed = dashed;
        }

        const dashLen = document.getElementById('road-dashLength').value;
        if (dashLen !== '') roadData.dashLength = parseFloat(dashLen);

        const gapLen = document.getElementById('road-gapLength').value;
        if (gapLen !== '') roadData.gapLength = parseFloat(gapLen);

        // Road label typography
        const fontFamily = document.getElementById('road-fontFamily').value;
        if (fontFamily) roadData.fontFamily = fontFamily;

        const fontSize = document.getElementById('road-fontSize').value;
        if (fontSize !== '') roadData.fontSize = parseFloat(fontSize);

        const fontWeight = document.getElementById('road-fontWeight').value;
        if (fontWeight) roadData.fontWeight = fontWeight;

        const fontStyle = document.getElementById('road-fontStyle').value;
        if (fontStyle) roadData.fontStyle = fontStyle;

        const labelOpacity = document.getElementById('road-labelOpacity').value;
        if (labelOpacity !== '') roadData.labelOpacity = parseFloat(labelOpacity);

        const labelOffset = document.getElementById('road-labelOffset').value;
        if (labelOffset !== '') roadData.labelOffset = parseInt(labelOffset);

        const labelSide = document.getElementById('road-labelSide').value;
        if (labelSide && labelSide !== 'top') roadData.labelSide = labelSide;

        const labelReverse = document.getElementById('road-labelReverse').checked;
        if (labelReverse) roadData.labelReverse = true;

        const startLocId = document.getElementById('road-start-location')?.value || '';
        const endLocId = document.getElementById('road-end-location')?.value || '';

        // If 'existing' is present, use its points array rather than freshly building one,
        // because handleMapClick writes directly to existing.points when clicking the map.
        if (existing && existing.points) {
            roadData.points = [...existing.points];

            // Only force sync the start/end dropdowns if they don't match the current waypoints 
            // array, giving precedence to the dropdowns but keeping intermediate waypoints intact
            if (roadData.points.length > 0 && typeof roadData.points[0] === 'string' && startLocId) {
                roadData.points[0] = startLocId;
            } else if (startLocId) {
                roadData.points.unshift(startLocId);
            }

            if (roadData.points.length > 1 && typeof roadData.points[roadData.points.length - 1] === 'string' && endLocId) {
                roadData.points[roadData.points.length - 1] = endLocId;
            } else if (endLocId && endLocId !== startLocId) {
                roadData.points.push(endLocId);
            }
        } else {
            roadData.points = [];
            if (startLocId) roadData.points.push(startLocId);
            if (endLocId && endLocId !== startLocId) roadData.points.push(endLocId);
        }

        // Ship / vessel details (only for water-route)
        if (roadData.type === 'water-route') {
            const shipName = document.getElementById('ship-name').value;
            const shipTypeRaw = document.getElementById('ship-type').value;
            const shipTypeCustom = document.getElementById('ship-type-custom').value;
            const shipType = shipTypeRaw === 'Other' ? shipTypeCustom : shipTypeRaw;
            const shipCaptain = document.getElementById('ship-captain').value;
            const shipDuration = parseFloat(document.getElementById('ship-duration').value);
            const boatColor = document.getElementById('ship-color').value.trim();
            const boatSizeMultiplier = parseFloat(document.getElementById('ship-size').value);
            const routePurpose = document.getElementById('route-purpose').value;
            const cargo = document.getElementById('route-cargo').value;
            const riskLevel = document.getElementById('route-risk').value;

            if (shipName) roadData.shipName = shipName;
            if (shipType) roadData.shipType = shipType;
            if (shipCaptain) roadData.captainName = shipCaptain;
            if (!isNaN(shipDuration) && shipDuration > 0) roadData.animationDuration = shipDuration;
            if (boatColor) roadData.boatColor = boatColor;
            if (!isNaN(boatSizeMultiplier) && boatSizeMultiplier > 0) roadData.boatSizeMultiplier = boatSizeMultiplier;
            if (routePurpose) roadData.routePurpose = routePurpose;
            if (cargo) roadData.cargo = cargo;
            if (riskLevel) roadData.riskLevel = riskLevel;
        } else {
            delete roadData.shipName;
            delete roadData.shipType;
            delete roadData.captainName;
            delete roadData.animationDuration;
            delete roadData.boatColor;
            delete roadData.boatSizeMultiplier;
            delete roadData.routePurpose;
            delete roadData.cargo;
            delete roadData.riskLevel;
        }

        return { roadData, startLocId, endLocId, existing, id };
    }

    function validateRoadData(roadData, { validateComplete = true } = {}) {
        if (!roadData.id || !roadData.id.trim()) {
            return 'Road ID is required.';
        }

        const originalId = state.roadDraftOriginalId || state.selectedRoadId;
        const duplicate = state.roads.find(road => road.id === roadData.id && road.id !== originalId);
        if (duplicate) {
            return `Road ID "${roadData.id}" already exists.`;
        }

        if (!validateComplete) return '';

        if (!Array.isArray(roadData.points) || roadData.points.length < 2) {
            return 'Roads must have both a start and end location before saving.';
        }
        if (typeof roadData.points[0] !== 'string' || typeof roadData.points[roadData.points.length - 1] !== 'string') {
            return 'Roads must start and end at locations.';
        }
        return '';
    }

    function toggleShipDetails() {
        const type = document.getElementById('road-type')?.value;
        const section = document.getElementById('ship-details-section');
        const hint = document.getElementById('vessel-hint');
        if (section) section.style.display = type === 'water-route' ? 'block' : 'none';
        if (hint) hint.style.display = type === 'water-route' ? 'none' : 'block';
    }

    function handleShipTypeChange() {
        const select = document.getElementById('ship-type');
        const custom = document.getElementById('ship-type-custom');
        const colorInput = document.getElementById('ship-color');
        const colorPicker = document.getElementById('ship-color-picker');

        const typeColors = {
            'Caravel': '#ffcc00',
            'Sloop': '#4da6ff',
            'Brigantine': '#ff6600',
            'Galleon': '#ff3333',
            'Frigate': '#cc33ff',
            'Merchant Cog': '#99ff33',
            'Longship': '#964B00',
            'Warship': '#555555',
            'Fishing Vessel': '#00cccc'
        };

        if (select && custom) {
            custom.style.display = select.value === 'Other' ? 'block' : 'none';
            if (select.value !== 'Other') {
                custom.value = '';
                // Automatically set color if it's a known type and color isn't already customized
                if (typeColors[select.value]) {
                    const newColor = typeColors[select.value];
                    if (colorInput) colorInput.value = newColor;
                    if (colorPicker) colorPicker.value = newColor;
                }
                previewRoad();
            }
        }
    }

    function syncShipColorPicker() {
        const text = document.getElementById('ship-color').value.trim();
        const picker = document.getElementById('ship-color-picker');
        if (picker && /^#[0-9A-Fa-f]{6}$/.test(text)) picker.value = text;
    }

    function previewRoad() {
        if (!state.selectedRoadId) return;
        const { roadData } = getRoadFromForm(false, state.selectedRoadId);
        state.roadDraft = roadData;
        setActionMessage('road-form-message', 'Previewing road changes. Save to commit or Cancel to revert.');
        _debouncedRefresh();
    }

    function saveRoad(isNew = false, options = {}) {
        const {
            validateComplete = !isNew,
            showFeedback = !isNew,
            exportToDisk = !isNew,
            pushHistory = !isNew
        } = options;
        const searchId = state.selectedRoadId || document.getElementById('road-id').value;
        const { roadData, startLocId, endLocId, existing, id } = getRoadFromForm(isNew, searchId);
        const validationError = validateRoadData(roadData, { validateComplete });
        if (validationError) {
            setActionMessage('road-form-message', validationError, true);
            return false;
        }

        if (pushHistory) pushUndo();

        // Find existing road to replace — try `existing` from getRoadFromForm first,
        // then fall back to searching by state.selectedRoadId (handles ID-change scenarios)
        let idx = -1;
        if (existing) {
            idx = state.roads.indexOf(existing);
        }
        if (idx === -1 && state.selectedRoadId) {
            idx = state.roads.findIndex(r => r.id === state.selectedRoadId);
        }

        if (idx !== -1) {
            state.roads[idx] = roadData;
        } else {
            // Only push if a road with this ID doesn't already exist (prevent duplicates)
            const dupeIdx = state.roads.findIndex(r => r.id === roadData.id);
            if (dupeIdx !== -1) {
                state.roads[dupeIdx] = roadData;
            } else {
                state.roads.push(roadData);
            }
        }

        state.selectedRoadId = id;
        state.roadDraft = cloneData(roadData);
        state.roadDraftOriginalId = id;
        document.getElementById('road-id').value = id;

        if (!isNew) {
            document.getElementById('btn-del-road').style.display = 'inline-block';
            renderRoadList();
        }

        // Update the display to reflect saved state
        renderRoadPoints(roadData.points);

        if (showFeedback) {
            setActionMessage('road-form-message', 'Road saved.');
            flashButton('btn-save-road', '<i class="fa-solid fa-check"></i> Saved!');
        }

        refreshMap();

        if (exportToDisk) {
            exportData().catch(err => {
                console.error('Failed to auto-save to disk:', err);
            });
        }
        return true;
    }

    function deleteRoad() {
        if (!state.selectedRoadId) return;
        if (confirm('Are you sure you want to delete this road?')) {
            pushUndo();
            state.roads = state.roads.filter(r => r.id !== state.selectedRoadId);
            state.roadDraft = null;
            state.roadDraftOriginalId = null;
            cancelRoad();
            refreshMap();
            exportData().catch(err => console.error('Failed to auto-save to disk:', err));
        }
    }

    function cancelRoad() {
        if (state.selectedRoadId) {
            const road = getRoadById(state.selectedRoadId);
            // Prune if this was a brand new road that was canceled before getting a valid start point
            if (road && (!road.points || road.points.length === 0 || typeof road.points[0] !== 'string')) {
                state.roads = state.roads.filter(r => r.id !== state.selectedRoadId);
            }
        }
        state.selectedRoadId = null;
        state.roadDraft = null;
        state.roadDraftOriginalId = null;
        state.editingWaypointIndex = null;
        document.getElementById('road-form-area').style.display = 'none';
        setActionMessage('road-form-message', '');
        renderRoadList();
        refreshMap();
    }

    // --- Duplicate Location ---

    function duplicateLocation() {
        if (!state.selectedLocId) return;
        const loc = state.locations.find(l => l.id === state.selectedLocId);
        if (!loc) return;

        const copy = JSON.parse(JSON.stringify(loc));
        copy.x = Math.min(99, parseFloat((copy.x + 1).toFixed(1)));
        copy.y = Math.min(99, parseFloat((copy.y + 1).toFixed(1)));

        let baseId = loc.id + '-copy';
        let newId = baseId;
        let counter = 1;
        while (state.locations.find(l => l.id === newId)) newId = baseId + (counter++);
        copy.id = newId;
        copy.name = (loc.name || loc.id) + ' (Copy)';

        state.selectedLocId = null;
        document.getElementById('location-form-area').style.display = 'block';
        document.getElementById('form-title').textContent = 'New Location (Duplicate)';
        document.getElementById('btn-del-loc').style.display = 'none';
        const list = document.getElementById('location-list');
        if (list) list.value = '';

        document.getElementById('loc-id').value = copy.id;
        document.getElementById('loc-name').value = copy.name.replace(/\n/g, '\\n');
        document.getElementById('loc-x').value = copy.x;
        document.getElementById('loc-y').value = copy.y;
        document.getElementById('loc-type').value = copy.type || 'town';
        document.getElementById('loc-region').value = copy.region || '';
        document.getElementById('loc-desc').value = copy.description || '';
        document.getElementById('loc-details').value = copy.details || '';
        document.getElementById('loc-link').value = copy.link || '';
        document.getElementById('loc-cityMap').value = copy.cityMap || '';
        document.getElementById('loc-fontFamily').value = copy.fontFamily || '';
        document.getElementById('loc-fontSize').value = copy.fontSize || '';
        document.getElementById('loc-fontWeight').value = copy.fontWeight || '';
        document.getElementById('loc-fontStyle').value = copy.fontStyle || '';
        document.getElementById('loc-markerSize').value = copy.markerSize !== undefined ? copy.markerSize : 0.25;
        document.getElementById('loc-markerOffsetX').value = copy.markerOffsetX || 0;
        document.getElementById('loc-markerOffsetY').value = copy.markerOffsetY || 0;
        document.getElementById('loc-labelOffsetX').value = copy.labelOffsetX || '';
        document.getElementById('loc-labelOffsetY').value = copy.labelOffsetY || '';
        document.getElementById('loc-labelAlign').value = copy.labelAlign || '';
        document.getElementById('loc-rotation').value = copy.rotation || '';
        document.getElementById('loc-textCurve').value = copy.textCurve !== undefined ? copy.textCurve : '';
        document.getElementById('loc-opacity').value = copy.opacity !== undefined ? copy.opacity : '';
        document.getElementById('loc-hideLabel').checked = !!copy.hideLabel;

        state.selectedLocId = '__preview__';
        state.isNewPreview = true;
        state.locationDraftOriginalId = null;
        state.locationDraft = { ...copy, id: '__preview__', _ghost: true };
        setActionMessage('location-form-message', 'Previewing a duplicated location. Save to create the new entry.');
        _debouncedRefresh();
    }

    // --- Region Filter ---

    function getUniqueRegions() {
        const seen = new Set();
        return state.locations
            .map(l => l.region || '')
            .filter(r => r && !seen.has(r) && seen.add(r))
            .sort();
    }

    function populateRegionFilter() {
        const regions = getUniqueRegions();

        const filterSel = document.getElementById('region-filter');
        if (filterSel) {
            const cur = filterSel.value;
            filterSel.innerHTML = '<option value="">All Regions</option>';
            regions.forEach(r => {
                const opt = document.createElement('option');
                opt.value = r;
                opt.textContent = r;
                if (r === cur) opt.selected = true;
                filterSel.appendChild(opt);
            });
        }

        const renameSel = document.getElementById('rename-region-old');
        if (renameSel) {
            const cur = renameSel.value;
            renameSel.innerHTML = '<option value="">— Select region to rename —</option>';
            regions.forEach(r => {
                const opt = document.createElement('option');
                opt.value = r;
                opt.textContent = r;
                if (r === cur) opt.selected = true;
                renameSel.appendChild(opt);
            });
        }
    }

    function getTypeLabel(type) {
        const typeLabels = {
            capital: 'Capital',
            city: 'City (Large)',
            'small-city': 'City (Small)',
            town: 'Town',
            village: 'Village',
            port: 'Port',
            poi: 'Point of Interest',
            landmark: 'Landmark',
            ruins: 'Ruins',
            region: 'Region Label',
            water: 'Water Label',
            river: 'River Label',
            nature: 'Nature / Terrain'
        };
        return typeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1);
    }

    function getUniqueTypes() {
        const seen = new Set();
        return state.locations
            .map(l => l.type || '')
            .filter(t => t && !seen.has(t) && seen.add(t))
            .sort((a, b) => getTypeLabel(a).localeCompare(getTypeLabel(b)));
    }

    function populateTypeFilter() {
        const types = getUniqueTypes();
        const filterSel = document.getElementById('type-filter');
        if (!filterSel) return;

        const activeValue = state.typeFilter || filterSel.value;
        filterSel.innerHTML = '<option value="">All Types</option>';
        types.forEach(type => {
            const opt = document.createElement('option');
            opt.value = type;
            opt.textContent = getTypeLabel(type);
            if (type === activeValue) opt.selected = true;
            filterSel.appendChild(opt);
        });

        if (activeValue && !types.includes(activeValue)) {
            state.typeFilter = '';
        }
    }

    function filterByRegion(region) {
        state.regionFilter = region;
        const badge = document.getElementById('region-filter-badge');
        const sel = document.getElementById('region-filter');
        if (badge) badge.style.display = region ? 'inline-block' : 'none';
        if (sel) sel.style.borderColor = region ? 'var(--color-gold)' : '#584433';
        renderLocationList(document.getElementById('location-search')?.value || '');
    }

    function filterByType(type) {
        state.typeFilter = type;
        const badge = document.getElementById('type-filter-badge');
        const sel = document.getElementById('type-filter');
        if (badge) badge.style.display = type ? 'inline-block' : 'none';
        if (sel) sel.style.borderColor = type ? 'var(--color-gold)' : '#584433';
        renderLocationList(document.getElementById('location-search')?.value || '');
    }

    // --- Batch Region Rename ---

    function renameRegion(oldName, newName) {
        if (!oldName || !newName || oldName === newName) return;
        pushUndo();
        let count = 0;
        state.locations.forEach(loc => {
            if (loc.region === oldName) { loc.region = newName; count++; }
        });
        if (count > 0) {
            if (state.regionFilter === oldName) state.regionFilter = newName;
            renderLists();
            exportData().catch(console.error);
            alert(`Updated ${count} location${count !== 1 ? 's' : ''}: "${oldName}" → "${newName}".`);
        } else {
            alert(`No locations found with region "${oldName}".`);
        }
    }

    function applyRenameRegion() {
        const oldEl = document.getElementById('rename-region-old');
        const newEl = document.getElementById('rename-region-new');
        if (!oldEl || !newEl) return;
        const oldVal = oldEl.value.trim();
        const newVal = newEl.value.trim();
        if (!oldVal) { alert('Select a region to rename.'); return; }
        if (!newVal) { alert('Enter a new region name.'); return; }
        renameRegion(oldVal, newVal);
        newEl.value = '';
    }

    // --- Utility ---

    function refreshMap() {
        const renderState = syncCampaignDataBridge();
        document.dispatchEvent(new CustomEvent('campaign-data-updated', { detail: renderState }));
    }

    async function exportData() {
        // Generate JS content string
        const obj = {
            locations: state.locations,
            roads: state.roads,
            regions: state.regions
        };

        const str = `/**
 * World of Myrdae - Default Location Database
 * 
 * This file contains the default data for locations, roads, and regions.
 * It is loaded as a script to bypass CORS restrictions when running locally via file:// protocol.
 */

const WORLD_LOCATIONS = ${JSON.stringify(obj, null, 4)};\n`;

        // If running on a local server, trigger the POST save
        if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
            try {
                const response = await fetch('/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain' },
                    body: str
                });

                if (response.ok) {
                    return true;
                } else {
                    throw new Error('Save failed');
                }
            } catch (err) {
                console.error("Save API failed. Falling back to download.", err);
                downloadFile(str);
                return false;
            }
        } else {
            // Fallback: Download blob
            downloadFile(str);
            return false;
        }
    }

    function downloadFile(str) {
        const blob = new Blob([str], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'locations-db.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async function reloadPage() {
        // Delegate to CityEditor if city map mode is active
        if (typeof CityEditor !== 'undefined' && CityEditor.isActive()) {
            return CityEditor.reloadData();
        }

        try {
            const res = await fetch('js/locations-db.js?v=' + Date.now());
            if (!res.ok) throw new Error("HTTP error " + res.status);
            const text = await res.text();

            const jsonStart = text.indexOf('{');
            if (jsonStart === -1) throw new Error("Invalid format");

            let jsonStr = text.substring(jsonStart).trim();
            if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);

            const data = JSON.parse(jsonStr);
            state.locations = data.locations || [];
            state.roads = data.roads || [];
            state.regions = data.regions || [];
            state.locationDraft = null;
            state.locationDraftOriginalId = null;
            state.roadDraft = null;
            state.roadDraftOriginalId = null;

            renderLists();

            // Keep current selection open if it still exists
            if (state.selectedLocId && state.locations.find(l => l.id === state.selectedLocId)) {
                selectLocation(state.selectedLocId);
            } else {
                cancelLocation();
            }

            if (state.selectedRoadId && state.roads.find(r => r.id === state.selectedRoadId)) {
                selectRoad(state.selectedRoadId);
            } else {
                document.getElementById('road-form-area').style.display = 'none';
            }

            refreshMap();
            flashButton('btn-reload-data', '<i class="fa-solid fa-check"></i> Reloaded!');
        } catch (err) {
            console.error('Failed to reload map data:', err);
            alert('Failed to reload map data: ' + err.message);
        }
    }

    return {
        init,
        switchTab,
        handleMapClick,
        state, // Expose state for editor.html access

        // Locs
        selectLocation,
        saveLocation,
        deleteLocation,
        cancelLocation,
        previewLocation,
        filterLocationList,
        filterRoadList,
        filterRoadsByRegion,

        // Roads
        selectRoad,
        newRoad,
        saveRoad,
        deleteRoad,
        cancelRoad,
        removeRoadPoint,
        clearRoadPoints,
        setRoadStartLocation,
        setRoadEndLocation,
        handleLocationClick,
        editWaypoint,
        saveWaypoint,
        cancelEditWaypoint,
        previewRoad,
        toggleShipDetails,
        handleShipTypeChange,
        syncShipColorPicker,

        // Core
        exportData,
        reloadPage,
        refreshMap,

        // Undo / Redo
        undo,
        redo,

        // Duplicate
        duplicateLocation,

        // Region filter & rename
        filterByRegion,
        filterByType,
        toggleNewLocationMode,
        toggleMoveLocationMode,
        beginLocationMove,
        moveSelectedLocationPreview,
        finishLocationMove,
        applyRenameRegion
    };
})();
