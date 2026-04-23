window.MyrdaeWorldClock = (function () {
    const DAY_REAL_MS = 60 * 60 * 1000; // 1 real hour = 1 Myrdae day
    const HOURS_PER_DAY = 24;
    const YEAR_DAYS = 384;
    const STRETCH_DAYS = 8;
    const YEAR_HOURS = YEAR_DAYS * HOURS_PER_DAY;
    const WHEEL_YEAR_START_ANGLE = -135;
    const REAL_WORLD_REFERENCE_YEAR = 2026;
    const CAMPAIGN_STORAGE_KEY = 'myrdae_world_clock_campaign';
    const CAMPAIGN_REGISTRY_URL = '/api/world-clock/campaigns?sync=1';
    const WHEEL_SEASON_COLORS = {
        Natali: '#c7e3ac',
        Sultra: '#ffe79a',
        Garnest: '#eda566',
        Briscarn: '#b9d0ea'
    };
    const SEASON_DETAILS = {
        Natali: {
            knownAs: 'Season of Birth',
            similarTo: 'Spring'
        },
        Sultra: {
            knownAs: 'Season of Light',
            similarTo: 'Summer'
        },
        Garnest: {
            knownAs: 'Season of Gathering',
            similarTo: 'Fall'
        },
        Briscarn: {
            knownAs: 'Season of Fading',
            similarTo: 'Winter'
        }
    };
    const HARMONS = [
        { name: 'Talil', days: 48, season: 'Garnest' },
        { name: 'Paramor', days: 48, season: 'Briscarn' },
        { name: 'Luros', days: 48, season: 'Briscarn' },
        { name: 'Kesero', days: 48, season: 'Natali' },
        { name: 'Nessae', days: 48, season: 'Natali' },
        { name: 'Hemist', days: 48, season: 'Sultra' },
        { name: 'Baergrun', days: 48, season: 'Sultra' },
        { name: 'Ezale', days: 48, season: 'Garnest' }
    ];
    const START_YEAR = 1246;
    const START_HARMON_INDEX = 0;
    const START_HARMON_DAY = 36;
    const START_HOUR = 0;
    const START_DAY_OF_YEAR = HARMONS
        .slice(0, START_HARMON_INDEX)
        .reduce((sum, harmon) => sum + harmon.days, 0) + START_HARMON_DAY;

    let anchorRealMs = performance.now();
    let anchorWorldHours = (((START_YEAR - 1) * YEAR_DAYS) + (START_DAY_OF_YEAR - 1)) * HOURS_PER_DAY + START_HOUR;
    let animationStarted = false;
    let activeTimeMode = 'default';
    let activeCampaignId = '';
    let activeCampaignName = '';
    let campaignRegistry = [];
    let campaignRegistryLoaded = false;
    const listeners = new Set();

    function positiveModulo(value, mod) {
        return ((value % mod) + mod) % mod;
    }

    function formatTimeLabel(hour, minute = 0) {
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    function formatOrdinal(value) {
        const mod100 = value % 100;
        if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
        const mod10 = value % 10;
        if (mod10 === 1) return `${value}st`;
        if (mod10 === 2) return `${value}nd`;
        if (mod10 === 3) return `${value}rd`;
        return `${value}th`;
    }

    function getHarmonInfo(dayOfYear) {
        let remaining = dayOfYear;
        for (let index = 0; index < HARMONS.length; index += 1) {
            const harmon = HARMONS[index];
            if (remaining <= harmon.days) {
                return {
                    harmonIndex: index,
                    harmonName: harmon.name,
                    dayOfHarmon: remaining,
                    stretch: Math.ceil(remaining / STRETCH_DAYS),
                    season: harmon.season
                };
            }
            remaining -= harmon.days;
        }

        const lastHarmon = HARMONS[HARMONS.length - 1];
        return {
            harmonIndex: HARMONS.length - 1,
            harmonName: lastHarmon.name,
            dayOfHarmon: lastHarmon.days,
            stretch: Math.ceil(lastHarmon.days / STRETCH_DAYS),
            season: lastHarmon.season
        };
    }

    function getDayOfYearFromHarmon(harmonName, dayOfHarmon) {
        const harmonIndex = HARMONS.findIndex(harmon => harmon.name.toLowerCase() === String(harmonName || '').toLowerCase());
        if (harmonIndex === -1) return null;

        const safeDay = Math.max(1, Math.min(HARMONS[harmonIndex].days, parseInt(dayOfHarmon, 10) || 1));
        return HARMONS
            .slice(0, harmonIndex)
            .reduce((sum, harmon) => sum + harmon.days, 0) + safeDay;
    }

    function formatFullDate(dayOfHarmon, harmonName, year) {
        return `${formatOrdinal(dayOfHarmon)} of ${harmonName}, ${year}`;
    }

    function getEarthDayOfYear(date) {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const msPerDay = 24 * 60 * 60 * 1000;
        return Math.floor((date - startOfYear) / msPerDay) + 1;
    }

    function getEarthYearDays(year) {
        return new Date(year, 1, 29).getMonth() === 1 ? 366 : 365;
    }

    function mapRealDateToWorldAnchor(date = new Date()) {
        const earthDayOfYear = getEarthDayOfYear(date);
        const earthYearDays = getEarthYearDays(date.getFullYear());
        const dayRatio = (earthDayOfYear - 1) / earthYearDays;
        const worldDayOfYear = Math.min(YEAR_DAYS, Math.max(1, Math.floor(dayRatio * YEAR_DAYS) + 1));

        return {
            year: START_YEAR + (date.getFullYear() - REAL_WORLD_REFERENCE_YEAR),
            dayOfYear: worldDayOfYear,
            hour: date.getHours(),
            minute: date.getMinutes()
        };
    }

    function polarToCartesian(cx, cy, radius, angleDeg) {
        const angle = (angleDeg - 90) * Math.PI / 180;
        return {
            x: cx + (radius * Math.cos(angle)),
            y: cy + (radius * Math.sin(angle))
        };
    }

    function describeArc(cx, cy, radius, startAngle, endAngle) {
        const start = polarToCartesian(cx, cy, radius, endAngle);
        const end = polarToCartesian(cx, cy, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
    }

    function describeRingSlice(cx, cy, outerRadius, innerRadius, startAngle, endAngle) {
        const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle);
        const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle);
        const innerEnd = polarToCartesian(cx, cy, innerRadius, startAngle);
        const innerStart = polarToCartesian(cx, cy, innerRadius, endAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

        return [
            `M ${outerStart.x} ${outerStart.y}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
            `L ${innerStart.x} ${innerStart.y}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerEnd.x} ${innerEnd.y}`,
            'Z'
        ].join(' ');
    }

    function renderWheelMarkup(state) {
        const size = 280;
        const cx = 140;
        const cy = 140;
        const seasonOuter = 108;
        const seasonInner = 78;
        const harmonOuter = 78;
        const harmonInner = 42;
        const activeDayOfYear = state.dayOfYear - 1;
        const dayAngle = WHEEL_YEAR_START_ANGLE + ((activeDayOfYear / YEAR_DAYS) * 360);
        const pointerStart = polarToCartesian(cx, cy, 16, dayAngle);
        const pointerEnd = polarToCartesian(cx, cy, 70, dayAngle);
        const marker = polarToCartesian(cx, cy, seasonOuter + 4, dayAngle);

        const seasonNames = ['Briscarn', 'Natali', 'Sultra', 'Garnest'];
        const seasonSlices = seasonNames.map((season, index) => {
            const startAngle = -45 + (index * 90);
            const endAngle = startAngle + 90;
            const labelPos = polarToCartesian(cx, cy, (seasonOuter + seasonInner) / 2, startAngle + 45);
            return `
                <path d="${describeRingSlice(cx, cy, seasonOuter, seasonInner, startAngle, endAngle)}"
                    fill="${WHEEL_SEASON_COLORS[season]}"
                    stroke="rgba(88,68,51,0.75)"
                    stroke-width="1.2"></path>
                <text x="${labelPos.x}" y="${labelPos.y}" fill="rgba(92,74,55,0.95)"
                    font-family="Cormorant Garamond, serif" font-size="11"
                    text-anchor="middle" dominant-baseline="middle"
                    transform="rotate(${startAngle + 45}, ${labelPos.x}, ${labelPos.y})">${season}</text>
            `;
        }).join('');

        const harmonSlices = HARMONS.map((harmon, index) => {
            const startAngle = -135 + (index * 45);
            const endAngle = startAngle + 45;
            const isActive = harmon.name === state.harmonName;
            const labelPos = polarToCartesian(cx, cy, (harmonOuter + harmonInner) / 2, startAngle + 22.5);
            return `
                <path d="${describeRingSlice(cx, cy, harmonOuter, harmonInner, startAngle, endAngle)}"
                    fill="${isActive ? 'rgba(255,248,220,0.92)' : 'rgba(246,240,214,0.88)'}"
                    stroke="rgba(117,100,76,0.82)"
                    stroke-width="${isActive ? 2 : 1.1}"></path>
                <text x="${labelPos.x}" y="${labelPos.y}" fill="rgba(90,78,61,0.95)"
                    font-family="Cormorant Garamond, serif" font-size="11"
                    text-anchor="middle" dominant-baseline="middle"
                    transform="rotate(${startAngle + 22.5}, ${labelPos.x}, ${labelPos.y})">${harmon.name}</text>
            `;
        }).join('');

        return `
            <svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" aria-label="World clock wheel">
                <defs>
                    <filter id="wheelShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.45)"></feDropShadow>
                    </filter>
                </defs>
                <g filter="url(#wheelShadow)">
                    ${seasonSlices}
                    ${harmonSlices}
                    <circle cx="${cx}" cy="${cy}" r="${harmonInner}" fill="rgba(252,248,240,0.95)" stroke="rgba(112,95,72,0.85)" stroke-width="1.3"></circle>
                </g>
                <path d="${describeArc(cx, cy, seasonInner, -135, 225)}" fill="none" stroke="rgba(117,100,76,0.55)" stroke-width="1"></path>
                <line x1="${pointerStart.x}" y1="${pointerStart.y}" x2="${pointerEnd.x}" y2="${pointerEnd.y}" stroke="rgba(45,44,48,0.85)" stroke-width="2.2" stroke-linecap="round"></line>
                <circle cx="${cx}" cy="${cy}" r="3.5" fill="rgba(45,44,48,0.95)"></circle>
                <circle cx="${marker.x}" cy="${marker.y}" r="4.5" fill="#d4af37" stroke="rgba(45,44,48,0.8)" stroke-width="1.2"></circle>
            </svg>
        `;
    }

    function getWorldHours(now = performance.now()) {
        const elapsedRealMs = now - anchorRealMs;
        return anchorWorldHours + ((elapsedRealMs / DAY_REAL_MS) * HOURS_PER_DAY);
    }

    function getState(now = performance.now()) {
        const totalWorldHours = getWorldHours(now);
        const wholeDays = Math.floor(totalWorldHours / HOURS_PER_DAY);
        const year = Math.floor(wholeDays / YEAR_DAYS) + 1;
        const cycleHours = positiveModulo(totalWorldHours, YEAR_HOURS);
        const dayIndex = Math.floor(cycleHours / HOURS_PER_DAY);
        const dayHourProgress = positiveModulo(cycleHours, HOURS_PER_DAY);
        const hour = Math.floor(dayHourProgress);
        const minute = Math.floor((dayHourProgress - hour) * 60);
        const dayOfYear = dayIndex + 1;
        const harmonInfo = getHarmonInfo(dayOfYear);
        const seasonDetails = SEASON_DETAILS[harmonInfo.season] || {
            knownAs: harmonInfo.season,
            similarTo: 'Unknown'
        };

        return {
            totalWorldHours,
            cycleHours,
            dayOfYear,
            year,
            hour,
            minute,
            season: harmonInfo.season,
            seasonKnownAs: seasonDetails.knownAs,
            seasonSimilarTo: seasonDetails.similarTo,
            harmonName: harmonInfo.harmonName,
            dayOfHarmon: harmonInfo.dayOfHarmon,
            stretch: harmonInfo.stretch,
            fullDateLabel: formatFullDate(harmonInfo.dayOfHarmon, harmonInfo.harmonName, year),
            hourLabel: formatTimeLabel(hour, minute),
            compactLabel: `${formatFullDate(harmonInfo.dayOfHarmon, harmonInfo.harmonName, year)}  ·  ${harmonInfo.season}  ·  Stretch ${harmonInfo.stretch}  ·  ${formatTimeLabel(hour, minute)}`,
            timeMode: activeTimeMode,
            campaignId: activeCampaignId,
            campaignName: activeCampaignName
        };
    }

    function notifyListeners(now = performance.now()) {
        const state = getState(now);
        listeners.forEach(listener => listener(state));
        return state;
    }

    function tick(now) {
        notifyListeners(now);
        requestAnimationFrame(tick);
    }

    function ensureAnimationLoop() {
        if (animationStarted) return;
        animationStarted = true;
        requestAnimationFrame(tick);
    }

    function setAnchor({ year, dayOfYear, hour = 0, minute = 0, source = 'manual', campaignId = '', campaignName = '' }) {
        const safeYear = Math.max(1, parseInt(year, 10) || START_YEAR);
        const safeDay = Math.min(YEAR_DAYS, Math.max(1, parseInt(dayOfYear, 10) || 1));
        const safeHour = Math.min(HOURS_PER_DAY - 1, Math.max(0, parseInt(hour, 10) || 0));
        const safeMinute = Math.min(59, Math.max(0, parseInt(minute, 10) || 0));

        anchorWorldHours = ((((safeYear - 1) * YEAR_DAYS) + (safeDay - 1)) * HOURS_PER_DAY) + safeHour + (safeMinute / 60);
        anchorRealMs = performance.now();
        activeTimeMode = source;
        activeCampaignId = campaignId || '';
        activeCampaignName = campaignName || '';
        notifyListeners(anchorRealMs);
    }

    function setTime({ dayOfYear, hour, minute = 0 }) {
        const currentYear = getState().year;
        setAnchor({
            year: currentYear,
            dayOfYear,
            hour,
            minute,
            source: activeCampaignId ? 'campaign' : 'manual',
            campaignId: activeCampaignId,
            campaignName: activeCampaignName
        });
    }

    function getRouteProgress(roundTripWorldHours, startOffset = 0, now = performance.now()) {
        if (!roundTripWorldHours || roundTripWorldHours <= 0) return positiveModulo(startOffset, 1);
        const totalWorldHours = getWorldHours(now);
        return positiveModulo((totalWorldHours / roundTripWorldHours) + startOffset, 1);
    }

    async function loadCampaignRegistry() {
        if (campaignRegistryLoaded) return campaignRegistry;

        try {
            const response = await fetch(CAMPAIGN_REGISTRY_URL, { cache: 'no-store' });
            if (!response.ok) throw new Error(`Failed to load campaign registry (${response.status})`);
            const payload = await response.json();
            campaignRegistry = Array.isArray(payload) ? payload : (Array.isArray(payload.campaigns) ? payload.campaigns : []);
        } catch (error) {
            console.warn('World clock campaign registry unavailable:', error);
            campaignRegistry = [];
        }

        campaignRegistryLoaded = true;
        return campaignRegistry;
    }

    function getCampaignRegistry() {
        return campaignRegistry.slice();
    }

    function getCampaignById(campaignId) {
        return campaignRegistry.find(campaign => campaign.id === campaignId) || null;
    }

    function normalizeCampaignAnchor(campaign) {
        if (!campaign || !campaign.anchor) return null;

        const { anchor } = campaign;
        const resolvedDayOfYear = anchor.dayOfYear || getDayOfYearFromHarmon(anchor.harmon, anchor.day);
        if (!resolvedDayOfYear) return null;

        return {
            year: anchor.year || START_YEAR,
            dayOfYear: resolvedDayOfYear,
            hour: anchor.hour || 0,
            minute: anchor.minute || 0,
            source: 'campaign',
            campaignId: campaign.id,
            campaignName: campaign.name
        };
    }

    function applyCampaign(campaignId) {
        const campaign = getCampaignById(campaignId);
        const anchor = normalizeCampaignAnchor(campaign);
        if (!campaign || !anchor) return false;

        localStorage.setItem(CAMPAIGN_STORAGE_KEY, campaign.id);
        setAnchor(anchor);
        return true;
    }

    function initializeFromRealWorld(date = new Date()) {
        localStorage.removeItem(CAMPAIGN_STORAGE_KEY);
        setAnchor({
            ...mapRealDateToWorldAnchor(date),
            source: 'real-world'
        });
    }

    async function installControls({
        buttonId,
        panelId,
        displayId,
        daySliderId,
        hourSliderId,
        dayLabelId,
        hourLabelId,
        campaignSelectId,
        campaignResetId
    }) {
        const button = document.getElementById(buttonId);
        const panel = document.getElementById(panelId);
        const display = document.getElementById(displayId);
        const wheel = document.getElementById('world-clock-wheel');
        const wheelDate = document.getElementById('world-clock-date');
        const wheelMeta = document.getElementById('world-clock-meta');
        const daySlider = document.getElementById(daySliderId);
        const hourSlider = document.getElementById(hourSliderId);
        const dayLabel = document.getElementById(dayLabelId);
        const hourLabel = document.getElementById(hourLabelId);
        const campaignSelect = document.getElementById(campaignSelectId);
        const campaignReset = document.getElementById(campaignResetId);

        if (panel) {
            panel.addEventListener('mousedown', event => event.stopPropagation());
            panel.addEventListener('click', event => event.stopPropagation());
            panel.addEventListener('touchstart', event => event.stopPropagation(), { passive: true });
        }

        function setDayLabel(day) {
            if (!dayLabel) return;
            const year = getState().year;
            const harmonInfo = getHarmonInfo(day);
            dayLabel.textContent = `${harmonInfo.dayOfHarmon} ${harmonInfo.harmonName}  ·  ${harmonInfo.season}  ·  ${year}`;
        }

        function syncUi(state) {
            if (display) display.textContent = state.compactLabel;
            if (wheel) wheel.innerHTML = renderWheelMarkup(state);
            if (wheelDate) wheelDate.textContent = state.fullDateLabel;
            if (wheelMeta) {
                const modeLabel = state.campaignName
                    ? `Campaign: ${state.campaignName}`
                    : (state.timeMode === 'real-world' ? 'Mode: Real-world seasonal mirror' : 'Mode: Free clock');
                wheelMeta.innerHTML = [
                    `<div><strong>${modeLabel}</strong></div>`,
                    `<div><strong>Season:</strong> ${state.season}</div>`,
                    `<div><strong>Known As:</strong> ${state.seasonKnownAs}</div>`,
                    `<div><strong>Similar To:</strong> ${state.seasonSimilarTo}</div>`,
                    `<div><strong>Stretch:</strong> ${state.stretch}  ·  <strong>Hour:</strong> ${state.hourLabel}</div>`
                ].join('');
            }
            if (daySlider) daySlider.value = String(state.dayOfYear);
            if (hourSlider) hourSlider.value = String(state.hour);
            setDayLabel(state.dayOfYear);
            if (hourLabel) hourLabel.textContent = state.hourLabel;
            if (campaignSelect) campaignSelect.value = state.campaignId || '';
        }

        function populateCampaignSelect(campaigns) {
            if (!campaignSelect) return;

            const options = [
                '<option value="">Mirror Real-World Season</option>',
                ...campaigns.map(campaign => `<option value="${campaign.id}">${campaign.name}</option>`)
            ];
            campaignSelect.innerHTML = options.join('');
        }

        await loadCampaignRegistry();
        populateCampaignSelect(getCampaignRegistry());

        const storedCampaignId = localStorage.getItem(CAMPAIGN_STORAGE_KEY);
        if (!storedCampaignId || !applyCampaign(storedCampaignId)) {
            initializeFromRealWorld();
        }

        if (button && panel) {
            button.addEventListener('click', event => {
                event.stopPropagation();
                const opening = panel.style.display === 'none' || panel.style.display === '';
                panel.style.display = opening ? 'block' : 'none';
                button.style.opacity = opening ? '1' : '0.6';
                if (opening) syncUi(getState());
            });
        }

        if (daySlider) {
            daySlider.addEventListener('input', () => {
                const current = getState();
                setTime({
                    dayOfYear: daySlider.value,
                    hour: hourSlider ? hourSlider.value : current.hour,
                    minute: current.minute
                });
            });
        }

        if (hourSlider) {
            hourSlider.addEventListener('input', () => {
                const current = getState();
                setTime({
                    dayOfYear: daySlider ? daySlider.value : current.dayOfYear,
                    hour: hourSlider.value,
                    minute: current.minute
                });
            });
        }

        if (campaignSelect) {
            campaignSelect.addEventListener('change', () => {
                if (!campaignSelect.value) {
                    initializeFromRealWorld();
                    return;
                }

                if (!applyCampaign(campaignSelect.value)) {
                    initializeFromRealWorld();
                }
            });
        }

        if (campaignReset) {
            campaignReset.addEventListener('click', () => {
                if (campaignSelect) campaignSelect.value = '';
                initializeFromRealWorld();
            });
        }

        listeners.add(syncUi);
        ensureAnimationLoop();
        syncUi(getState());

        return {
            destroy() {
                listeners.delete(syncUi);
            }
        };
    }

    ensureAnimationLoop();

    return {
        DAY_REAL_MS,
        HOURS_PER_DAY,
        YEAR_DAYS,
        getState,
        getWorldHours,
        getRouteProgress,
        getHarmonInfo,
        getDayOfYearFromHarmon,
        setTime,
        setAnchor,
        initializeFromRealWorld,
        loadCampaignRegistry,
        getCampaignRegistry,
        applyCampaign,
        installControls
    };
})();
