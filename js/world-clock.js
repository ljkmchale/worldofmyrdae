window.MyrdaeWorldClock = (function () {
    const DAY_REAL_MS = 60 * 60 * 1000; // 1 real hour = 1 Myrdae day
    const HOURS_PER_DAY = 24;
    const YEAR_DAYS = 384;
    const SEASON_LENGTH = 96;
    const YEAR_HOURS = YEAR_DAYS * HOURS_PER_DAY;

    let anchorRealMs = performance.now();
    let anchorWorldHours = 0;
    let animationStarted = false;
    const listeners = new Set();

    function positiveModulo(value, mod) {
        return ((value % mod) + mod) % mod;
    }

    function getSeasonForDay(dayOfYear) {
        if (dayOfYear <= 96) return 'Natali';
        if (dayOfYear <= 192) return 'Sultra';
        if (dayOfYear <= 288) return 'Garnest';
        return 'Briscarn';
    }

    function formatTimeLabel(hour, minute = 0) {
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    function getWorldHours(now = performance.now()) {
        const elapsedRealMs = now - anchorRealMs;
        return anchorWorldHours + ((elapsedRealMs / DAY_REAL_MS) * HOURS_PER_DAY);
    }

    function getState(now = performance.now()) {
        const totalWorldHours = getWorldHours(now);
        const cycleHours = positiveModulo(totalWorldHours, YEAR_HOURS);
        const dayIndex = Math.floor(cycleHours / HOURS_PER_DAY);
        const dayHourProgress = positiveModulo(cycleHours, HOURS_PER_DAY);
        const hour = Math.floor(dayHourProgress);
        const minute = Math.floor((dayHourProgress - hour) * 60);
        const dayOfYear = dayIndex + 1;
        const season = getSeasonForDay(dayOfYear);

        return {
            totalWorldHours,
            cycleHours,
            dayOfYear,
            dayOfSeason: (dayIndex % SEASON_LENGTH) + 1,
            hour,
            minute,
            season,
            hourLabel: formatTimeLabel(hour, minute),
            compactLabel: `☀ ${season}  ·  Day ${((dayIndex % SEASON_LENGTH) + 1)}  ·  Time ${formatTimeLabel(hour, minute)}`
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

    function setTime({ dayOfYear, hour }) {
        const safeDay = Math.min(YEAR_DAYS, Math.max(1, parseInt(dayOfYear, 10) || 1));
        const safeHour = Math.min(HOURS_PER_DAY - 1, Math.max(0, parseInt(hour, 10) || 0));
        anchorWorldHours = ((safeDay - 1) * HOURS_PER_DAY) + safeHour;
        anchorRealMs = performance.now();
        notifyListeners(anchorRealMs);
    }

    function getRouteProgress(roundTripWorldHours, startOffset = 0, now = performance.now()) {
        if (!roundTripWorldHours || roundTripWorldHours <= 0) return positiveModulo(startOffset, 1);
        const totalWorldHours = getWorldHours(now);
        return positiveModulo((totalWorldHours / roundTripWorldHours) + startOffset, 1);
    }

    function installControls({
        buttonId,
        panelId,
        displayId,
        daySliderId,
        hourSliderId,
        dayLabelId,
        hourLabelId
    }) {
        const button = document.getElementById(buttonId);
        const panel = document.getElementById(panelId);
        const display = document.getElementById(displayId);
        const daySlider = document.getElementById(daySliderId);
        const hourSlider = document.getElementById(hourSliderId);
        const dayLabel = document.getElementById(dayLabelId);
        const hourLabel = document.getElementById(hourLabelId);

        if (panel) {
            panel.addEventListener('mousedown', event => event.stopPropagation());
            panel.addEventListener('click', event => event.stopPropagation());
            panel.addEventListener('touchstart', event => event.stopPropagation(), { passive: true });
        }

        function setDayLabel(day) {
            if (!dayLabel) return;
            dayLabel.textContent = `${day}  ·  ${getSeasonForDay(day)}`;
        }

        function setHourLabel(hour) {
            if (!hourLabel) return;
            const state = getState();
            hourLabel.textContent = formatTimeLabel(hour, state.hour === hour ? state.minute : 0);
        }

        function syncUi(state) {
            if (display) display.textContent = state.compactLabel;
            if (daySlider) daySlider.value = String(state.dayOfYear);
            if (hourSlider) hourSlider.value = String(state.hour);
            setDayLabel(state.dayOfYear);
            if (hourLabel) hourLabel.textContent = state.hourLabel;
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
                    hour: hourSlider ? hourSlider.value : current.hour
                });
            });
        }

        if (hourSlider) {
            hourSlider.addEventListener('input', () => {
                const current = getState();
                setTime({
                    dayOfYear: daySlider ? daySlider.value : current.dayOfYear,
                    hour: hourSlider.value
                });
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
        getSeasonForDay,
        setTime,
        installControls
    };
})();
