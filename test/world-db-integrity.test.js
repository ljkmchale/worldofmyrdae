const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const { DatabaseSync } = require('node:sqlite');
const {
    hashValue,
    findUnsyncedSheetChanges,
    locationToRow,
    normalizeLocationForHash,
    parseSheetLocation,
    rowToObjectWithHeaders
} = require('../lib/google-sheets-sync');

const dbPath = path.resolve(__dirname, '..', 'data', 'myrdae.db');
const LOCATION_TYPED_COLUMNS = [
    ['description', 'description', 'text'],
    ['city_map', 'cityMap', 'text'],
    ['link', 'link', 'text'],
    ['biome', 'biome', 'text'],
    ['disposition', 'disposition', 'text'],
    ['details', 'details', 'text'],
    ['city_scene', 'cityScene', 'text'],
    ['tooltip_image', 'tooltipImage', 'text'],
    ['font_family', 'fontFamily', 'text'],
    ['font_size', 'fontSize', 'number'],
    ['font_weight', 'fontWeight', 'text'],
    ['font_style', 'fontStyle', 'text'],
    ['marker_size', 'markerSize', 'number'],
    ['marker_offset_x', 'markerOffsetX', 'number'],
    ['marker_offset_y', 'markerOffsetY', 'number'],
    ['label_offset_x', 'labelOffsetX', 'number'],
    ['label_offset_y', 'labelOffsetY', 'number'],
    ['label_align', 'labelAlign', 'text'],
    ['rotation', 'rotation', 'number'],
    ['opacity', 'opacity', 'number'],
    ['text_curve', 'textCurve', 'number'],
    ['hide_label', 'hideLabel', 'boolean']
];
const ROAD_TYPED_COLUMNS = [
    ['curved', 'curved', 'boolean'],
    ['color', 'color', 'text'],
    ['width', 'width', 'number'],
    ['font_family', 'fontFamily', 'text'],
    ['font_size', 'fontSize', 'number'],
    ['font_style', 'fontStyle', 'text'],
    ['label_offset', 'labelOffset', 'number'],
    ['label_reverse', 'labelReverse', 'boolean'],
    ['label_side', 'labelSide', 'text'],
    ['boat_color', 'boatColor', 'text'],
    ['boat_size_multiplier', 'boatSizeMultiplier', 'number'],
    ['captain_name', 'captainName', 'text'],
    ['cargo', 'cargo', 'text'],
    ['risk_level', 'riskLevel', 'text'],
    ['route_purpose', 'routePurpose', 'text'],
    ['ship_name', 'shipName', 'text'],
    ['ship_type', 'shipType', 'text']
];

function withDb(fn) {
    const db = new DatabaseSync(dbPath, { readOnly: true });
    try {
        return fn(db);
    } finally {
        db.close();
    }
}

function all(db, sql, params = []) {
    return db.prepare(sql).all(...params);
}

function get(db, sql, params = []) {
    return db.prepare(sql).get(...params);
}

test('world database has v3 location sync columns and lookup tables', () => {
    withDb((db) => {
        const columns = new Set(all(db, 'PRAGMA table_info(locations)').map((column) => column.name));
        [
            ...LOCATION_TYPED_COLUMNS.map(([column]) => column),
            'external_sheet_id',
            'sheet_row_id',
            'last_synced_at',
            'last_modified_at',
            'modified_source',
            'sync_status',
            'deleted_at',
            'created_at',
            'updated_at'
        ].forEach((column) => assert.equal(columns.has(column), true, `missing ${column}`));

        const roadColumns = new Set(all(db, 'PRAGMA table_info(roads)').map((column) => column.name));
        ROAD_TYPED_COLUMNS.forEach(([column]) => assert.equal(roadColumns.has(column), true, `missing road ${column}`));

        ['location_types', 'road_types', 'sync_statuses', 'road_points'].forEach((tableName) => {
            assert.ok(get(db, "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?", [tableName]));
        });

        assert.equal(get(db, 'PRAGMA integrity_check').integrity_check, 'ok');
        assert.deepEqual(all(db, 'PRAGMA foreign_key_check'), []);
        assert.equal(get(db, "SELECT value FROM world_meta WHERE key = 'schema_version'").value, '3');
        assert.equal(
            get(db, "SELECT COUNT(*) AS count FROM locations WHERE disposition NOT IN ('hostile', 'neutral', 'friendly')").count,
            0
        );
    });
});

