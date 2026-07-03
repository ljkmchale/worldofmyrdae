const fs = require('fs');
const path = require('path');
const { WorldStore } = require('../lib/world-store');

const repoRoot = path.resolve(__dirname, '..');
const dataRoot = path.resolve(process.env.MYRDAE_DATA_DIR || repoRoot);
const databasePath = path.join(dataRoot, 'data', 'myrdae.db');
const command = process.argv[2] || 'counts';
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

if (!fs.existsSync(databasePath)) {
    console.error(`World database not found: ${databasePath}`);
    console.error('Start the local server once to migrate js/locations-db.js into SQLite.');
    process.exit(1);
}

const store = new WorldStore(databasePath);

function queryAll(sql, params = []) {
    return store.db.prepare(sql).all(...params);
}

function queryGet(sql, params = []) {
    return store.db.prepare(sql).get(...params);
}

function tableColumns(tableName) {
    return queryAll(`PRAGMA table_info(${tableName})`);
}

function validateDatabaseIntegrity() {
    const issues = [];
    const requiredLocationColumns = [
        'realm_id',
        'id',
        'name',
        'type',
        'x',
        'y',
        'region',
        ...LOCATION_TYPED_COLUMNS.map(([column]) => column),
        'sort_order',
        'data_json',
        'external_sheet_id',
        'sheet_row_id',
        'last_synced_at',
        'last_modified_at',
        'modified_source',
        'sync_status',
        'deleted_at',
        'created_at',
        'updated_at'
    ];
    const locationColumns = new Set(tableColumns('locations').map((column) => column.name));
    requiredLocationColumns.forEach((column) => {
        if (!locationColumns.has(column)) issues.push(`locations table is missing column ${column}`);
    });
    if (locationColumns.has('disposition')) {
        queryAll(`
            SELECT realm_id, id, disposition
            FROM locations
            WHERE disposition NOT IN ('hostile', 'neutral', 'friendly')
        `).forEach((row) => {
            issues.push(`${row.realm_id}.locations.${row.id} has invalid disposition ${row.disposition}`);
        });
    }
    const indexes = new Map(queryAll("SELECT name, tbl_name FROM sqlite_master WHERE type = 'index'")
        .map((index) => [index.name, index.tbl_name]));
    [
        'idx_locations_realm_name',
        'idx_locations_realm_region',
        'idx_locations_realm_type',
        'idx_locations_realm_biome',
        'idx_locations_realm_disposition',
        'idx_locations_city_map',
        'idx_locations_sync_status',
        'idx_locations_sheet_identity',
        'idx_locations_sheet_row_unique',
        'idx_locations_modified',
        'idx_locations_deleted'
    ].forEach((indexName) => {
        if (indexes.get(indexName) !== 'locations') {
            issues.push(`${indexName} is missing from active locations table`);
        }
    });
    ['idx_roads_realm_type', 'idx_roads_realm_name'].forEach((indexName) => {
        if (indexes.get(indexName) !== 'roads') {
            issues.push(`${indexName} is missing from active roads table`);
        }
    });
    if (indexes.get('idx_roads_route_purpose') !== 'roads') {
        issues.push('idx_roads_route_purpose is missing from active roads table');
    }
    if (indexes.get('idx_road_points_location') !== 'road_points') {
        issues.push('idx_road_points_location is missing from active road_points table');
    }
    const roadColumns = new Set(tableColumns('roads').map((column) => column.name));
    ROAD_TYPED_COLUMNS.forEach(([column]) => {
        if (!roadColumns.has(column)) issues.push(`roads table is missing column ${column}`);
    });

    ['location_types', 'road_types', 'sync_statuses', 'road_points'].forEach((tableName) => {
        const exists = queryGet("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", [tableName]);
        if (!exists) issues.push(`missing table ${tableName}`);
    });
    const independentRegionsTable = queryGet("SELECT name FROM sqlite_master WHERE type='table' AND name = 'regions'");
    if (independentRegionsTable) {
        const count = queryGet('SELECT COUNT(*) AS count FROM regions').count;
        issues.push(`independent regions table should be removed; found ${count} row(s)`);
    }

    const integrity = queryGet('PRAGMA integrity_check');
    if (!integrity || integrity.integrity_check !== 'ok') {
        issues.push(`SQLite integrity_check failed: ${JSON.stringify(integrity)}`);
    }

    queryAll('PRAGMA foreign_key_check').forEach((issue) => {
        issues.push(`foreign key issue: ${JSON.stringify(issue)}`);
    });

    queryAll(`
        SELECT realm_id, id
        FROM locations
        WHERE deleted_at IS NULL
          AND (name IS NULL OR trim(name) = '' OR type IS NULL OR trim(type) = '')
    `).forEach((row) => {
        issues.push(`${row.realm_id}.locations.${row.id} has blank required typed fields`);
    });

    queryAll(`
        SELECT realm_id, id, x, y
        FROM locations
        WHERE deleted_at IS NULL
          AND (x IS NULL OR y IS NULL OR x < 0 OR x > 100 OR y < 0 OR y > 100)
    `).forEach((row) => {
        issues.push(`${row.realm_id}.locations.${row.id} has invalid typed coordinates (${row.x}, ${row.y})`);
    });

    queryAll(`
        SELECT realm_id, id, type
        FROM locations
        WHERE deleted_at IS NULL
          AND type NOT IN (SELECT id FROM location_types)
    `).forEach((row) => {
        issues.push(`${row.realm_id}.locations.${row.id} has unknown location type ${row.type}`);
    });

    queryAll(`
        SELECT realm_id, id, type
        FROM roads
        WHERE type IS NULL OR trim(type) = '' OR type NOT IN (SELECT id FROM road_types)
    `).forEach((row) => {
        issues.push(`${row.realm_id}.roads.${row.id} has unknown road type ${row.type}`);
    });

    queryAll(`
        SELECT realm_id, id, sync_status
        FROM locations
        WHERE sync_status NOT IN (SELECT id FROM sync_statuses)
    `).forEach((row) => {
        issues.push(`${row.realm_id}.locations.${row.id} has unknown sync_status ${row.sync_status}`);
    });

    queryAll(`
        SELECT external_sheet_id, sheet_row_id, COUNT(*) AS count
        FROM locations
        WHERE external_sheet_id IS NOT NULL AND sheet_row_id IS NOT NULL
        GROUP BY external_sheet_id, sheet_row_id
        HAVING COUNT(*) > 1
    `).forEach((row) => {
        issues.push(`duplicate Sheet row identity ${row.external_sheet_id}:${row.sheet_row_id}`);
    });

    queryAll(`
        SELECT realm_id, id, name, type, x, y, ${LOCATION_TYPED_COLUMNS.map(([column]) => column).join(', ')}, data_json
        FROM locations
        WHERE deleted_at IS NULL
    `).forEach((row) => {
        let parsed = null;
        try {
            parsed = JSON.parse(row.data_json);
        } catch (err) {
            issues.push(`${row.realm_id}.locations.${row.id} has invalid data_json`);
            return;
        }
        if (parsed.id !== row.id) issues.push(`${row.realm_id}.locations.${row.id} has mismatched JSON id`);
        if (parsed.name !== row.name) issues.push(`${row.realm_id}.locations.${row.id} has mismatched JSON name`);
        if (parsed.type !== row.type) issues.push(`${row.realm_id}.locations.${row.id} has mismatched JSON type`);
        if (Number(parsed.x) !== row.x) issues.push(`${row.realm_id}.locations.${row.id} has mismatched JSON x`);
        if (Number(parsed.y) !== row.y) issues.push(`${row.realm_id}.locations.${row.id} has mismatched JSON y`);
        LOCATION_TYPED_COLUMNS.forEach(([column, field, kind]) => {
            const dbValue = row[column];
            const jsonValue = parsed[field];
            if (dbValue === null || dbValue === undefined) {
                if (jsonValue !== undefined && jsonValue !== null && jsonValue !== '') {
                    issues.push(`${row.realm_id}.locations.${row.id} has JSON ${field} but empty typed column ${column}`);
                }
                return;
            }
            if (kind === 'number' && Number(jsonValue) !== Number(dbValue)) {
                issues.push(`${row.realm_id}.locations.${row.id} has mismatched JSON ${field}`);
            } else if (kind === 'boolean' && Boolean(jsonValue) !== Boolean(dbValue)) {
                issues.push(`${row.realm_id}.locations.${row.id} has mismatched JSON ${field}`);
            } else if (kind === 'text' && String(jsonValue || '') !== String(dbValue)) {
                issues.push(`${row.realm_id}.locations.${row.id} has mismatched JSON ${field}`);
            }
        });
    });

    queryAll(`
        SELECT realm_id, id, name, type, ${ROAD_TYPED_COLUMNS.map(([column]) => column).join(', ')}, data_json
        FROM roads
    `).forEach((row) => {
        let parsed = null;
        try {
            parsed = JSON.parse(row.data_json);
        } catch (err) {
            issues.push(`${row.realm_id}.roads.${row.id} has invalid data_json`);
            return;
        }
        if (parsed.id !== row.id) issues.push(`${row.realm_id}.roads.${row.id} has mismatched JSON id`);
        if ((parsed.name || null) !== (row.name || null)) issues.push(`${row.realm_id}.roads.${row.id} has mismatched JSON name`);
        if (parsed.type !== row.type) issues.push(`${row.realm_id}.roads.${row.id} has mismatched JSON type`);
        ROAD_TYPED_COLUMNS.forEach(([column, field, kind]) => {
            const dbValue = row[column];
            const jsonValue = parsed[field];
            if (dbValue === null || dbValue === undefined) {
                if (jsonValue !== undefined && jsonValue !== null && jsonValue !== '') {
                    issues.push(`${row.realm_id}.roads.${row.id} has JSON ${field} but empty typed column ${column}`);
                }
                return;
            }
            if (kind === 'number' && Number(jsonValue) !== Number(dbValue)) {
                issues.push(`${row.realm_id}.roads.${row.id} has mismatched JSON ${field}`);
            } else if (kind === 'boolean' && Boolean(jsonValue) !== Boolean(dbValue)) {
                issues.push(`${row.realm_id}.roads.${row.id} has mismatched JSON ${field}`);
            } else if (kind === 'text' && String(jsonValue || '') !== String(dbValue)) {
                issues.push(`${row.realm_id}.roads.${row.id} has mismatched JSON ${field}`);
            }
        });
        const jsonPoints = Array.isArray(parsed.points) ? parsed.points : [];
        const pointCount = Number(queryGet(
            'SELECT COUNT(*) AS count FROM road_points WHERE realm_id = ? AND road_id = ?',
            [row.realm_id, row.id]
        ).count);
        if (jsonPoints.length !== pointCount) {
            issues.push(`${row.realm_id}.roads.${row.id} has ${pointCount} typed points but ${jsonPoints.length} JSON points`);
        }
    });

    return issues;
}

