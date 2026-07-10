const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadPositioning(viewport) {
    const sandbox = {
        window: { visualViewport: viewport },
        document: { documentElement: { clientWidth: viewport.width, clientHeight: viewport.height } },
        console
    };
    const source = fs.readFileSync(
        path.join(__dirname, '..', 'js', 'overlay', 'tooltip.js'),
        'utf8'
    );
    vm.runInNewContext(source, sandbox);
    return sandbox.window.MapTooltipPositioning;
}

function makeTooltip(width, height) {
    const style = {};
    return {
        style,
        getBoundingClientRect() {
            return {
                width: Math.min(width, Number.parseFloat(style.maxWidth)),
                height: Math.min(height, Number.parseFloat(style.maxHeight))
            };
        }
    };
}

test('keeps tooltips inside every viewport edge', () => {
    const positioning = loadPositioning({ offsetLeft: 0, offsetTop: 0, width: 320, height: 240 });
    const cursorPositions = [
        { clientX: 0, clientY: 0 },
        { clientX: 320, clientY: 0 },
        { clientX: 0, clientY: 240 },
        { clientX: 320, clientY: 240 }
    ];

    for (const cursor of cursorPositions) {
        const tooltip = makeTooltip(280, 180);
        positioning.place(tooltip, cursor);
        const left = Number.parseFloat(tooltip.style.left);
        const top = Number.parseFloat(tooltip.style.top);

        assert.ok(left >= 12);
        assert.ok(top >= 12);
        assert.ok(left + 280 <= 308);
        assert.ok(top + 180 <= 228);
    }
});

test('constrains oversized tooltips to a compact visual viewport', () => {
    const positioning = loadPositioning({ offsetLeft: 30, offsetTop: 20, width: 240, height: 160 });
    const tooltip = makeTooltip(500, 500);

    positioning.place(tooltip, { clientX: 250, clientY: 150 });

    assert.equal(tooltip.style.maxWidth, '216px');
    assert.equal(tooltip.style.maxHeight, '136px');
    assert.equal(tooltip.style.left, '42px');
    assert.equal(tooltip.style.top, '32px');
});