test('active locations have stable unique keys and valid map coordinates', () => {
    withDb((db) => {
        assert.equal(
            get(db, `
                SELECT COUNT(*) AS count
                FROM (
                    SELECT realm_id, id, COUNT(*) AS copies
                    FROM locations
                    WHERE deleted_at IS NULL
                    GROUP BY realm_id, id
                    HAVING copies > 1
                )
            `).count,
            0
        );
        assert.equal(
            get(db, `
                SELECT COUNT(*) AS count
                FROM locations
                WHERE deleted_at IS NULL
                  AND (name IS NULL OR trim(name) = '' OR type IS NULL OR trim(type) = '')
            `).count,
            0
        );
        assert.equal(
            get(db, `
                SELECT COUNT(*) AS count
                FROM locations
                WHERE deleted_at IS NULL
                  AND (x IS NULL OR y IS NULL OR x < 0 OR x > 100 OR y < 0 OR y > 100)
            `).count,
            0
        );
    });
});

test('independent regions table is not part of the active schema', () => {
    withDb((db) => {
        assert.equal(
            get(db, "SELECT COUNT(*) AS count FROM sqlite_master WHERE type = 'table' AND name = 'regions'").count,
            0
        );
        assert.ok(
            get(db, "SELECT COUNT(*) AS count FROM locations WHERE deleted_at IS NULL AND type = 'region'").count > 0,
            'region labels should remain location records'
        );
        assert.ok(
            get(db, "SELECT COUNT(DISTINCT region) AS count FROM locations WHERE deleted_at IS NULL AND region IS NOT NULL AND trim(region) != ''").count > 0,
            'location region names should remain available'
        );
    });
});

test('location typed columns stay consistent with data_json', () => {
    withDb((db) => {
        const rows = all(db, `
            SELECT realm_id, id, name, type, x, y, ${LOCATION_TYPED_COLUMNS.map(([column]) => column).join(', ')}, data_json
            FROM locations
            WHERE deleted_at IS NULL
        `);
        rows.forEach((row) => {
            const parsed = JSON.parse(row.data_json);
            assert.equal(parsed.id, row.id, `${row.realm_id}:${row.id} id mismatch`);
            assert.equal(parsed.name, row.name, `${row.realm_id}:${row.id} name mismatch`);
            assert.equal(parsed.type, row.type, `${row.realm_id}:${row.id} type mismatch`);
            assert.equal(Number(parsed.x), row.x, `${row.realm_id}:${row.id} x mismatch`);
            assert.equal(Number(parsed.y), row.y, `${row.realm_id}:${row.id} y mismatch`);
            LOCATION_TYPED_COLUMNS.forEach(([column, field, kind]) => {
                if (row[column] === null || row[column] === undefined) {
                    assert.ok(
                        parsed[field] === undefined || parsed[field] === null || parsed[field] === '',
                        `${row.realm_id}:${row.id} ${field} present in JSON but missing from typed column`
                    );
                    return;
                }
                if (kind === 'number') {
                    assert.equal(Number(parsed[field]), Number(row[column]), `${row.realm_id}:${row.id} ${field} mismatch`);
                } else if (kind === 'boolean') {
                    assert.equal(Boolean(parsed[field]), Boolean(row[column]), `${row.realm_id}:${row.id} ${field} mismatch`);
                } else {
                    assert.equal(String(parsed[field] || ''), String(row[column]), `${row.realm_id}:${row.id} ${field} mismatch`);
                }
            });
        });
    });
});

test('sheet row identities are unique when present', () => {
    withDb((db) => {
        assert.equal(
            get(db, `
                SELECT COUNT(*) AS count
                FROM (
                    SELECT external_sheet_id, sheet_row_id, COUNT(*) AS copies
                    FROM locations
                    WHERE external_sheet_id IS NOT NULL AND sheet_row_id IS NOT NULL
                    GROUP BY external_sheet_id, sheet_row_id
                    HAVING copies > 1
                )
            `).count,
            0
        );
    });
});

