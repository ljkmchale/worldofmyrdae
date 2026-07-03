const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { injectCacheBusters } = require('../server');

const repoRoot = path.resolve(__dirname, '..');
const localAssetPattern = /(href|src)="((?!(?:[a-z][a-z0-9+.-]*:|\/\/|#|data:))[^"?]+\.(?:css|js)(?:\?[^"]*)?)"/gi;

test('all HTML pages version local CSS and JavaScript assets', () => {
    const pages = fs.readdirSync(repoRoot)
        .filter((fileName) => fileName.endsWith('.html'))
        .sort();

    assert.ok(pages.length > 0, 'expected at least one HTML page');

    pages.forEach((pageName) => {
        const html = fs.readFileSync(path.join(repoRoot, pageName), 'utf8');
        const versionedHtml = injectCacheBusters(html);
        const localAssets = Array.from(versionedHtml.matchAll(localAssetPattern), (match) => match[2]);
        const unversionedAssets = localAssets.filter((asset) => !/\?v=\d+$/.test(asset));

        assert.deepEqual(
            unversionedAssets,
            [],
            `${pageName} has unversioned local assets: ${unversionedAssets.join(', ')}`
        );
    });
});

test('vendor assets receive the same timestamp versioning', () => {
    const html = fs.readFileSync(path.join(repoRoot, 'city-scene.html'), 'utf8');
    const versionedHtml = injectCacheBusters(html);

    assert.match(versionedHtml, /vendor\/fonts\/local-fonts\.css\?v=\d+/);
    assert.match(versionedHtml, /vendor\/babylon\/babylon\.js\?v=\d+/);
});
