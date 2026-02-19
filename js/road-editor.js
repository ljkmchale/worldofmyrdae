/**
 * Road Editor Tool
 * Allows interactive editing of road paths by dragging control points.
 */
const RoadEditor = (function () {
    let enabled = false;
    let mapContainer = null;
    let mapImg = null;
    let svgLayer = null;
    let activeRoad = null;
    let activePointIndex = -1;
    let isDragging = false;
    let natW = 0;
    let natH = 0;
    let newRoadStart = null;
    let tempRoadLine = null;
    let selectedRoad = null;

    function init(containerId, imageId) {
        mapContainer = document.getElementById(containerId);
        mapImg = document.getElementById(imageId);
        if (!mapContainer || !mapImg) return;

        // Create editor SVG layer (on top of map overlay)
        svgLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgLayer.setAttribute('class', 'road-editor-layer');
        svgLayer.style.position = 'absolute';
        svgLayer.style.top = '0';
        svgLayer.style.left = '0';
        svgLayer.style.width = '100%';
        svgLayer.style.height = '100%';
        svgLayer.style.pointerEvents = 'none'; // Allow clicks to pass through unless on handle
        svgLayer.style.zIndex = '1000';
        svgLayer.style.display = 'none';

        // Sync transform
        svgLayer.style.willChange = 'transform';

        // Insert after map image (and map overlay)
        // mapImg.parentNode.appendChild(svgLayer); // Don't append until enabled

        // Global mouse events for dragging
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('keydown', onKeyDown);

        // Update dimensions on load
        if (mapImg.complete) updateDims();
        else mapImg.onload = updateDims;
    }

    function updateDims() {
        natW = mapImg.naturalWidth;
        natH = mapImg.naturalHeight;
        svgLayer.setAttribute('viewBox', `0 0 ${natW} ${natH}`);
        svgLayer.setAttribute('preserveAspectRatio', 'xMinYMin meet');
    }

    let exportBtn = null;

    function toggleEditMode() {
        enabled = !enabled;

        if (enabled) {
            svgLayer.style.display = 'block';
            if (!svgLayer.parentNode) {
                mapImg.parentNode.appendChild(svgLayer);
            }

            // Sync transform with map image
            if (mapImg.style.transform) {
                svgLayer.style.transform = mapImg.style.transform;
                svgLayer.style.transformOrigin = mapImg.style.transformOrigin;
            }

            renderHandles();

            // Create Export Button
            if (!exportBtn) {
                exportBtn = document.createElement('button');
                exportBtn.innerText = 'Save Road Data';
                exportBtn.style.position = 'absolute';
                exportBtn.style.top = '20px';
                exportBtn.style.left = '50%';
                exportBtn.style.transform = 'translateX(-50%)';
                exportBtn.style.zIndex = '2000';
                exportBtn.style.padding = '10px 20px';
                exportBtn.style.backgroundColor = '#d4af37';
                exportBtn.style.color = '#000';
                exportBtn.style.border = '2px solid #fff';
                exportBtn.style.borderRadius = '6px';
                exportBtn.style.cursor = 'pointer';
                exportBtn.style.fontWeight = 'bold';
                exportBtn.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
                exportBtn.onclick = exportData;
                mapContainer.appendChild(exportBtn);
            }
            exportBtn.style.display = 'block';
        } else {
            svgLayer.style.display = 'none';
            svgLayer.innerHTML = ''; // Clear handles
            if (svgLayer.parentNode) {
                svgLayer.parentNode.removeChild(svgLayer);
            }
            if (exportBtn) exportBtn.style.display = 'none';
        }
    }

    function renderHandles() {
        svgLayer.innerHTML = ''; // Clear existing
        const data = MapOverlay.getData();
        if (!data) return;

        // Render Location Handles (Blue) for New Roads
        if (data.locations) {
            data.locations.forEach(loc => {
                const px = (loc.x / 100) * natW;
                const py = (loc.y / 100) * natH;
                const r = natW * 0.003; // Reduced from 0.006

                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', px);
                circle.setAttribute('cy', py);
                circle.setAttribute('r', r);
                circle.setAttribute('fill', 'rgba(0, 191, 255, 0.4)'); // Translucent blue
                circle.setAttribute('stroke', '#00BFFF');
                circle.setAttribute('stroke-width', '1'); // Reduced from 2
                circle.style.pointerEvents = 'auto';
                circle.style.cursor = 'crosshair';
                circle.setAttribute('data-loc-id', loc.id);

                circle.addEventListener('mousedown', (e) => startNewRoadDrag(e, loc, px, py));
                svgLayer.appendChild(circle);
            });
        }

        if (!data.roads) return;

        // Get location map for resolving IDs
        // We can access it via MapOverlay closure if exposed, or strictly rely on data
        // Actually, we need to know the coordinates of IDs to draw handles there, 
        // but we only want to drag INTERMEDIATE points (arrays). 
        // We can draw handles for IDs but make them fixed (different color).

        const locs = new Map();
        if (data.locations) data.locations.forEach(l => locs.set(l.id, l));

        data.roads.forEach(road => {
            if (!road.points) return;
            road.points.forEach((pt, index) => {
                let px, py, isFixed = false;

                if (typeof pt === 'string') {
                    const l = locs.get(pt);
                    if (l) {
                        px = (l.x / 100) * natW;
                        py = (l.y / 100) * natH;
                        isFixed = true;
                    }
                } else if (Array.isArray(pt)) {
                    px = (pt[0] / 100) * natW;
                    py = (pt[1] / 100) * natH;
                }

                if (px !== undefined) {
                    const isSelected = (road === selectedRoad);
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', px);
                    circle.setAttribute('cy', py);
                    circle.setAttribute('r', isFixed ? natW * 0.002 : natW * 0.003);
                    // Highlight selected road handles
                    const fillColor = isFixed ? '#888' : (isSelected ? '#FF4500' : '#FFD700');
                    circle.setAttribute('fill', fillColor);
                    circle.setAttribute('stroke', isSelected ? '#fff' : '#000');
                    circle.setAttribute('stroke-width', '1');
                    circle.style.pointerEvents = 'auto';
                    circle.style.cursor = isFixed ? 'default' : 'move';

                    circle.style.cursor = isFixed ? 'pointer' : 'move'; // Changed from default to pointer

                    // Always allow dragging/clicking (for selection)
                    circle.addEventListener('mousedown', (e) => startDrag(e, road, index, circle));

                    svgLayer.appendChild(circle);
                }
            });
        });
    }

    function startDrag(e, road, index, element) {
        if (!enabled) return;
        isDragging = true;
        activeRoad = road;
        selectedRoad = road; // Select on click/drag
        activePointIndex = index;
        renderHandles(); // Update selection visual immediately
        // element is the SVG circle
        e.stopPropagation();
        e.preventDefault();
    }

    function startNewRoadDrag(e, loc, px, py) {
        if (!enabled) return;
        isDragging = true;
        newRoadStart = { id: loc.id, x: px, y: py };

        tempRoadLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        tempRoadLine.setAttribute('x1', px);
        tempRoadLine.setAttribute('y1', py);
        tempRoadLine.setAttribute('x2', px);
        tempRoadLine.setAttribute('y2', py);
        tempRoadLine.setAttribute('stroke', '#00BFFF');
        tempRoadLine.setAttribute('stroke-width', '1'); // Reduced from 3
        tempRoadLine.setAttribute('stroke-dasharray', '5,5');
        svgLayer.appendChild(tempRoadLine);

        e.stopPropagation();
        e.preventDefault();
    }

    function onDrag(e) {
        if (!isDragging) return;
        if (!activeRoad && !newRoadStart) return;

        // Convert mouse position to SVG coordinates
        // We need to account for the MapController transform (scale/translate)
        // simpler way: use getScreenCTM() of the SVG element? 
        // But the SVG itself is transformed by CSS.

        // Let's get the click relative to the image (which is the coordinate system)
        const rect = mapImg.getBoundingClientRect();
        const scaleX = natW / rect.width;
        const scaleY = natH / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // Update point data (convert back to percentages)
        // Update point data (convert back to percentages)
        const newPt = [
            parseFloat(((x / natW) * 100).toFixed(1)), // Fix precision
            parseFloat(((y / natH) * 100).toFixed(1))
        ];

        if (activeRoad) {
            // Check if point is fixed (string = location ID)
            const currentPt = activeRoad.points[activePointIndex];
            if (typeof currentPt === 'string') return; // Fixed point, cannot drag (only select)

            activeRoad.points[activePointIndex] = newPt;
            // Refresh visuals
            MapOverlay.refreshRoad(activeRoad.id);
            renderHandles(); // Re-render handle at new position
        } else if (newRoadStart) {
            // Update temp line
            if (tempRoadLine) {
                tempRoadLine.setAttribute('x2', x);
                tempRoadLine.setAttribute('y2', y);
            }
        }
    }

    function endDrag(e) {
        if (!isDragging) return;

        if (newRoadStart) {
            // Check drop target
            const rect = mapImg.getBoundingClientRect();
            const scaleX = natW / rect.width;
            const scaleY = natH / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            // Check if dropped on a location
            let endLocId = null;
            const threshold = natW * 0.015; // Hit radius

            const data = MapOverlay.getData();
            if (data && data.locations) {
                for (let loc of data.locations) {
                    if (loc.id === newRoadStart.id) continue; // Don't snap to start
                    const lx = (loc.x / 100) * natW;
                    const ly = (loc.y / 100) * natH;
                    const dist = Math.hypot(x - lx, y - ly);
                    if (dist < threshold) {
                        endLocId = loc.id;
                        break;
                    }
                }
            }

            const endPt = endLocId ? endLocId : [parseFloat(((x / natW) * 100).toFixed(1)), parseFloat(((y / natH) * 100).toFixed(1))];

            // Create new road
            const newRoad = {
                id: 'road-' + Date.now(),
                points: [newRoadStart.id, endPt],
                type: 'minor', // Default
                curved: true
            };

            MapOverlay.addRoadToMap(newRoad);
            renderHandles();

            // Cleanup
            if (tempRoadLine) {
                tempRoadLine.remove();
                tempRoadLine = null;
            }
            newRoadStart = null;
        }

        if (isDragging || newRoadStart) {
            if (typeof CampaignData !== 'undefined') CampaignData.save();
        }

        isDragging = false;
        activeRoad = null;
        activePointIndex = -1;
    }

    async function exportData() {
        const data = MapOverlay.getData();
        if (!data) return;

        const json = JSON.stringify(data, null, 4);

        // Try File System Access API (Native Save)
        if (window.showSaveFilePicker) {
            try {
                const handle = await window.showSaveFilePicker({
                    suggestedName: 'locations.json',
                    types: [{
                        description: 'JSON Files',
                        accept: { 'application/json': ['.json'] },
                    }],
                });
                const writable = await handle.createWritable();
                await writable.write(json);
                await writable.close();
                alert('Saved successfully!');
                return;
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error saving file:', err);
                    alert('Error saving file: ' + err.message);
                }
                return; // Stop if cancelled or error
            }
        }

        // Fallback to Blob download
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'locations.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function onKeyDown(e) {
        if (!enabled || !selectedRoad) return;
        if (e.key === 'Delete' || e.key === 'Backspace') {
            deleteSelectedRoad();
        }
    }

    function deleteSelectedRoad() {
        if (!selectedRoad) return;
        const data = MapOverlay.getData();
        if (!data || !data.roads) return;

        // Remove from data
        const idx = data.roads.indexOf(selectedRoad);
        if (idx > -1) {
            data.roads.splice(idx, 1);

            // Remove DOM element
            const path = document.getElementById('road-path-' + selectedRoad.id);
            if (path) path.remove();

            selectedRoad = null;
            renderHandles(); // Refresh handles (clears deleted road handles)
            if (typeof CampaignData !== 'undefined') CampaignData.save();
        }
    }

    return {
        init: init,
        toggleEditMode: toggleEditMode,
        exportData: exportData
    };
})();