test('unnamed roads are valid and remain unlabeled on the map', () => {
    withDb((db) => {
        const counts = get(db, `
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN name IS NULL OR trim(name) = '' THEN 1 ELSE 0 END) AS unnamed,
                SUM(CASE WHEN name IS NOT NULL AND trim(name) <> '' THEN 1 ELSE 0 END) AS named
            FROM roads
        `);
        assert.equal(counts.total, 322);
        assert.equal(counts.unnamed, 296);
        assert.equal(counts.named, 26);
        assert.equal(
            get(db, `
                SELECT COUNT(*) AS count
                FROM roads
                WHERE type IS NULL OR trim(type) = ''
            `).count,
            0
        );
    });
});

test('road typed columns and route points stay consistent with data_json', () => {
    withDb((db) => {
        const rows = all(db, `
            SELECT realm_id, id, name, type, ${ROAD_TYPED_COLUMNS.map(([column]) => column).join(', ')}, data_json
            FROM roads
        `);
        rows.forEach((row) => {
            const parsed = JSON.parse(row.data_json);
            assert.equal(parsed.id, row.id, `${row.realm_id}:${row.id} id mismatch`);
            assert.equal(parsed.name || null, row.name || null, `${row.realm_id}:${row.id} name mismatch`);
            assert.equal(parsed.type, row.type, `${row.realm_id}:${row.id} type mismatch`);
            ROAD_TYPED_COLUMNS.forEach(([column, field, kind]) => {
                if (row[column] === null || row[column] === undefined) {
                    assert.ok(
                        parsed[field] === undefined || parsed[field] === null || parsed[field] === '',
                        `${row.realm_id}:${row.id} ${field} present in JSON but missing from typed column`
                    );
                    return;
                }
                if (kind === 'number') {
                    assert.equal(Number(parsed[field]), Number(row[column]), `${row.realm_id}:${row.id} ${field} mismatch`);
                } else if (kind === 'boolean') {
                    assert.equal(Boolean(parsed[field]), Boolean(row[column]), `${row.realm_id}:${row.id} ${field} mismatch`);
                } else {
                    assert.equal(String(parsed[field] || ''), String(row[column]), `${row.realm_id}:${row.id} ${field} mismatch`);
                }
            });
            const pointCount = get(
                db,
                'SELECT COUNT(*) AS count FROM road_points WHERE realm_id = ? AND road_id = ?',
                [row.realm_id, row.id]
            ).count;
            assert.equal(pointCount, parsed.points.length, `${row.realm_id}:${row.id} point count mismatch`);
        });
    });
});

test('sheet sync hashes ignore operational metadata', () => {
    const base = {
        id: 'sample',
        name: 'Sample',
        type: 'town',
        x: 12,
        y: 34,
        region: 'Test'
    };
    const withMetadata = {
        ...base,
        updatedAt: '2026-06-25T12:00:00.000Z',
        updatedSource: 'google-sheet',
        syncRevision: 42,
        createdAt: '2026-06-25T11:00:00.000Z',
        external_sheet_id: 'sheet',
        sheet_row_id: 3,
        last_synced_at: '2026-06-25T12:01:00.000Z',
        last_modified_at: '2026-06-25T12:00:00.000Z',
        modified_source: 'google-sheet',
        sync_status: 'ok'
    };
    assert.equal(
        hashValue(normalizeLocationForHash(base)),
        hashValue(normalizeLocationForHash(withMetadata))
    );
});

test('neutral disposition remains hash-compatible with pre-v3 rows', () => {
    const legacy = { id: 'sample', name: 'Sample', type: 'town', x: 12, y: 34 };
    const neutral = { ...legacy, disposition: 'neutral' };
    const hostile = { ...legacy, disposition: 'hostile' };
    assert.equal(hashValue(normalizeLocationForHash(legacy)), hashValue(normalizeLocationForHash(neutral)));
    assert.notEqual(hashValue(normalizeLocationForHash(legacy)), hashValue(normalizeLocationForHash(hostile)));
});

