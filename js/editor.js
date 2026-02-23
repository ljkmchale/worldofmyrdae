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
        editingWaypointIndex: null
    };

    /** Initialize Editor State */
    async function init() {
        console.log("Initializing Map Editor...");

        // Copy the original WORLD_LOCATIONS locally to manipulate
        if (typeof WORLD_LOCATIONS !== 'undefined') {
            state.locations = JSON.parse(JSON.stringify(WORLD_LOCATIONS.locations || []));
            state.roads = JSON.parse(JSON.stringify(WORLD_LOCATIONS.roads || []));
            state.regions = JSON.parse(JSON.stringify(WORLD_LOCATIONS.regions || []));
        } else {
            console.warn("WORLD_LOCATIONS not found. Creating empty map.");
        }

        // Override CampaignData defaults locally so the map draws our editable state
        window.CampaignData = {
            init: async () => state,
            getData: () => state,
            getLocations: () => state.locations,
            getRoads: () => state.roads
        };

        // Setup live preview for locations
        ['loc-id', 'loc-name', 'loc-x', 'loc-y', 'loc-type', 'loc-region', 'loc-desc', 'loc-details',
            'loc-fontFamily', 'loc-fontSize', 'loc-fontWeight', 'loc-fontStyle',
            'loc-markerSize', 'loc-markerOffsetX', 'loc-markerOffsetY',
            'loc-labelOffsetX', 'loc-labelOffsetY', 'loc-rotation', 'loc-opacity'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('input', previewLocation);
            });

        // Setup live preview for roads
        ['road-type', 'road-curved', 'road-name', 'road-color', 'road-width',
            'road-dashed', 'road-dashLength', 'road-gapLength',
            'road-fontFamily', 'road-fontSize', 'road-fontWeight', 'road-fontStyle', 'road-labelOpacity'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('input', previewRoad);
            });
        ['road-start-location', 'road-end-location'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('change', previewRoad);
        });

        // Broadcast the initial load to map-overlay
        document.dispatchEvent(new CustomEvent('campaign-data-updated', { detail: state }));

        renderLists();
    }

    function switchTab(tabName) {
        state.tab = tabName;
        document.querySelectorAll('.editor-tab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');

        document.querySelector(`button[onclick="Editor.switchTab('${tabName}')"]`).classList.add('active');
        document.getElementById(`tab-${tabName}`).style.display = 'block';

        if (tabName === 'locations') {
            renderLocationList();
        } else if (tabName === 'roads') {
            renderRoadList();
        }
    }

    // --- Map Interactions ---

    function handleMapClick(x, y) {
        if (state.tab === 'locations') {
            // Create new location or update selected location
            if (state.selectedLocId) {
                // Update coordinates
                document.getElementById('loc-x').value = x.toFixed(1);
                document.getElementById('loc-y').value = y.toFixed(1);
                saveLocation(true); // Auto-save coordinates if already editing
            } else {
                // Start new location
                newLocation(x, y);
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
                        refreshMap();
                        saveRoad(false);
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
                    refreshMap();
                    // Auto-save to ensure points are persisted
                    saveRoad(false);
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
                refreshMap();
                saveRoad(false);
            } else {
                // Silently return - user needs to create/select a road first
            }
        }
    }

    // --- Locations ---

    function renderLists() {
        renderLocationList();
        renderRoadList();
        updateLocationDropdowns();
    }

    function renderLocationList() {
        const list = document.getElementById('location-list');
        list.innerHTML = '<option value="">-- Select a Location --</option>';

        // Sort locations by name
        const sorted = [...state.locations].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

        sorted.forEach(loc => {
            const opt = document.createElement('option');
            opt.value = loc.id;
            opt.textContent = `${loc.name} (${loc.type})`;
            if (state.selectedLocId === loc.id) {
                opt.selected = true;
            }
            list.appendChild(opt);
        });
    }

    function selectLocation(id) {
        state.selectedLocId = id;
        const loc = state.locations.find(l => l.id === id);
        if (!loc) return;

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
        document.getElementById('loc-desc').value = loc.description || '';
        document.getElementById('loc-details').value = loc.details || '';

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
        document.getElementById('loc-rotation').value = loc.rotation || '';
        document.getElementById('loc-textCurve').value = loc.textCurve !== undefined ? loc.textCurve : '';
        document.getElementById('loc-opacity').value = loc.opacity !== undefined ? loc.opacity : '';

        // Update list to show active state (though on dropdown it just sets value)
        // renderLocationList(); // Removed to avoid re-rendering and losing focus if needed, select already handles value
    }

    function newLocation(x, y) {
        state.selectedLocId = null;
        document.getElementById('location-form-area').style.display = 'block';
        document.getElementById('form-title').textContent = 'New Location';
        document.getElementById('btn-del-loc').style.display = 'none';

        // Clear dropdown
        const list = document.getElementById('location-list');
        if (list) list.value = '';

        // Clear form
        document.getElementById('loc-id').value = '';
        document.getElementById('loc-name').value = 'New Location';
        document.getElementById('loc-x').value = x ? x.toFixed(1) : 50;
        document.getElementById('loc-y').value = y ? y.toFixed(1) : 50;
        document.getElementById('loc-type').value = 'town';
        document.getElementById('loc-region').value = '';
        document.getElementById('loc-desc').value = '';
        document.getElementById('loc-details').value = '';

        document.getElementById('loc-fontFamily').value = '';
        document.getElementById('loc-fontSize').value = '';
        document.getElementById('loc-fontWeight').value = '';
        document.getElementById('loc-fontStyle').value = '';
        document.getElementById('loc-markerSize').value = '0.25';
        document.getElementById('loc-markerOffsetX').value = '0';
        document.getElementById('loc-markerOffsetY').value = '0';
        document.getElementById('loc-labelOffsetX').value = '';
        document.getElementById('loc-labelOffsetY').value = '';
        document.getElementById('loc-rotation').value = '';
        document.getElementById('loc-textCurve').value = '';
        document.getElementById('loc-opacity').value = '';

        // renderLocationList();
    }

    function getLocationFromForm() {
        const rawName = document.getElementById('loc-name').value;
        const name = rawName.replace(/\\n/g, '\n');

        let id = document.getElementById('loc-id').value;
        if (!id) {
            id = (state.selectedLocId) ? state.selectedLocId : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }

        const locType = document.getElementById('loc-type').value;
        const isTown = locType.toLowerCase() === 'town';
        const isPoi = locType.toLowerCase() === 'poi';
        const isNature = ['nature', 'region', 'water', 'river', 'landmark'].includes(locType.toLowerCase());
        const isCity = locType.toLowerCase() === 'city';

        let defaultDesc = "";
        if (isTown) defaultDesc = "Town";
        else if (isCity) defaultDesc = "City";
        else if (isPoi) defaultDesc = "Point of Interest";
        else if (isNature) defaultDesc = "Nature";

        const locData = {
            id: id,
            name: name,
            type: locType,
            x: parseFloat(document.getElementById('loc-x').value) || 0,
            y: parseFloat(document.getElementById('loc-y').value) || 0,
            region: document.getElementById('loc-region').value,
            description: document.getElementById('loc-desc').value || defaultDesc
        };

        const details = document.getElementById('loc-details').value;
        if (details) locData.details = details;

        const setIf = (key, val, parseFn, defaultVal = undefined) => {
            if (val !== '') {
                locData[key] = parseFn ? parseFn(val) : val;
            } else if (defaultVal !== undefined) {
                locData[key] = defaultVal;
            }
        };

        setIf('fontFamily', document.getElementById('loc-fontFamily').value, null,
            isTown || isCity || isPoi ? "Garamond MT" : (isNature ? "Cinzel Decorative" : undefined));
        setIf('fontSize', document.getElementById('loc-fontSize').value, parseInt,
            isTown || isCity || isPoi ? 14 : (isNature ? 12 : undefined));
        setIf('fontWeight', document.getElementById('loc-fontWeight').value, null,
            isTown || isCity || isPoi || isNature ? "300" : undefined);
        setIf('fontStyle', document.getElementById('loc-fontStyle').value, null,
            isTown || isCity || isPoi || isNature ? "Italic" : undefined);
        setIf('markerSize', document.getElementById('loc-markerSize').value, parseFloat, 0.25);
        setIf('markerOffsetX', document.getElementById('loc-markerOffsetX').value, parseInt,
            isTown || isCity || isPoi || isNature ? 16 : undefined);
        setIf('markerOffsetY', document.getElementById('loc-markerOffsetY').value, parseInt,
            isTown || isCity || isPoi || isNature ? 0 : undefined);
        setIf('labelOffsetX', document.getElementById('loc-labelOffsetX').value, parseInt,
            isTown || isCity ? 10 : (isPoi || isNature ? 0 : undefined));
        setIf('labelOffsetY', document.getElementById('loc-labelOffsetY').value, parseInt,
            isTown ? 3 : (isCity ? 5 : (isPoi || isNature ? 0 : undefined)));
        setIf('rotation', document.getElementById('loc-rotation').value, parseInt);
        setIf('textCurve', document.getElementById('loc-textCurve').value, parseFloat);
        setIf('opacity', document.getElementById('loc-opacity').value, parseFloat,
            isPoi || isNature ? 0.5 : undefined);

        return locData;
    }

    function previewLocation() {
        if (!state.selectedLocId) return;
        const idx = state.locations.findIndex(l => l.id === state.selectedLocId);
        if (idx !== -1) {
            state.locations[idx] = getLocationFromForm();
            refreshMap(); // Draws preview instantly, does not save to disk
        }
    }

    function saveLocation(skipListRender = false) {
        const locData = getLocationFromForm();
        const id = locData.id;

        if (state.selectedLocId) {
            const idx = state.locations.findIndex(l => l.id === state.selectedLocId);
            if (idx !== -1) {
                state.locations[idx] = locData;
            }
        } else {
            state.locations.push(locData);
            state.selectedLocId = id;
        }

        document.getElementById('loc-id').value = id;

        if (!skipListRender) {
            document.getElementById('btn-del-loc').style.display = 'inline-block';
            renderLocationList();
        }

        // Show success message
        const buttons = document.querySelectorAll('button');
        const saveBtn = Array.from(buttons).find(btn =>
            btn.getAttribute('onclick') && btn.getAttribute('onclick').includes('saveLocation')
        );
        if (saveBtn) {
            const origText = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Saved!';
            saveBtn.style.background = '#0a0';
            setTimeout(() => {
                saveBtn.innerHTML = origText;
                saveBtn.style.background = '';
            }, 2000);
        }

        refreshMap();

        // Auto-save to disk
        exportData().catch(err => {
            console.error('Failed to auto-save to disk:', err);
        });
    }

    function deleteLocation() {
        if (!state.selectedLocId) return;
        if (confirm('Are you sure you want to delete this location?')) {
            state.locations = state.locations.filter(l => l.id !== state.selectedLocId);
            cancelLocation();
            refreshMap();
            exportData().catch(err => console.error('Failed to auto-save to disk:', err));
        }
    }

    function cancelLocation() {
        state.selectedLocId = null;
        document.getElementById('location-form-area').style.display = 'none';

        // Clear dropdown
        const list = document.getElementById('location-list');
        if (list) list.value = '';

        renderLocationList();
    }

    // --- Roads ---

    function renderRoadList() {
        const list = document.getElementById('road-list');
        list.innerHTML = '';

        state.roads.forEach(road => {
            const el = document.createElement('div');
            el.className = 'list-item' + (state.selectedRoadId === road.id ? ' active' : '');
            const roadName = road.name || road.id;
            el.innerHTML = `<span>${roadName} <small style="color:#666">(${road.type})</small></span>`;
            el.onclick = () => selectRoad(road.id);
            list.appendChild(el);
        });
    }

    function selectRoad(id) {
        state.selectedRoadId = id;
        const road = state.roads.find(r => r.id === id);
        if (!road) return;

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

        // Reset location dropdowns
        updateLocationDropdowns();
        document.getElementById('road-start-location').value = '';
        document.getElementById('road-end-location').value = '';

        renderRoadPoints([]);

        // Auto save shell so we can add points
        saveRoad(true);
    }

    function renderRoadPoints(points) {
        const list = document.getElementById('road-points-list');
        list.innerHTML = '';
        if (points.length === 0) {
            list.innerHTML = '<div style="color:#666; font-style:italic; padding:0.5rem;">No points yet. Select start and end locations.</div>';
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
        const road = state.roads.find(r => r.id === state.selectedRoadId);
        if (road && road.points && idx > 0 && idx < road.points.length - 1 && Array.isArray(road.points[idx])) {
            state.editingWaypointIndex = idx;
            renderRoadPoints(road.points);
        }
    }

    function saveWaypoint(idx) {
        if (!state.selectedRoadId) return;
        const road = state.roads.find(r => r.id === state.selectedRoadId);
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
                    refreshMap();
                    saveRoad(false);
                }
            }
        }
    }

    function cancelEditWaypoint() {
        state.editingWaypointIndex = null;
        if (state.selectedRoadId) {
            const road = state.roads.find(r => r.id === state.selectedRoadId);
            if (road && road.points) {
                renderRoadPoints(road.points);
            }
        }
    }

    function removeRoadPoint(idx) {
        if (!state.selectedRoadId) return;
        const road = state.roads.find(r => r.id === state.selectedRoadId);
        if (road && road.points) {
            // Don't allow removing start or end locations - silently return
            if (idx === 0 || idx === road.points.length - 1) {
                return;
            }
            road.points.splice(idx, 1);
            state.editingWaypointIndex = null; // Cancel any editing
            renderRoadPoints(road.points);
            refreshMap();
            // Auto-save after removing point
            saveRoad(false);
        }
    }

    function setRoadStartLocation(locationId) {
        if (!state.selectedRoadId) return;
        const road = state.roads.find(r => r.id === state.selectedRoadId);
        if (road) {
            if (!road.points) road.points = [];
            if (road.points.length === 0) {
                road.points.push(locationId);
            } else {
                road.points[0] = locationId;
            }
            renderRoadPoints(road.points);
            refreshMap();
            saveRoad(false);
        }
    }

    function setRoadEndLocation(locationId) {
        if (!state.selectedRoadId) return;
        const road = state.roads.find(r => r.id === state.selectedRoadId);
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
            refreshMap();
            saveRoad(false);
        }
    }

    function clearRoadPoints() {
        if (!state.selectedRoadId) return;
        if (confirm('Clear all waypoints from this road? (Start and end locations will remain)')) {
            const road = state.roads.find(r => r.id === state.selectedRoadId);
            if (road && road.points) {
                // Keep start and end locations, remove only waypoints
                const start = road.points.length > 0 && typeof road.points[0] === 'string' ? road.points[0] : null;
                const end = road.points.length > 0 && typeof road.points[road.points.length - 1] === 'string' ? road.points[road.points.length - 1] : null;
                road.points = [];
                if (start) road.points.push(start);
                if (end && end !== start) road.points.push(end);
                renderRoadPoints(road.points);
                refreshMap();
                saveRoad(false);
            }
        }
    }

    function getRoadFromForm(isNew, searchId) {
        let id = document.getElementById('road-id').value;
        if (!id) id = searchId || 'road-' + Date.now();

        const roadData = {
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

        const startLocId = document.getElementById('road-start-location')?.value || '';
        const endLocId = document.getElementById('road-end-location')?.value || '';

        const existing = state.roads.find(r => r.id === searchId);

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

        return { roadData, startLocId, endLocId, existing, id };
    }

    function previewRoad() {
        if (!state.selectedRoadId) return;
        const idx = state.roads.findIndex(r => r.id === state.selectedRoadId);
        if (idx !== -1) {
            const { roadData } = getRoadFromForm(false, state.selectedRoadId);
            state.roads[idx] = roadData;
            refreshMap();
        }
    }

    function saveRoad(isNew = false) {
        const searchId = state.selectedRoadId || document.getElementById('road-id').value;
        const { roadData, startLocId, endLocId, existing, id } = getRoadFromForm(isNew, searchId);

        if (existing) {
            const idx = state.roads.indexOf(existing);
            if (idx !== -1) {
                state.roads[idx] = roadData;
            } else {
                state.roads.push(roadData);
            }
        } else {
            state.roads.push(roadData);
        }

        state.selectedRoadId = id;
        document.getElementById('road-id').value = id;

        if (!isNew) {
            document.getElementById('btn-del-road').style.display = 'inline-block';
            renderRoadList();
        }

        // Update the display to reflect saved state
        renderRoadPoints(roadData.points);

        console.log('Road saved:', roadData);
        console.log('Road points:', roadData.points);
        console.log('Start location exists:', state.locations.find(l => l.id === startLocId) ? 'YES' : 'NO');
        console.log('End location exists:', state.locations.find(l => l.id === endLocId) ? 'YES' : 'NO');
        console.log('Total roads in state:', state.roads.length);

        // Show success message
        if (!isNew) {
            // Find the save button by looking for button with onclick containing saveRoad
            const buttons = document.querySelectorAll('button');
            const saveBtn = Array.from(buttons).find(btn =>
                btn.getAttribute('onclick') && btn.getAttribute('onclick').includes('saveRoad')
            );
            if (saveBtn) {
                const origText = saveBtn.innerHTML;
                saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Saved!';
                saveBtn.style.background = '#0a0';
                setTimeout(() => {
                    saveBtn.innerHTML = origText;
                    saveBtn.style.background = '';
                }, 2000);
            }
        }

        refreshMap();

        // Auto-save to disk when manually saving (not during auto-saves)
        if (!isNew) {
            // Save to disk automatically
            exportData().catch(err => {
                console.error('Failed to auto-save to disk:', err);
                // Don't show error to user - they can manually save if needed
            });
        }
    }

    function deleteRoad() {
        if (!state.selectedRoadId) return;
        if (confirm('Are you sure you want to delete this road?')) {
            state.roads = state.roads.filter(r => r.id !== state.selectedRoadId);
            cancelRoad();
            refreshMap();
            exportData().catch(err => console.error('Failed to auto-save to disk:', err));
        }
    }

    function cancelRoad() {
        if (state.selectedRoadId) {
            const road = state.roads.find(r => r.id === state.selectedRoadId);
            // Prune if this was a brand new road that was canceled before getting a valid start point
            if (road && (!road.points || road.points.length === 0 || typeof road.points[0] !== 'string')) {
                state.roads = state.roads.filter(r => r.id !== state.selectedRoadId);
                refreshMap();
            }
        }
        state.selectedRoadId = null;
        document.getElementById('road-form-area').style.display = 'none';
        renderRoadList();
    }

    // --- Utility ---

    function refreshMap() {
        // Update CampaignData to return current state
        window.CampaignData = {
            init: async () => state,
            getData: () => state,
            getLocations: () => state.locations,
            getRoads: () => state.roads
        };

        // Log current state for debugging
        console.log('=== REFRESHING MAP ===');
        console.log('State roads:', state.roads.length);
        state.roads.forEach((road, idx) => {
            console.log(`  Road ${idx}: ${road.id}, points: ${road.points?.length || 0}`, road.points);
        });
        console.log('State locations:', state.locations.length);

        // We emit an event, MapOverlay handles the rest if it's listening to CampaignData
        document.dispatchEvent(new CustomEvent('campaign-data-updated', { detail: state }));

        // Force a small delay to ensure event is processed, then verify overlay updated
        setTimeout(() => {
            const overlay = document.getElementById('map-container-overlay');
            if (overlay) {
                const roadsInOverlay = overlay.querySelectorAll('.overlay-roads path').length;
                console.log(`Overlay updated. Roads rendered: ${roadsInOverlay}`);
            } else {
                console.warn('Map overlay not found!');
            }
        }, 100);
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
            const btn = document.querySelector('.btn-export');
            const origText = btn ? btn.innerHTML : 'Save to Disk';
            try {
                if (btn) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

                const response = await fetch('/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain' },
                    body: str
                });

                if (response.ok) {
                    if (btn) btn.innerHTML = '<i class="fa-solid fa-check"></i> Saved!';
                    setTimeout(() => { if (btn) btn.innerHTML = origText; }, 2000);
                } else {
                    throw new Error('Save failed');
                }
            } catch (err) {
                console.error("Save API failed. Falling back to download.", err);
                downloadFile(str);
                if (btn) btn.innerHTML = origText;
            }
        } else {
            // Fallback: Download blob
            downloadFile(str);
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

            updateLocationDropdowns();
            renderLocationList();
            renderRoadList();

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

            // Show success message
            const buttons = document.querySelectorAll('button');
            const reloadBtn = Array.from(buttons).find(btn =>
                btn.getAttribute('onclick') && btn.getAttribute('onclick').includes('reloadPage')
            );
            if (reloadBtn) {
                const origText = reloadBtn.innerHTML;
                reloadBtn.innerHTML = '<i class="fa-solid fa-check"></i> Reloaded!';
                reloadBtn.style.background = '#0a0';
                setTimeout(() => {
                    reloadBtn.innerHTML = origText;
                    reloadBtn.style.background = '';
                }, 2000);
            }
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

        // Roads
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

        // Core
        exportData,
        reloadPage,
        refreshMap
    };
})();
