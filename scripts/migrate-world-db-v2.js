const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const repoRoot = path.resolve(__dirname, '..');
const dataRoot = path.resolve(process.env.MYRDAE_DATA_DIR || repoRoot);
const databasePath = path.join(dataRoot, 'data', 'myrdae.db');
const command = process.argv[2] || 'status';

const LOCATION_TYPES = [
    ['capital', 'Capital'],
    ['city', 'City'],
    ['landmark', 'Landmark'],
    ['nature', 'Nature'],
    ['poi', 'Point of Interest'],
    ['region', 'Region'],
    ['river', 'River'],
    ['ruins', 'Ruins'],
    ['small-city', 'Small City'],
    ['town', 'Town'],
    ['water', 'Water']
];

const ROAD_TYPES = [
    ['major', 'Major'],
    ['minor', 'Minor'],
    ['river', 'River'],
    ['border', 'Border'],
    ['water-route', 'Water Route']
];

const SYNC_STATUSES = [
    ['ok', 'OK'],
    ['pending', 'Pending'],
    ['imported', 'Imported'],
    ['exported', 'Exported'],
    ['conflict', 'Conflict'],
    ['invalid', 'Invalid'],
    ['deleted', 'Deleted'],
    ['failed', 'Failed']
];

function stamp() {
    return new Date().toISOString().replace(/\D/g, '').slice(0, 14);
}

function nowIso() {
    return new Date().toISOString();
}

