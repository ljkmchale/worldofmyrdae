/**
 * World of Myrdae - Location Editor
 * Handles creation and editing of map locations
 */

const LocationEditor = (function () {
    let modal = null;
    let contextMenu = null;
    let pendingCoords = { x: 0, y: 0 };
    let editingLocId = null;

    function init() {
        if (!document.getElementById('location-modal')) {
            const modalHtml = `
            <div id="location-modal" class="modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 10000; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
                <div class="modal-content location-editor-modal" style="background: linear-gradient(145deg, #1a1a25, #0a0a0f); border: 2px solid var(--color-gold); border-radius: 12px; padding: 1.5rem; width: 95%; max-width: 700px; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.8); max-height: 90vh; overflow-y: auto;">
                    <button class="modal-close" onclick="LocationEditor.close()" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: var(--color-text-muted); cursor: pointer; font-size: 1.2rem; z-index: 10;">✕</button>
                    <h2 id="modal-title" style="font-family: var(--font-display); color: var(--color-gold-bright); margin-bottom: 1rem; text-align: center; font-size: 1.5rem; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 0.5rem;">
                        <i class="fa-solid fa-map-pin"></i> Create New Location
                    </h2>
                    
                    <form id="location-form" class="editor-form">
                        <input type="hidden" id="loc-id">
                        
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="loc-name">Location Name</label>
                                <input type="text" id="loc-name" required placeholder="e.g. Iron Citadel">
                            </div>
                            
                            <div class="form-group">
                                <label for="loc-type">Type</label>
                                <select id="loc-type">
                                    <option value="city">City</option>
                                    <option value="capital">Capital</option>
                                    <option value="town">Town</option>
                                    <option value="village">Village</option>
                                    <option value="port">Port</option>
                                    <option value="ruins">Ruins</option>
                                    <option value="landmark">Landmark</option>
                                    <option value="pass">Mountain Pass</option>
                                    <option value="region">Region/Area</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="loc-desc">Short Description (Flavor text)</label>
                            <textarea id="loc-desc" rows="2" placeholder="Whispers of the ancient kings still echo..."></textarea>
                        </div>

                        <div class="form-group">
                            <label for="loc-details">Long Details / Lore</label>
                            <textarea id="loc-details" rows="3" placeholder="History, secrets, and detailed notes..."></textarea>
                        </div>

                        <div class="form-section-title">Visual Overrides</div>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Coordinates (%)</label>
                                <div style="display: flex; gap: 0.5rem;">
                                    <input type="number" id="loc-x" step="0.1" required>
                                    <input type="number" id="loc-y" step="0.1" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="loc-marker-size">Marker Scale (0 = Label only)</label>
                                <input type="number" id="loc-marker-size" step="0.1" value="1.0">
                            </div>
                            <div class="form-group">
                                <label for="loc-font-size">Font Size (px)</label>
                                <input type="number" id="loc-font-size" step="1" placeholder="Default">
                            </div>
                            <div class="form-group">
                                <label for="loc-region-name">Region Category</label>
                                <input type="text" id="loc-region-name" placeholder="e.g. Otesurr Mountains">
                            </div>
                            <div class="form-group">
                                <label for="loc-opacity">Opacity (0.0 - 1.0)</label>
                                <input type="number" id="loc-opacity" step="0.1" min="0" max="1" placeholder="1.0">
                            </div>
                        </div>

                        <div class="form-section-title">Label Offsets (Relative to Dot)</div>
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="loc-label-offset-x">Label Offset X</label>
                                <input type="number" id="loc-label-offset-x" step="1" placeholder="Default">
                            </div>
                            <div class="form-group">
                                <label for="loc-label-offset-y">Label Offset Y</label>
                                <input type="number" id="loc-label-offset-y" step="1" placeholder="Default">
                            </div>
                            <div class="form-group">
                                <label for="loc-marker-offset-x">Marker Offset X</label>
                                <input type="number" id="loc-marker-offset-x" step="1" placeholder="0">
                            </div>
                            <div class="form-group">
                                <label for="loc-marker-offset-y">Marker Offset Y</label>
                                <input type="number" id="loc-marker-offset-y" step="1" placeholder="0">
                            </div>
                        </div>

                        <div style="margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: space-between;">
                            <button type="button" id="delete-loc-btn" class="btn btn-secondary" style="color: #ff4d4d; border-color: #ff4d4d; display: none;" onclick="LocationEditor.deleteLoc()">Delete</button>
                            <div style="display: flex; gap: 1rem;">
                                <button type="button" class="btn btn-secondary" onclick="LocationEditor.close()">Cancel</button>
                                <button type="submit" class="btn btn-primary" style="background: linear-gradient(135deg, #b8860b, #8b0000); border: 1px solid var(--color-gold);">Save Location</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Context Menu -->
            <div id="map-context-menu" style="display: none; position: fixed; z-index: 10001; background: #15151f; border: 1px solid var(--color-gold); border-radius: 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); min-width: 180px; overflow: hidden;">
                <div onclick="LocationEditor.handleContextAction('create')" style="padding: 0.75rem 1rem; cursor: pointer; color: var(--color-text-primary); transition: background 0.2s; display: flex; align-items: center; gap: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <i class="fa-solid fa-plus" style="color: var(--color-gold);"></i> Create Location Here
                </div>
                <div onclick="LocationEditor.hideContextMenu()" style="padding: 0.5rem 1rem; cursor: pointer; color: var(--color-text-muted); font-size: 0.85rem; text-align: center; background: rgba(0,0,0,0.2);">
                    Cancel
                </div>
            </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);

            document.getElementById('location-form').onsubmit = (e) => {
                e.preventDefault();
                saveLocation();
            };
        }

        modal = document.getElementById('location-modal');
        contextMenu = document.getElementById('map-context-menu');

        window.addEventListener('click', (e) => {
            if (contextMenu.style.display === 'block' && !contextMenu.contains(e.target)) {
                hideContextMenu();
            }
        });

        const containers = document.querySelectorAll('.map-container');
        containers.forEach(container => {
            container.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                showContextMenu(e, container);
            });
        });
    }

    function showContextMenu(e, container) {
        const state = MapController.getInstanceState(container.id);
        if (!state) return;

        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const scale = state.scale;
        const tx = state.pointX;
        const ty = state.pointY;
        const cw = container.offsetWidth;
        const img = container.querySelector('.map-image');

        const imgDisplayWidth = cw * scale;
        const imgDisplayHeight = (img.naturalHeight / img.naturalWidth) * cw * scale;

        pendingCoords.x = parseFloat(((mouseX - tx) / imgDisplayWidth * 100).toFixed(1));
        pendingCoords.y = parseFloat(((mouseY - ty) / imgDisplayHeight * 100).toFixed(1));

        contextMenu.style.left = e.clientX + 'px';
        contextMenu.style.top = e.clientY + 'px';
        contextMenu.style.display = 'block';

        const menuRect = contextMenu.getBoundingClientRect();
        if (e.clientX + menuRect.width > window.innerWidth) contextMenu.style.left = (e.clientX - menuRect.width) + 'px';
        if (e.clientY + menuRect.height > window.innerHeight) contextMenu.style.top = (e.clientY - menuRect.height) + 'px';
    }

    function hideContextMenu() {
        contextMenu.style.display = 'none';
    }

    function handleContextAction(action) {
        hideContextMenu();
        if (action === 'create') {
            open();
            document.getElementById('loc-x').value = pendingCoords.x;
            document.getElementById('loc-y').value = pendingCoords.y;
        }
    }

    function open(locId = null) {
        const form = document.getElementById('location-form');
        form.reset();
        editingLocId = locId;

        const deleteBtn = document.getElementById('delete-loc-btn');
        const title = document.getElementById('modal-title');

        if (locId) {
            title.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Location';
            deleteBtn.style.display = 'block';
            const loc = CampaignData.getLocation(locId);
            if (loc) {
                document.getElementById('loc-id').value = loc.id;
                document.getElementById('loc-name').value = loc.name || '';
                document.getElementById('loc-type').value = loc.type || 'town';
                document.getElementById('loc-x').value = loc.x || 0;
                document.getElementById('loc-y').value = loc.y || 0;
                document.getElementById('loc-desc').value = loc.description || '';
                document.getElementById('loc-details').value = loc.details || '';
                document.getElementById('loc-region-name').value = loc.region || '';
                document.getElementById('loc-marker-size').value = loc.markerSize !== undefined ? loc.markerSize : 1.0;
                document.getElementById('loc-font-size').value = loc.fontSize || '';
                document.getElementById('loc-label-offset-x').value = loc.labelOffsetX !== undefined ? loc.labelOffsetX : '';
                document.getElementById('loc-label-offset-y').value = loc.labelOffsetY !== undefined ? loc.labelOffsetY : '';
                document.getElementById('loc-marker-offset-x').value = loc.markerOffsetX !== undefined ? loc.markerOffsetX : '';
                document.getElementById('loc-marker-offset-y').value = loc.markerOffsetY !== undefined ? loc.markerOffsetY : '';
                document.getElementById('loc-opacity').value = loc.opacity !== undefined ? loc.opacity : '';
            }
        } else {
            title.innerHTML = '<i class="fa-solid fa-map-pin"></i> Create New Location';
            deleteBtn.style.display = 'none';
            document.getElementById('loc-id').value = '';
        }

        modal.style.display = 'flex';
    }

    function close() {
        modal.style.display = 'none';
    }

    function deleteLoc() {
        if (!editingLocId) return;
        if (confirm('Are you sure you want to delete this location?')) {
            const data = CampaignData.getData();
            data.locations = data.locations.filter(l => l.id !== editingLocId);
            CampaignData.save();
            refreshAllOverlays();
            close();
        }
    }

    function saveLocation() {
        const id = document.getElementById('loc-id').value;
        const name = document.getElementById('loc-name').value;

        const getVal = (id) => document.getElementById(id).value;
        const getNum = (id) => {
            const val = getVal(id);
            return val === '' ? undefined : parseFloat(val);
        };

        const locData = {
            id: id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name,
            type: getVal('loc-type'),
            x: getNum('loc-x'),
            y: getNum('loc-y'),
            description: getVal('loc-desc'),
            details: getVal('loc-details'),
            region: getVal('loc-region-name'),
            markerSize: getNum('loc-marker-size'),
            fontSize: getNum('loc-font-size'),
            labelOffsetX: getNum('loc-label-offset-x'),
            labelOffsetY: getNum('loc-label-offset-y'),
            markerOffsetX: getNum('loc-marker-offset-x'),
            markerOffsetY: getNum('loc-marker-offset-y'),
            opacity: getNum('loc-opacity')
        };

        if (id) {
            CampaignData.updateLocation(id, locData);
        } else {
            CampaignData.addLocation(locData);
        }

        refreshAllOverlays();
        close();
    }

    function refreshAllOverlays() {
        const containers = document.querySelectorAll('.map-container');
        containers.forEach(c => {
            const img = c.querySelector('.map-image');
            if (img) {
                const existing = document.getElementById(c.id + '-overlay');
                if (existing) existing.remove();
                MapOverlay.init(c.id, img.id);
            }
        });
    }

    return {
        init, open, close, handleContextAction, hideContextMenu, deleteLoc
    };
})();