function validateRealm(realmId, realm) {
    const issues = [];
    const seen = new Set();
    const ids = new Set();

    realm.locations.forEach((location, index) => {
        const label = `${realmId}.locations[${index}]`;
        ['id', 'name', 'type', 'x', 'y'].forEach((field) => {
            if (location[field] === undefined || location[field] === null || location[field] === '') {
                issues.push(`${label} is missing ${field}`);
            }
        });
        if (location.id) {
            if (seen.has(location.id)) issues.push(`${realmId} has duplicate location id ${location.id}`);
            seen.add(location.id);
            ids.add(location.id);
        }
        if (typeof location.x !== 'number' || typeof location.y !== 'number' ||
            location.x < 0 || location.x > 100 || location.y < 0 || location.y > 100) {
            issues.push(`${label} has invalid coordinates (${location.x}, ${location.y})`);
        }
    });

    realm.roads.forEach((road, index) => {
        const points = Array.isArray(road.points) ? road.points :
            (Array.isArray(road.waypoints) ? road.waypoints : []);
        if (points.length < 2) issues.push(`${realmId}.roads[${index}] has fewer than two points`);
        points.forEach((point, pointIndex) => {
            if (typeof point === 'string' && !ids.has(point)) {
                issues.push(`${realmId}.roads[${index}].points[${pointIndex}] references unknown location ${point}`);
            }
            if (Array.isArray(point) && (point.length !== 2 || point.some((value) =>
                typeof value !== 'number' || value < 0 || value > 100))) {
                issues.push(`${realmId}.roads[${index}].points[${pointIndex}] is malformed`);
            }
        });
    });

    return issues;
}

