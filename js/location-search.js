/**
 * World of Myrdae - Location Search
 * Filters WORLD_LOCATIONS by name and pans the map to the selected result.
 */

const LocationSearch = (function () {

    function init(containerId) {
        const input = document.getElementById('location-search');
        const results = document.getElementById('search-results');
        if (!input || !results) return;

        let debounceTimer;

        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const query = input.value.trim();
                if (!query) {
                    hide(results);
                    return;
                }
                const locations = CampaignData.getData().locations;
                const matches = locations
                    .filter(loc => loc.name.replace(/\n/g, ' ').toLowerCase().includes(query.toLowerCase()))
                    .slice(0, 8);
                renderResults(matches, results, containerId, input);
            }, 150);
        });

        // Keyboard nav: Escape closes results
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hide(results);
                input.blur();
            }
            if (e.key === 'Enter') {
                const first = results.querySelector('.search-result-item');
                if (first) first.click();
            }
        });

        // Close results when clicking outside the legend panel
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.legend-panel')) hide(results);
        });
    }

    function renderResults(matches, resultsEl, containerId, input) {
        resultsEl.innerHTML = '';

        if (!matches.length) {
            resultsEl.innerHTML = '<div class="search-no-results">No locations found</div>';
            resultsEl.style.display = 'block';
            return;
        }

        resultsEl.style.display = 'block';
        matches.forEach(loc => {
            const item = document.createElement('div');
            item.className = 'search-result-item';

            const name = document.createElement('span');
            name.className = 'search-result-name';
            name.textContent = loc.name.replace(/\n/g, ' ');

            const type = document.createElement('span');
            type.className = 'search-result-type';
            type.textContent = loc.type || '';

            item.appendChild(name);
            item.appendChild(type);

            item.addEventListener('click', () => {
                MapController.panToLocation(containerId, loc.x, loc.y, 5);
                input.value = loc.name.replace(/\n/g, ' ');
                hide(resultsEl);
            });

            resultsEl.appendChild(item);
        });
    }

    function hide(resultsEl) {
        resultsEl.innerHTML = '';
        resultsEl.style.display = 'none';
    }

    return { init };
})();