function tableExists(db, tableName) {
    return Boolean(db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ?").get(tableName));
}

function columns(db, tableName) {
    return db.prepare(`PRAGMA table_info(${tableName})`).all();
}

function hasV2LocationSchema(db) {
    const names = new Set(columns(db, 'locations').map((column) => column.name));
    return [
        'external_sheet_id',
        'sheet_row_id',
        'last_synced_at',
        'last_modified_at',
        'modified_source',
        'sync_status',
        'deleted_at',
        'created_at',
        'updated_at'
    ].every((name) => names.has(name));
}

function readJson(value) {
    try {
        const parsed = JSON.parse(value);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (err) {
        return {};
    }
}

function normalizeSource(value) {
    return String(value || 'database').trim() || 'database';
}

function normalizeSyncStatus(value) {
    const status = String(value || 'ok').trim().toLowerCase();
    return SYNC_STATUSES.some(([id]) => id === status) ? status : 'ok';
}

function validateCurrentData(db) {
    const issues = [];
    const validLocationTypes = new Set(LOCATION_TYPES.map(([id]) => id));
    const rows = db.prepare('SELECT realm_id, id, name, type, x, y, sort_order, data_json FROM locations').all();
    const seen = new Set();
    rows.forEach((row) => {
        const key = `${row.realm_id}:${row.id}`;
        if (seen.has(key)) issues.push(`${key} is duplicated`);
        seen.add(key);
        if (!['surface', 'underdark'].includes(row.realm_id)) issues.push(`${key} has invalid realm_id`);
        if (!row.id || !String(row.id).trim()) issues.push(`${key} has blank id`);
        if (!row.name || !String(row.name).trim()) issues.push(`${key} has blank name`);
        if (!row.type || !String(row.type).trim()) issues.push(`${key} has blank type`);
        if (row.type && !validLocationTypes.has(row.type)) issues.push(`${key} has unknown type ${row.type}`);
        if (typeof row.x !== 'number' || row.x < 0 || row.x > 100) issues.push(`${key} has invalid x`);
        if (typeof row.y !== 'number' || row.y < 0 || row.y > 100) issues.push(`${key} has invalid y`);
        if (!Number.isInteger(Number(row.sort_order))) issues.push(`${key} has invalid sort_order`);
        const json = readJson(row.data_json);
        if (json.id && json.id !== row.id) issues.push(`${key} has mismatched JSON id ${json.id}`);
    });
    const fkIssues = db.prepare('PRAGMA foreign_key_check').all();
    fkIssues.forEach((issue) => issues.push(`foreign key issue: ${JSON.stringify(issue)}`));
    return issues;
}

function createLookupTables(db) {
    db.exec(`
        CREATE TABLE IF NOT EXISTS location_types (
            id TEXT PRIMARY KEY,
            label TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS road_types (
            id TEXT PRIMARY KEY,
            label TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS sync_statuses (
            id TEXT PRIMARY KEY,
            label TEXT NOT NULL
        );
    `);
    const insertLocationType = db.prepare(`
        INSERT INTO location_types (id, label) VALUES (?, ?)
        ON CONFLICT(id) DO UPDATE SET label = excluded.label
    `);
    const insertRoadType = db.prepare(`
        INSERT INTO road_types (id, label) VALUES (?, ?)
        ON CONFLICT(id) DO UPDATE SET label = excluded.label
    `);
    const insertSyncStatus = db.prepare(`
        INSERT INTO sync_statuses (id, label) VALUES (?, ?)
        ON CONFLICT(id) DO UPDATE SET label = excluded.label
    `);
    LOCATION_TYPES.forEach(([id, label]) => insertLocationType.run(id, label));
    ROAD_TYPES.forEach(([id, label]) => insertRoadType.run(id, label));
    SYNC_STATUSES.forEach(([id, label]) => insertSyncStatus.run(id, label));
}

function createV2LocationTable(db, tableName) {
    db.exec(`
        CREATE TABLE ${tableName} (
            realm_id TEXT NOT NULL,
            id TEXT NOT NULL,
            name TEXT NOT NULL CHECK (trim(name) <> ''),
            type TEXT NOT NULL REFERENCES location_types(id),
            x REAL NOT NULL CHECK (x >= 0 AND x <= 100),
            y REAL NOT NULL CHECK (y >= 0 AND y <= 100),
            region TEXT,
            sort_order INTEGER NOT NULL,
            data_json TEXT NOT NULL CHECK (json_valid(data_json)),
            external_sheet_id TEXT,
            sheet_row_id INTEGER,
            last_synced_at TEXT,
            last_modified_at TEXT NOT NULL,
            modified_source TEXT NOT NULL DEFAULT 'database',
            sync_status TEXT NOT NULL DEFAULT 'ok' REFERENCES sync_statuses(id),
            deleted_at TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            PRIMARY KEY (realm_id, id),
            FOREIGN KEY (realm_id) REFERENCES realms(id) ON DELETE CASCADE
        );
    `);
}

function createLocationIndexes(db) {
    db.exec(`
        DROP INDEX IF EXISTS idx_locations_realm_name;
        DROP INDEX IF EXISTS idx_locations_realm_region;
        CREATE INDEX IF NOT EXISTS idx_locations_realm_name ON locations(realm_id, name);
        CREATE INDEX IF NOT EXISTS idx_locations_realm_region ON locations(realm_id, region);
        CREATE INDEX IF NOT EXISTS idx_locations_realm_type ON locations(realm_id, type);
        CREATE INDEX IF NOT EXISTS idx_locations_sync_status ON locations(sync_status);
        CREATE INDEX IF NOT EXISTS idx_locations_sheet_identity ON locations(external_sheet_id, sheet_row_id);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_locations_sheet_row_unique
            ON locations(external_sheet_id, sheet_row_id)
            WHERE external_sheet_id IS NOT NULL AND sheet_row_id IS NOT NULL;
        CREATE INDEX IF NOT EXISTS idx_locations_modified ON locations(last_modified_at);
        CREATE INDEX IF NOT EXISTS idx_locations_deleted ON locations(deleted_at);
        CREATE INDEX IF NOT EXISTS idx_roads_realm_type ON roads(realm_id, type);
        CREATE INDEX IF NOT EXISTS idx_roads_realm_name ON roads(realm_id, name);
    `);
}

function setMeta(db, key, value) {
    db.prepare(`
        INSERT INTO world_meta (key, value) VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(key, value);
}

function migrateUp(db) {
    if (!tableExists(db, 'locations')) throw new Error('locations table does not exist');
    const issues = validateCurrentData(db);
    if (issues.length) {
        throw new Error(`Cannot migrate; validation failed:\n${issues.join('\n')}`);
    }

    createLookupTables(db);
    const legacyName = `locations_legacy_${stamp()}`;
    const rows = db.prepare('SELECT * FROM locations ORDER BY realm_id, sort_order').all();
    const migrationTime = nowIso();

    db.exec('BEGIN IMMEDIATE');
    try {
        db.exec('DROP TABLE IF EXISTS locations_v2');
        createV2LocationTable(db, 'locations_v2');
        const insert = db.prepare(`
            INSERT INTO locations_v2 (
                realm_id, id, name, type, x, y, region, sort_order, data_json,
                external_sheet_id, sheet_row_id, last_synced_at, last_modified_at,
                modified_source, sync_status, deleted_at, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        rows.forEach((row) => {
            const json = readJson(row.data_json);
            const updatedAt = json.updatedAt || json.updated_at || row.updated_at || migrationTime;
            const createdAt = json.createdAt || json.created_at || row.created_at || updatedAt;
            const lastModifiedAt = json.last_modified_at || row.last_modified_at || updatedAt;
            const modifiedSource = normalizeSource(json.modified_source || json.updatedSource || row.modified_source || 'migration');
            const syncStatus = normalizeSyncStatus(json.sync_status || row.sync_status || 'ok');
            const enrichedJson = {
                ...json,
                id: row.id,
                name: row.name,
                type: row.type,
                x: row.x,
                y: row.y,
                updatedAt,
                updatedSource: modifiedSource,
                createdAt,
                last_modified_at: lastModifiedAt,
                modified_source: modifiedSource,
                sync_status: syncStatus
            };
            if (row.region != null) enrichedJson.region = row.region;
            insert.run(
                row.realm_id,
                row.id,
                row.name,
                row.type,
                row.x,
                row.y,
                row.region,
                row.sort_order,
                JSON.stringify(enrichedJson),
                json.external_sheet_id || row.external_sheet_id || null,
                json.sheet_row_id == null ? (row.sheet_row_id == null ? null : Number(row.sheet_row_id)) : Number(json.sheet_row_id),
                json.last_synced_at || row.last_synced_at || null,
                lastModifiedAt,
                modifiedSource,
                syncStatus,
                json.deleted_at || row.deleted_at || null,
                createdAt,
                updatedAt
            );
        });
        db.exec(`ALTER TABLE locations RENAME TO ${legacyName}`);
        db.exec('ALTER TABLE locations_v2 RENAME TO locations');
        createLocationIndexes(db);
        setMeta(db, 'schema_version', '2');
        setMeta(db, 'schema_v2_migrated_at', migrationTime);
        setMeta(db, 'schema_v2_legacy_locations_table', legacyName);
        db.exec('COMMIT');
        return { ok: true, action: 'up', migratedRows: rows.length, legacyTable: legacyName };
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    }
}

function migrateDown(db) {
    const legacyRow = db.prepare("SELECT value FROM world_meta WHERE key = 'schema_v2_legacy_locations_table'").get();
    const legacyName = legacyRow && legacyRow.value;
    if (!legacyName || !tableExists(db, legacyName)) {
        throw new Error('No legacy locations table is available for rollback.');
    }
    const currentBackup = `locations_v2_rollback_${stamp()}`;
    db.exec('BEGIN IMMEDIATE');
    try {
        db.exec(`ALTER TABLE locations RENAME TO ${currentBackup}`);
        db.exec(`ALTER TABLE ${legacyName} RENAME TO locations`);
        createLocationIndexes(db);
        setMeta(db, 'schema_version', '1');
        setMeta(db, 'schema_v2_rolled_back_at', nowIso());
        setMeta(db, 'schema_v2_rollback_locations_table', currentBackup);
        db.exec('COMMIT');
        return { ok: true, action: 'down', restoredTable: legacyName, v2BackupTable: currentBackup };
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    }
}

function status(db) {
    return {
        databasePath,
        hasLocationsTable: tableExists(db, 'locations'),
        v2ColumnsPresent: tableExists(db, 'locations') && hasV2LocationSchema(db),
        tables: db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all().map((row) => row.name),
        schemaVersion: db.prepare("SELECT value FROM world_meta WHERE key = 'schema_version'").get()?.value || null,
        integrity: db.prepare('PRAGMA integrity_check').get(),
        foreignKeyCheck: db.prepare('PRAGMA foreign_key_check').all()
    };
}

const db = new DatabaseSync(databasePath);
db.exec('PRAGMA foreign_keys = ON;');

try {
    if (command === 'up') {
        console.log(JSON.stringify(migrateUp(db), null, 2));
    } else if (command === 'down') {
        console.log(JSON.stringify(migrateDown(db), null, 2));
    } else if (command === 'status') {
        console.log(JSON.stringify(status(db), null, 2));
    } else {
        throw new Error(`Unknown command: ${command}`);
    }
} catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
} finally {
    db.close();
}