async function main() {
    if (command === 'counts') {
        console.log(JSON.stringify(store.getCounts(), null, 2));
        return;
    }

    if (command === 'validate') {
        const world = store.readWorld();
        const issues = [
            ...validateRealm('surface', world),
            ...validateRealm('underdark', world.underdark),
            ...validateDatabaseIntegrity()
        ];
        console.log(JSON.stringify({ databasePath, issueCount: issues.length, issues }, null, 2));
        if (issues.length) process.exitCode = 1;
        return;
    }

    if (command === 'integrity') {
        const issues = validateDatabaseIntegrity();
        console.log(JSON.stringify({ databasePath, issueCount: issues.length, issues }, null, 2));
        if (issues.length) process.exitCode = 1;
        return;
    }

    if (command === 'sort') {
        const target = process.argv[3] || 'all';
        const world = store.readWorld();
        const sortLocations = (locations) => locations.sort((a, b) => {
            const regionCompare = (a.region || '').localeCompare(b.region || '');
            return regionCompare || (a.name || '').localeCompare(b.name || '');
        });
        if (target === 'all' || target === 'surface') sortLocations(world.locations);
        if (target === 'all' || target === 'underdark') sortLocations(world.underdark.locations);
        if (!['all', 'surface', 'underdark'].includes(target)) throw new Error(`Unknown realm: ${target}`);
        store.writeWorld(world, { source: `world-db-tools sort ${target}` });
        console.log(`Sorted ${target} locations by region and name.`);
        return;
    }

    if (command === 'backup') {
        const destination = path.resolve(process.argv[3] || path.join(
            repoRoot,
            'backups',
            `myrdae.${new Date().toISOString().replace(/\D/g, '').slice(0, 14)}.db`
        ));
        fs.mkdirSync(path.dirname(destination), { recursive: true });
        if (fs.existsSync(destination)) throw new Error(`Backup already exists: ${destination}`);
        const escaped = destination.replace(/'/g, "''");
        store.db.exec(`VACUUM INTO '${escaped}'`);
        console.log(destination);
        return;
    }

    if (command === 'export-seed') {
        const destination = path.resolve(process.argv[3] || path.join(repoRoot, 'js', 'locations-db.js'));
        const content = `/**\n * World of Myrdae - SQLite migration seed.\n * Live edits are stored in data/myrdae.db.\n */\n\nconst WORLD_LOCATIONS = ${JSON.stringify(store.readWorld(), null, 4)};\n`;
        fs.writeFileSync(destination, content);
        console.log(destination);
        return;
    }

    throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
}).finally(() => store.close());
