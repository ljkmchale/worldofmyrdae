const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const tooltipSource = fs.readFileSync(path.join(repoRoot, 'js', 'overlay', 'tooltip.js'), 'utf8');
const types = [
    'capital',
    'city',
    'small-city',
    'town',
    'village',
    'port',
    'ruins',
    'landmark',
    'pass',
    'poi',
    'nature',
    'region',
    'water',
    'river'
];

test('every Underdark location type has a dedicated tooltip image', () => {
    types.forEach((type) => {
        const relativePath = `images/tooltips/underdark-types/${type}.png`;
        assert.equal(fs.existsSync(path.join(repoRoot, relativePath)), true, `missing ${relativePath}`);
        assert.ok(tooltipSource.includes(`${type}: '${relativePath}'`) || tooltipSource.includes(`'${type}': '${relativePath}'`));
    });
});

test('Underdark tooltip images are selected without replacing Surface mappings', () => {
    assert.ok(tooltipSource.includes("activeRealm !== 'underdark'"));
    assert.ok(tooltipSource.includes('TOOLTIP_UNDERDARK_TYPE_IMAGE_PATHS'));
    assert.ok(tooltipSource.includes('TOOLTIP_GENERIC_TYPE_IMAGE_PATHS'));
});