test('sheet export guard detects unsynced sheet edits before overwrite', () => {
    const dbLocation = {
        id: 'sample',
        name: 'Sample',
        type: 'town',
        x: 12,
        y: 34,
        region: 'Test'
    };
    const sheetLocation = {
        ...dbLocation,
        name: 'Changed In Sheet'
    };
    const sheetHashBeforeEdit = hashValue(normalizeLocationForHash(dbLocation));
    const changes = findUnsyncedSheetChanges([
        {
            rowNumber: 2,
            realm: 'surface',
            id: 'sample',
            key: 'surface:sample',
            location: sheetLocation,
            dbHash: sheetHashBeforeEdit,
            issues: []
        }
    ], new Map([
        ['surface:sample', { realm: 'surface', location: dbLocation }]
    ]));
    assert.equal(changes.length, 1);
    assert.equal(changes[0].key, 'surface:sample');
});

test('sheet rows expose editor attributes as direct columns', () => {
    const source = {
        id: 'sample',
        name: 'Sample',
        type: 'town',
        x: 12,
        y: 34,
        region: 'Test',
        description: 'Tooltip',
        cityMap: 'city-viewer.html?city=sample',
        link: 'https://example.com',
        biome: 'Forest',
        disposition: 'friendly',
        details: 'Italic tooltip detail',
        cityScene: 'city-scene.html?city=sample',
        tooltipImage: 'images/tooltips/landmarks/sample.png',
        fontFamily: 'Simonetta',
        fontSize: 14,
        fontWeight: '300',
        fontStyle: 'Italic',
        markerSize: 0.25,
        markerOffsetX: 1,
        markerOffsetY: 2,
        labelOffsetX: 3,
        labelOffsetY: 4,
        labelAlign: 'center',
        rotation: -10,
        opacity: 0.8,
        textCurve: 20,
        hideLabel: true
    };
    const header = require('../lib/google-sheets-sync').HEADER;
    assert.equal(header.includes('detailsJson'), false);
    assert.equal(header.includes('displayJson'), false);
    assert.equal(header.includes('tooltipImage'), true);
    assert.equal(header.includes('disposition'), true);
    const row = locationToRow('surface', source);
    const parsed = parseSheetLocation(rowToObjectWithHeaders(header, row), 2, new Set());
    assert.deepEqual(parsed.issues, []);
    assert.equal(parsed.location.biome, 'Forest');
    assert.equal(parsed.location.disposition, 'friendly');
    assert.equal(parsed.location.details, 'Italic tooltip detail');
    assert.equal(parsed.location.cityScene, 'city-scene.html?city=sample');
    assert.equal(parsed.location.tooltipImage, 'images/tooltips/landmarks/sample.png');
    assert.equal(parsed.location.fontSize, 14);
    assert.equal(parsed.location.markerSize, 0.25);
    assert.equal(parsed.location.labelOffsetX, 3);
    assert.equal(parsed.location.opacity, 0.8);
    assert.equal(parsed.location.textCurve, 20);
    assert.equal(parsed.location.hideLabel, true);
});

test('sheet disposition accepts only hostile, neutral, or friendly', () => {
    const header = require('../lib/google-sheets-sync').HEADER;
    const source = {
        id: 'sample',
        name: 'Sample',
        type: 'town',
        x: 12,
        y: 34,
        disposition: 'unknown'
    };
    const row = locationToRow('surface', source);
    const parsed = parseSheetLocation(rowToObjectWithHeaders(header, row), 2, new Set());
    assert.ok(parsed.issues.includes('disposition must be hostile, neutral, or friendly'));
});

test('blank sheet coordinates are invalid instead of becoming zero', () => {
    const header = require('../lib/google-sheets-sync').HEADER;
    const source = {
        id: 'sample',
        name: 'Sample',
        type: 'town',
        x: '',
        y: '',
        disposition: 'neutral'
    };
    const row = locationToRow('surface', source);
    const parsed = parseSheetLocation(rowToObjectWithHeaders(header, row), 2, new Set());
    assert.ok(parsed.issues.includes('x must be a number from 0 to 100'));
    assert.ok(parsed.issues.includes('y must be a number from 0 to 100'));
});
