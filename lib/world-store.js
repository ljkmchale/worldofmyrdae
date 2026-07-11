const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const REALMS = ['surface', 'underdark'];
const SCHEMA_VERSION = 3;
const LOCATION_DISPOSITIONS = new Set(['hostile', 'neutral', 'friendly']);
const LOCATION_TYPES = [
    ['capital', 'Capital'],
    ['city', 'Large Settlement'],
    ['landmark', 'Landmark'],
    ['nature', 'Nature'],
    ['poi', 'Point of Interest'],
    ['region', 'Region'],
    ['river', 'River'],
    ['ruins', 'Ruins'],
    ['small-city', 'Mid-sized Settlement'],
    ['town', 'Small Settlement'],
    ['water', 'Water']
];
const ROAD_TYPES = [
    ['major', 'Major'],
    ['minor', 'Minor'],
    ['river', 'River'],
    ['border', 'Border'],
    ['water-route', 'Water Route']
];
const ROAD_FIELD_COLUMNS = [
    ['curved', 'curved', 'INTEGER'],
    ['color', 'color', 'TEXT'],
    ['width', 'width', 'REAL'],
    ['fontFamily', 'font_family', 'TEXT'],
    ['fontSize', 'font_size', 'REAL'],
    ['fontStyle', 'font_style', 'TEXT'],
    ['labelOffset', 'label_offset', 'REAL'],
    ['labelReverse', 'label_reverse', 'INTEGER'],
    ['labelSide', 'label_side', 'TEXT'],
    ['boatColor', 'boat_color', 'TEXT'],
    ['boatSizeMultiplier', 'boat_size_multiplier', 'REAL'],
    ['captainName', 'captain_name', 'TEXT'],
    ['cargo', 'cargo', 'TEXT'],
    ['riskLevel', 'risk_level', 'TEXT'],
    ['routePurpose', 'route_purpose', 'TEXT'],
    ['shipName', 'ship_name', 'TEXT'],
    ['shipType', 'ship_type', 'TEXT']
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
const LOCATION_FIELD_COLUMNS = [
    ['description', 'description', 'TEXT'],
    ['cityMap', 'city_map', 'TEXT'],
    ['link', 'link', 'TEXT'],
    ['biome', 'biome', 'TEXT'],
    ['disposition', 'disposition', "TEXT NOT NULL DEFAULT 'neutral' CHECK (disposition IN ('hostile', 'neutral', 'friendly'))"],
    ['details', 'details', 'TEXT'],
    ['cityScene', 'city_scene', 'TEXT'],
    ['tooltipImage', 'tooltip_image', 'TEXT'],
    ['fontFamily', 'font_family', 'TEXT'],
    ['fontSize', 'font_size', 'REAL'],
    ['fontWeight', 'font_weight', 'TEXT'],
    ['fontStyle', 'font_style', 'TEXT'],
    ['markerSize', 'marker_size', 'REAL'],
    ['markerOffsetX', 'marker_offset_x', 'REAL'],
    ['markerOffsetY', 'marker_offset_y', 'REAL'],
    ['labelOffsetX', 'label_offset_x', 'REAL'],
    ['labelOffsetY', 'label_offset_y', 'REAL'],
    ['labelAlign', 'label_align', 'TEXT'],
    ['rotation', 'rotation', 'REAL'],
    ['opacity', 'opacity', 'REAL'],
    ['textCurve', 'text_curve', 'REAL'],
    ['hideLabel', 'hide_label', 'INTEGER']
];
const LOCATION_NUMBER_FIELDS = new Set([
    'fontSize',
    'markerSize',
    'markerOffsetX',
    'markerOffsetY',
    'labelOffsetX',
    'labelOffsetY',
    'rotation',
    'opacity',
    'textCurve'
]);
const LOCATION_BOOLEAN_FIELDS = new Set(['hideLabel']);
const LOCATION_COLUMN_NAMES = LOCATION_FIELD_COLUMNS.map(([, column]) => column);
const ROAD_NUMBER_FIELDS = new Set(['width', 'fontSize', 'labelOffset', 'boatSizeMultiplier']);
const ROAD_BOOLEAN_FIELDS = new Set(['curved', 'labelReverse']);
const ROAD_COLUMN_NAMES = ROAD_FIELD_COLUMNS.map(([, column]) => column);

function normalizeRealmData(source = {}) {
    return {
        locations: Array.isArray(source.locations) ? source.locations : [],
        roads: Array.isArray(source.roads) ? source.roads : []
    };
}

function normalizeWorld(world = {}) {
    const surface = normalizeRealmData(world);
    const underdark = normalizeRealmData(world.underdark);
    return {
        locations: surface.locations,
        roads: surface.roads,
        underdark: {
            mapImage: world.underdark && typeof world.underdark.mapImage === 'string'
                ? world.underdark.mapImage
                : 'images/myrdae-map-layers/underdark-map.webp',
            locations: underdark.locations,
            roads: underdark.roads
        }
    };
}

function nowIso() {
    return new Date().toISOString();
}

function hasColumn(db, tableName, columnName) {
    return db.prepare(`PRAGMA table_info(${tableName})`).all()
        .some((column) => column.name === columnName);
}

function readJson(value, fallback = {}) {
    if (!value) return fallback;
    try {
        const parsed = JSON.parse(value);
        return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch (err) {
        return fallback;
    }
}

function normalizeSyncStatus(value) {
    const status = String(value || 'ok').trim().toLowerCase();
    return SYNC_STATUSES.some(([id]) => id === status) ? status : 'ok';
}

function normalizeSource(value) {
    return String(value || 'database').trim() || 'database';
}

function normalizeOptionalString(value) {
    if (value === undefined || value === null || value === '') return null;
    return String(value);
}

function normalizeOptionalNumber(value) {
    if (value === undefined || value === null || value === '') return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
}

function normalizeOptionalBoolean(value) {
    if (value === undefined || value === null || value === '') return null;
    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (['true', 'yes', '1'].includes(normalized)) return 1;
        if (['false', 'no', '0'].includes(normalized)) return 0;
        return null;
    }
    return value ? 1 : 0;
}

function normalizeDisposition(value) {
    const disposition = String(value || 'neutral').trim().toLowerCase();
    return LOCATION_DISPOSITIONS.has(disposition) ? disposition : 'neutral';
}

function buildLocationColumnValues(location = {}) {
    return LOCATION_FIELD_COLUMNS.reduce((values, [field, column]) => {
        if (field === 'disposition') {
            values[column] = normalizeDisposition(location[field]);
        } else if (LOCATION_NUMBER_FIELDS.has(field)) {
            values[column] = normalizeOptionalNumber(location[field]);
        } else if (LOCATION_BOOLEAN_FIELDS.has(field)) {
            values[column] = normalizeOptionalBoolean(location[field]);
        } else {
            values[column] = normalizeOptionalString(location[field]);
        }
        return values;
    }, {});
}

function assignLocationColumnFields(target, row) {
    LOCATION_FIELD_COLUMNS.forEach(([field, column]) => {
        if (row[column] === undefined || row[column] === null) return;
        if (LOCATION_BOOLEAN_FIELDS.has(field)) {
            target[field] = Boolean(row[column]);
        } else if (LOCATION_NUMBER_FIELDS.has(field)) {
            target[field] = Number(row[column]);
        } else {
            target[field] = row[column];
        }
    });
    return target;
}

function buildRoadColumnValues(road = {}) {
    return ROAD_FIELD_COLUMNS.reduce((values, [field, column]) => {
        if (ROAD_NUMBER_FIELDS.has(field)) {
            values[column] = normalizeOptionalNumber(road[field]);
        } else if (ROAD_BOOLEAN_FIELDS.has(field)) {
            values[column] = normalizeOptionalBoolean(road[field]);
        } else {
            values[column] = normalizeOptionalString(road[field]);
        }
        return values;
    }, {});
}

function assignRoadColumnFields(target, row) {
    ROAD_FIELD_COLUMNS.forEach(([field, column]) => {
        if (row[column] === undefined || row[column] === null) return;
        if (ROAD_BOOLEAN_FIELDS.has(field)) {
            target[field] = Boolean(row[column]);
        } else if (ROAD_NUMBER_FIELDS.has(field)) {
            target[field] = Number(row[column]);
        } else {
            target[field] = row[column];
        }
    });
    return target;
}

function getRoadPoints(road = {}) {
    if (Array.isArray(road.points)) return road.points;
    if (Array.isArray(road.waypoints)) return road.waypoints;
    return [];
}

function normalizeRoadPoint(point) {
    if (typeof point === 'string') {
        return { point_kind: 'location', location_id: point, x: null, y: null, data_json: null };
    }
    if (Array.isArray(point) && point.length >= 2) {
        const x = normalizeOptionalNumber(point[0]);
        const y = normalizeOptionalNumber(point[1]);
        return { point_kind: 'coordinate', location_id: null, x, y, data_json: null };
    }
    if (point && typeof point === 'object' && Number.isFinite(Number(point.x)) && Number.isFinite(Number(point.y))) {
        return { point_kind: 'coordinate', location_id: null, x: Number(point.x), y: Number(point.y), data_json: JSON.stringify(point) };
    }
    return { point_kind: 'json', location_id: null, x: null, y: null, data_json: JSON.stringify(point) };
}

function roadPointFromRow(row) {
    if (row.point_kind === 'location') return row.location_id;
    if (row.point_kind === 'coordinate') return [Number(row.x), Number(row.y)];
    return readJson(row.data_json, null);
}

function getLocationTimestamp(location = {}, fallback = nowIso()) {
    return location.last_modified_at ||
        location.lastModifiedAt ||
        location.updatedAt ||
        location.updated_at ||
        fallback;
}

function getLocationCreatedAt(existingRow, location, fallback) {
    return (existingRow && existingRow.created_at) ||
        location.createdAt ||
        location.created_at ||
        getLocationTimestamp(location, fallback);
}

function buildLocationJson(location, metadata) {
    const next = { ...location };
    if (metadata.created_at && !next.createdAt) next.createdAt = metadata.created_at;
    next.updatedAt = metadata.updated_at;
    next.updatedSource = metadata.modified_source;
    next.syncRevision = metadata.sync_revision;
    if (metadata.external_sheet_id) next.external_sheet_id = metadata.external_sheet_id;
    if (metadata.sheet_row_id != null) next.sheet_row_id = metadata.sheet_row_id;
    if (metadata.last_synced_at) next.last_synced_at = metadata.last_synced_at;
    next.last_modified_at = metadata.last_modified_at;
    next.modified_source = metadata.modified_source;
    next.sync_status = metadata.sync_status;
    if (metadata.deleted_at) next.deleted_at = metadata.deleted_at;
    return next;
}

class WorldStore {
    constructor(databasePath) {
        this.databasePath = path.resolve(databasePath);
        fs.mkdirSync(path.dirname(this.databasePath), { recursive: true });
        this.db = new DatabaseSync(this.databasePath);
        this.db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL;');
        this.initializeSchema();
        this.prepareStatements();
    }

    initializeSchema() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS realms (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                map_image TEXT,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS locations (
                realm_id TEXT NOT NULL,
                id TEXT NOT NULL,
                name TEXT NOT NULL CHECK (trim(name) <> ''),
                type TEXT NOT NULL REFERENCES location_types(id),
                x REAL NOT NULL CHECK (x >= 0 AND x <= 100),
                y REAL NOT NULL CHECK (y >= 0 AND y <= 100),
                region TEXT,
                description TEXT,
                city_map TEXT,
                link TEXT,
                biome TEXT,
                disposition TEXT NOT NULL DEFAULT 'neutral'
                    CHECK (disposition IN ('hostile', 'neutral', 'friendly')),
                details TEXT,
                city_scene TEXT,
                tooltip_image TEXT,
                font_family TEXT,
                font_size REAL,
                font_weight TEXT,
                font_style TEXT,
                marker_size REAL,
                marker_offset_x REAL,
                marker_offset_y REAL,
                label_offset_x REAL,
                label_offset_y REAL,
                label_align TEXT,
                rotation REAL,
                opacity REAL,
                text_curve REAL,
                hide_label INTEGER,
                sort_order INTEGER NOT NULL,
                data_json TEXT NOT NULL,
                external_sheet_id TEXT,
                sheet_row_id INTEGER,
                last_synced_at TEXT,
                last_modified_at TEXT,
                modified_source TEXT NOT NULL DEFAULT 'database',
                sync_status TEXT NOT NULL DEFAULT 'ok',
                deleted_at TEXT,
                created_at TEXT,
                updated_at TEXT,
                PRIMARY KEY (realm_id, id),
                FOREIGN KEY (realm_id) REFERENCES realms(id) ON DELETE CASCADE
            );

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

            CREATE TABLE IF NOT EXISTS roads (
                realm_id TEXT NOT NULL,
                id TEXT NOT NULL,
                name TEXT,
                type TEXT,
                curved INTEGER,
                color TEXT,
                width REAL,
                font_family TEXT,
                font_size REAL,
                font_style TEXT,
                label_offset REAL,
                label_reverse INTEGER,
                label_side TEXT,
                boat_color TEXT,
                boat_size_multiplier REAL,
                captain_name TEXT,
                cargo TEXT,
                risk_level TEXT,
                route_purpose TEXT,
                ship_name TEXT,
                ship_type TEXT,
                sort_order INTEGER NOT NULL,
                data_json TEXT NOT NULL,
                PRIMARY KEY (realm_id, id),
                FOREIGN KEY (realm_id) REFERENCES realms(id) ON DELETE CASCADE
            );
            CREATE INDEX IF NOT EXISTS idx_roads_realm_type ON roads(realm_id, type);
            CREATE INDEX IF NOT EXISTS idx_roads_realm_name ON roads(realm_id, name);

            CREATE TABLE IF NOT EXISTS road_points (
                realm_id TEXT NOT NULL,
                road_id TEXT NOT NULL,
                point_order INTEGER NOT NULL,
                point_kind TEXT NOT NULL CHECK (point_kind IN ('location', 'coordinate', 'json')),
                location_id TEXT,
                x REAL,
                y REAL,
                data_json TEXT,
                PRIMARY KEY (realm_id, road_id, point_order),
                FOREIGN KEY (realm_id, road_id) REFERENCES roads(realm_id, id) ON DELETE CASCADE,
                FOREIGN KEY (realm_id, location_id) REFERENCES locations(realm_id, id) ON DELETE SET NULL
            );
            CREATE INDEX IF NOT EXISTS idx_road_points_location ON road_points(realm_id, location_id);

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

            CREATE TABLE IF NOT EXISTS world_meta (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS audit_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                route TEXT NOT NULL,
                change_count INTEGER NOT NULL,
                entry_json TEXT NOT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp DESC);
        `);
        this.ensureLocationColumns();
        this.ensureRoadColumns();
        this.archiveUnusedRegionsTable();
        this.seedLookupTables();
        this.backfillLocationTypedColumns();
        this.backfillRoadTypedColumns();
        this.setMetaValueRaw('schema_version', String(SCHEMA_VERSION));
    }

    ensureLocationColumns() {
        const columns = [
            ...LOCATION_FIELD_COLUMNS.map(([, name, definition]) => [name, definition]),
            ['external_sheet_id', 'TEXT'],
            ['sheet_row_id', 'INTEGER'],
            ['last_synced_at', 'TEXT'],
            ['last_modified_at', 'TEXT'],
            ['modified_source', "TEXT NOT NULL DEFAULT 'database'"],
            ['sync_status', "TEXT NOT NULL DEFAULT 'ok'"],
            ['deleted_at', 'TEXT'],
            ['created_at', 'TEXT'],
            ['updated_at', 'TEXT']
        ];
        columns.forEach(([name, definition]) => {
            if (!hasColumn(this.db, 'locations', name)) {
                this.db.exec(`ALTER TABLE locations ADD COLUMN ${name} ${definition}`);
            }
        });
        this.ensureIndexOnTable('idx_locations_realm_name', 'locations', 'CREATE INDEX idx_locations_realm_name ON locations(realm_id, name)');
        this.ensureIndexOnTable('idx_locations_realm_region', 'locations', 'CREATE INDEX idx_locations_realm_region ON locations(realm_id, region)');
        this.ensureIndexOnTable('idx_locations_realm_type', 'locations', 'CREATE INDEX idx_locations_realm_type ON locations(realm_id, type)');
        this.ensureIndexOnTable('idx_locations_realm_biome', 'locations', 'CREATE INDEX idx_locations_realm_biome ON locations(realm_id, biome)');
        this.ensureIndexOnTable('idx_locations_realm_disposition', 'locations', 'CREATE INDEX idx_locations_realm_disposition ON locations(realm_id, disposition)');
        this.ensureIndexOnTable('idx_locations_city_map', 'locations', 'CREATE INDEX idx_locations_city_map ON locations(city_map)');
        this.ensureIndexOnTable('idx_locations_sync_status', 'locations', 'CREATE INDEX idx_locations_sync_status ON locations(sync_status)');
        this.ensureIndexOnTable('idx_locations_sheet_identity', 'locations', 'CREATE INDEX idx_locations_sheet_identity ON locations(external_sheet_id, sheet_row_id)');
        this.ensureIndexOnTable(
            'idx_locations_sheet_row_unique',
            'locations',
            `CREATE UNIQUE INDEX idx_locations_sheet_row_unique
                ON locations(external_sheet_id, sheet_row_id)
                WHERE external_sheet_id IS NOT NULL AND sheet_row_id IS NOT NULL`
        );
        this.ensureIndexOnTable('idx_locations_modified', 'locations', 'CREATE INDEX idx_locations_modified ON locations(last_modified_at)');
        this.ensureIndexOnTable('idx_locations_deleted', 'locations', 'CREATE INDEX idx_locations_deleted ON locations(deleted_at)');
        this.ensureIndexOnTable('idx_roads_realm_type', 'roads', 'CREATE INDEX idx_roads_realm_type ON roads(realm_id, type)');
        this.ensureIndexOnTable('idx_roads_realm_name', 'roads', 'CREATE INDEX idx_roads_realm_name ON roads(realm_id, name)');
    }

    ensureRoadColumns() {
        ROAD_FIELD_COLUMNS.forEach(([, name, definition]) => {
            if (!hasColumn(this.db, 'roads', name)) {
                this.db.exec(`ALTER TABLE roads ADD COLUMN ${name} ${definition}`);
            }
        });
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS road_points (
                realm_id TEXT NOT NULL,
                road_id TEXT NOT NULL,
                point_order INTEGER NOT NULL,
                point_kind TEXT NOT NULL CHECK (point_kind IN ('location', 'coordinate', 'json')),
                location_id TEXT,
                x REAL,
                y REAL,
                data_json TEXT,
                PRIMARY KEY (realm_id, road_id, point_order),
                FOREIGN KEY (realm_id, road_id) REFERENCES roads(realm_id, id) ON DELETE CASCADE,
                FOREIGN KEY (realm_id, location_id) REFERENCES locations(realm_id, id) ON DELETE SET NULL
            )
        `);
        this.ensureIndexOnTable('idx_roads_realm_type', 'roads', 'CREATE INDEX idx_roads_realm_type ON roads(realm_id, type)');
        this.ensureIndexOnTable('idx_roads_realm_name', 'roads', 'CREATE INDEX idx_roads_realm_name ON roads(realm_id, name)');
        this.ensureIndexOnTable('idx_roads_route_purpose', 'roads', 'CREATE INDEX idx_roads_route_purpose ON roads(route_purpose)');
        this.ensureIndexOnTable('idx_road_points_location', 'road_points', 'CREATE INDEX idx_road_points_location ON road_points(realm_id, location_id)');
    }

    backfillLocationTypedColumns() {
        const rows = this.db.prepare(`
            SELECT realm_id, id, data_json, ${LOCATION_COLUMN_NAMES.join(', ')}
            FROM locations
        `).all();
        if (!rows.length) return;
        const assignments = LOCATION_COLUMN_NAMES.map((column) => `${column} = ?`).join(', ');
        const update = this.db.prepare(`
            UPDATE locations
            SET ${assignments}, data_json = ?
            WHERE realm_id = ? AND id = ?
        `);
        const updates = [];
        rows.forEach((row) => {
            const parsed = readJson(row.data_json, null);
            if (!parsed) return;
            const values = buildLocationColumnValues(parsed);
            const nextValues = LOCATION_COLUMN_NAMES.map((column) => (
                row[column] === null || row[column] === undefined ? values[column] : row[column]
            ));
            const nextColumnValues = Object.fromEntries(
                LOCATION_COLUMN_NAMES.map((column, index) => [column, nextValues[index]])
            );
            const nextJson = JSON.stringify(assignLocationColumnFields({ ...parsed }, nextColumnValues));
            const needsUpdate = nextJson !== row.data_json || LOCATION_COLUMN_NAMES.some((column, index) => (
                (row[column] === null || row[column] === undefined) &&
                nextValues[index] !== null &&
                nextValues[index] !== undefined
            ));
            if (needsUpdate) updates.push([...nextValues, nextJson, row.realm_id, row.id]);
        });
        if (!updates.length) return;
        this.db.exec('BEGIN IMMEDIATE');
        try {
            updates.forEach((args) => update.run(...args));
            this.setMetaValueRaw('location_typed_columns_backfilled_at', nowIso());
            this.db.exec('COMMIT');
        } catch (error) {
            this.db.exec('ROLLBACK');
            throw error;
        }
    }

    backfillRoadTypedColumns() {
        const rows = this.db.prepare(`
            SELECT realm_id, id, data_json, ${ROAD_COLUMN_NAMES.join(', ')}
            FROM roads
        `).all();
        if (!rows.length) return;
        const assignments = ROAD_COLUMN_NAMES.map((column) => `${column} = ?`).join(', ');
        const update = this.db.prepare(`
            UPDATE roads
            SET ${assignments}
            WHERE realm_id = ? AND id = ?
        `);
        const countPoints = this.db.prepare('SELECT COUNT(*) AS count FROM road_points WHERE realm_id = ? AND road_id = ?');
        const insertPoint = this.db.prepare(`
            INSERT INTO road_points (realm_id, road_id, point_order, point_kind, location_id, x, y, data_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const updates = [];
        const pointInserts = [];
        rows.forEach((row) => {
            const parsed = readJson(row.data_json, null);
            if (!parsed) return;
            const values = buildRoadColumnValues(parsed);
            const nextValues = ROAD_COLUMN_NAMES.map((column) => (
                row[column] === null || row[column] === undefined ? values[column] : row[column]
            ));
            const needsColumnUpdate = ROAD_COLUMN_NAMES.some((column, index) => (
                (row[column] === null || row[column] === undefined) &&
                nextValues[index] !== null &&
                nextValues[index] !== undefined
            ));
            if (needsColumnUpdate) updates.push([...nextValues, row.realm_id, row.id]);
            if (Number(countPoints.get(row.realm_id, row.id).count) === 0) {
                getRoadPoints(parsed).forEach((point, index) => {
                    const normalized = normalizeRoadPoint(point);
                    pointInserts.push([
                        row.realm_id,
                        row.id,
                        index,
                        normalized.point_kind,
                        normalized.location_id,
                        normalized.x,
                        normalized.y,
                        normalized.data_json
                    ]);
                });
            }
        });
        if (!updates.length && !pointInserts.length) return;
        this.db.exec('BEGIN IMMEDIATE');
        try {
            updates.forEach((args) => update.run(...args));
            pointInserts.forEach((args) => insertPoint.run(...args));
            this.setMetaValueRaw('road_typed_columns_backfilled_at', nowIso());
            this.db.exec('COMMIT');
        } catch (error) {
            this.db.exec('ROLLBACK');
            throw error;
        }
    }

    ensureIndexOnTable(indexName, tableName, createSql) {
        const row = this.db.prepare("SELECT tbl_name FROM sqlite_master WHERE type = 'index' AND name = ?").get(indexName);
        if (row && row.tbl_name === tableName) return;
        if (row) this.db.exec(`DROP INDEX ${indexName}`);
        this.db.exec(createSql);
    }

    archiveUnusedRegionsTable() {
        const table = this.db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'regions'").get();
        if (!table) return;
        const count = Number(this.db.prepare('SELECT COUNT(*) AS count FROM regions').get().count);
        if (count === 0) {
            this.db.exec('DROP TABLE regions');
            this.setMetaValueRaw('independent_regions_table_removed_at', nowIso());
            return;
        }
        const timestamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
        const archiveName = `regions_legacy_${timestamp}`;
        this.db.exec(`ALTER TABLE regions RENAME TO ${archiveName}`);
        this.setMetaValueRaw('independent_regions_archived_table', archiveName);
    }

    seedLookupTables() {
        const insertLocationType = this.db.prepare(`
            INSERT INTO location_types (id, label) VALUES (?, ?)
            ON CONFLICT(id) DO NOTHING
        `);
        const insertRoadType = this.db.prepare(`
            INSERT INTO road_types (id, label) VALUES (?, ?)
            ON CONFLICT(id) DO NOTHING
        `);
        const insertSyncStatus = this.db.prepare(`
            INSERT INTO sync_statuses (id, label) VALUES (?, ?)
            ON CONFLICT(id) DO NOTHING
        `);
        LOCATION_TYPES.forEach(([id, label]) => insertLocationType.run(id, label));
        ROAD_TYPES.forEach(([id, label]) => insertRoadType.run(id, label));
        SYNC_STATUSES.forEach(([id, label]) => insertSyncStatus.run(id, label));
    }

    prepareStatements() {
        this.upsertRealm = this.db.prepare(`
            INSERT INTO realms (id, name, map_image, updated_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(id) DO UPDATE SET
                name = excluded.name,
                map_image = excluded.map_image,
                updated_at = CURRENT_TIMESTAMP
        `);
        this.readLocationMetadata = this.db.prepare(`
            SELECT created_at, updated_at, last_modified_at, modified_source, sync_status,
                   external_sheet_id, sheet_row_id, last_synced_at, deleted_at, data_json
            FROM locations
            WHERE realm_id = ? AND id = ?
        `);
        this.softDeleteMissingLocations = this.db.prepare(`
            UPDATE locations
            SET deleted_at = ?,
                sync_status = 'deleted',
                last_modified_at = ?,
                updated_at = ?,
                modified_source = ?
            WHERE realm_id = ?
              AND deleted_at IS NULL
              AND id NOT IN (SELECT value FROM json_each(?))
        `);
        this.deleteRoadPoints = this.db.prepare('DELETE FROM road_points WHERE realm_id = ?');
        this.deleteRoads = this.db.prepare('DELETE FROM roads WHERE realm_id = ?');
        this.insertLocation = this.db.prepare(`
            INSERT INTO locations (
                realm_id, id, name, type, x, y, region, ${LOCATION_COLUMN_NAMES.join(', ')}, sort_order, data_json,
                external_sheet_id, sheet_row_id, last_synced_at, last_modified_at,
                modified_source, sync_status, deleted_at, created_at, updated_at
            )
            VALUES (${Array(7 + LOCATION_COLUMN_NAMES.length + 11).fill('?').join(', ')})
            ON CONFLICT(realm_id, id) DO UPDATE SET
                name = excluded.name,
                type = excluded.type,
                x = excluded.x,
                y = excluded.y,
                region = excluded.region,
                ${LOCATION_COLUMN_NAMES.map((column) => `${column} = excluded.${column}`).join(',\n                ')},
                sort_order = excluded.sort_order,
                data_json = excluded.data_json,
                external_sheet_id = excluded.external_sheet_id,
                sheet_row_id = excluded.sheet_row_id,
                last_synced_at = excluded.last_synced_at,
                last_modified_at = excluded.last_modified_at,
                modified_source = excluded.modified_source,
                sync_status = excluded.sync_status,
                deleted_at = excluded.deleted_at,
                created_at = COALESCE(locations.created_at, excluded.created_at),
                updated_at = excluded.updated_at
        `);
        this.insertRoad = this.db.prepare(`
            INSERT INTO roads (realm_id, id, name, type, ${ROAD_COLUMN_NAMES.join(', ')}, sort_order, data_json)
            VALUES (${Array(4 + ROAD_COLUMN_NAMES.length + 2).fill('?').join(', ')})
        `);
        this.insertRoadPoint = this.db.prepare(`
            INSERT INTO road_points (realm_id, road_id, point_order, point_kind, location_id, x, y, data_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        this.readRealm = this.db.prepare('SELECT id, name, map_image FROM realms WHERE id = ?');
        this.readLocations = this.db.prepare(`
            SELECT id, name, type, x, y, region, ${LOCATION_COLUMN_NAMES.join(', ')},
                   data_json, external_sheet_id, sheet_row_id, last_synced_at, last_modified_at,
                   modified_source, sync_status, deleted_at, created_at, updated_at
            FROM locations
            WHERE realm_id = ? AND deleted_at IS NULL
            ORDER BY sort_order
        `);
        this.readRoads = this.db.prepare(`
            SELECT id, name, type, ${ROAD_COLUMN_NAMES.join(', ')}, data_json
            FROM roads
            WHERE realm_id = ?
            ORDER BY sort_order
        `);
        this.readRoadPoints = this.db.prepare(`
            SELECT point_kind, location_id, x, y, data_json
            FROM road_points
            WHERE realm_id = ? AND road_id = ?
            ORDER BY point_order
        `);
        this.recordCount = this.db.prepare('SELECT COUNT(*) AS count FROM realms');
        this.setMeta = this.db.prepare(`
            INSERT INTO world_meta (key, value) VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
        `);
        this.getMetaValue = this.db.prepare('SELECT value FROM world_meta WHERE key = ?');
        this.listMetaValues = this.db.prepare('SELECT key, value FROM world_meta ORDER BY key');
        this.insertAudit = this.db.prepare(`
            INSERT INTO audit_log (timestamp, route, change_count, entry_json)
            VALUES (?, ?, ?, ?)
        `);
        this.selectAudit = this.db.prepare(`
            SELECT entry_json FROM audit_log ORDER BY id DESC LIMIT ?
        `);
    }

    isEmpty() {
        return Number(this.recordCount.get().count) === 0;
    }

    setMetaValueRaw(key, value) {
        const existing = this.db.prepare('SELECT value FROM world_meta WHERE key = ?').get(key);
        if (existing && existing.value === value) return;
        this.db.prepare(`
            INSERT INTO world_meta (key, value) VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
        `).run(key, value);
    }

    writeWorld(input, metadata = {}) {
        const world = normalizeWorld(input);
        const realmSources = {
            surface: world,
            underdark: world.underdark
        };

        this.db.exec('BEGIN IMMEDIATE');
        try {
            const writeTime = nowIso();
            const sourceName = metadata.source || 'server';
            REALMS.forEach((realmId) => {
                const source = realmSources[realmId];
                const mapImage = realmId === 'underdark' ? world.underdark.mapImage : null;
                this.upsertRealm.run(realmId, realmId === 'surface' ? 'Surface World' : 'Underdark', mapImage);
                this.deleteRoadPoints.run(realmId);
                this.deleteRoads.run(realmId);

                const activeLocationIds = [];
                source.locations.forEach((location, index) => {
                    const id = String(location.id || `location-${index}`);
                    activeLocationIds.push(id);
                    const existing = this.readLocationMetadata.get(realmId, id);
                    const existingJson = existing ? readJson(existing.data_json) : {};
                    const updatedAt = getLocationTimestamp(location, writeTime);
                    const modifiedSource = normalizeSource(location.modified_source || location.updatedSource || sourceName);
                    const syncStatus = normalizeSyncStatus(location.sync_status || (existing && existing.sync_status) || 'ok');
                    const syncRevision = Number.isFinite(Number(location.syncRevision))
                        ? Number(location.syncRevision)
                        : Number(existingJson.syncRevision || 0);
                    const locationMetadata = {
                        external_sheet_id: location.external_sheet_id || (existing && existing.external_sheet_id) || null,
                        sheet_row_id: location.sheet_row_id == null
                            ? (existing && existing.sheet_row_id)
                            : Number(location.sheet_row_id),
                        last_synced_at: location.last_synced_at || (existing && existing.last_synced_at) || null,
                        last_modified_at: location.last_modified_at || updatedAt,
                        modified_source: modifiedSource,
                        sync_status: syncStatus,
                        deleted_at: location.deleted_at || null,
                        created_at: getLocationCreatedAt(existing, location, writeTime),
                        updated_at: updatedAt,
                        sync_revision: syncRevision
                    };
                    const locationColumns = buildLocationColumnValues(location);
                    const jsonLocation = buildLocationJson(
                        assignLocationColumnFields({
                            ...location,
                            id,
                            name: location.name == null ? null : String(location.name),
                            type: location.type == null ? null : String(location.type),
                            x: typeof location.x === 'number' ? location.x : null,
                            y: typeof location.y === 'number' ? location.y : null,
                            region: location.region == null ? null : String(location.region)
                        }, locationColumns),
                        locationMetadata
                    );
                    this.insertLocation.run(
                        realmId,
                        id,
                        location.name == null ? null : String(location.name),
                        location.type == null ? null : String(location.type),
                        typeof location.x === 'number' ? location.x : null,
                        typeof location.y === 'number' ? location.y : null,
                        location.region == null ? null : String(location.region),
                        ...LOCATION_COLUMN_NAMES.map((column) => locationColumns[column]),
                        index,
                        JSON.stringify(jsonLocation),
                        locationMetadata.external_sheet_id,
                        locationMetadata.sheet_row_id == null || Number.isNaN(locationMetadata.sheet_row_id) ? null : locationMetadata.sheet_row_id,
                        locationMetadata.last_synced_at,
                        locationMetadata.last_modified_at,
                        locationMetadata.modified_source,
                        locationMetadata.sync_status,
                        null,
                        locationMetadata.created_at,
                        locationMetadata.updated_at
                    );
                });
                this.softDeleteMissingLocations.run(
                    writeTime,
                    writeTime,
                    writeTime,
                    sourceName,
                    realmId,
                    JSON.stringify(activeLocationIds)
                );

                source.roads.forEach((road, index) => {
                    const id = String(road.id || `road-${index}`);
                    const roadColumns = buildRoadColumnValues(road);
                    const roadPoints = getRoadPoints(road);
                    const jsonRoad = assignRoadColumnFields({ ...road, id }, roadColumns);
                    jsonRoad.points = roadPoints;
                    this.insertRoad.run(
                        realmId,
                        id,
                        road.name == null ? null : String(road.name),
                        road.type == null ? null : String(road.type),
                        ...ROAD_COLUMN_NAMES.map((column) => roadColumns[column]),
                        index,
                        JSON.stringify(jsonRoad)
                    );
                    roadPoints.forEach((point, pointIndex) => {
                        const normalized = normalizeRoadPoint(point);
                        this.insertRoadPoint.run(
                            realmId,
                            id,
                            pointIndex,
                            normalized.point_kind,
                            normalized.location_id,
                            normalized.x,
                            normalized.y,
                            normalized.data_json
                        );
                    });
                });

            });

            this.setMeta.run('schema_version', String(SCHEMA_VERSION));
            this.setMeta.run('last_write_source', sourceName);
            this.setMeta.run('last_write_at', writeTime);
            this.db.exec('COMMIT');
        } catch (error) {
            this.db.exec('ROLLBACK');
            throw error;
        }

        return this.readWorld();
    }

    readCollection(statement, realmId) {
        return statement.all(realmId).map((row) => {
            const record = JSON.parse(row.data_json);
            if (row.created_at && !record.createdAt) record.createdAt = row.created_at;
            if (row.updated_at) record.updatedAt = row.updated_at;
            if (row.last_modified_at) record.last_modified_at = row.last_modified_at;
            if (row.modified_source) record.modified_source = row.modified_source;
            if (row.sync_status) record.sync_status = row.sync_status;
            if (row.external_sheet_id) record.external_sheet_id = row.external_sheet_id;
            if (row.sheet_row_id != null) record.sheet_row_id = row.sheet_row_id;
            if (row.last_synced_at) record.last_synced_at = row.last_synced_at;
            if (row.deleted_at) record.deleted_at = row.deleted_at;
            return record;
        });
    }

    readLocationCollection(realmId) {
        return this.readLocations.all(realmId).map((row) => {
            const record = assignLocationColumnFields({
                ...readJson(row.data_json, {}),
                id: row.id,
                name: row.name,
                type: row.type,
                x: row.x,
                y: row.y,
                region: row.region
            }, row);
            if (row.created_at && !record.createdAt) record.createdAt = row.created_at;
            if (row.updated_at) record.updatedAt = row.updated_at;
            if (row.last_modified_at) record.last_modified_at = row.last_modified_at;
            if (row.modified_source) record.modified_source = row.modified_source;
            if (row.sync_status) record.sync_status = row.sync_status;
            if (row.external_sheet_id) record.external_sheet_id = row.external_sheet_id;
            if (row.sheet_row_id != null) record.sheet_row_id = row.sheet_row_id;
            if (row.last_synced_at) record.last_synced_at = row.last_synced_at;
            if (row.deleted_at) record.deleted_at = row.deleted_at;
            return record;
        });
    }

    readRoadCollection(realmId) {
        return this.readRoads.all(realmId).map((row) => {
            const record = assignRoadColumnFields({
                ...readJson(row.data_json, {}),
                id: row.id,
                name: row.name,
                type: row.type
            }, row);
            const points = this.readRoadPoints.all(realmId, row.id).map(roadPointFromRow);
            if (points.length) record.points = points;
            return record;
        });
    }

    readRealmData(realmId) {
        const realm = this.readRealm.get(realmId);
        return {
            mapImage: realm && realm.map_image ? realm.map_image : null,
            locations: this.readLocationCollection(realmId),
            roads: this.readRoadCollection(realmId)
        };
    }

    readWorld() {
        const surface = this.readRealmData('surface');
        const underdark = this.readRealmData('underdark');
        return {
            locations: surface.locations,
            roads: surface.roads,
            underdark: {
                mapImage: underdark.mapImage || 'images/myrdae-map-layers/underdark-map.webp',
                locations: underdark.locations,
                roads: underdark.roads
            }
        };
    }

    getCounts() {
        const world = this.readWorld();
        return {
            surface: {
                locations: world.locations.length,
                roads: world.roads.length
            },
            underdark: {
                locations: world.underdark.locations.length,
                roads: world.underdark.roads.length
            }
        };
    }

    getMeta(key, fallbackValue = null) {
        const row = this.getMetaValue.get(key);
        if (!row) return fallbackValue;
        try {
            return JSON.parse(row.value);
        } catch (err) {
            return row.value;
        }
    }

    setMetaValue(key, value) {
        this.setMeta.run(key, typeof value === 'string' ? value : JSON.stringify(value));
    }

    setLocationSyncMetadata(realmId, locationId, metadata = {}) {
        const fields = [];
        const values = [];
        const allowed = new Set([
            'external_sheet_id',
            'sheet_row_id',
            'last_synced_at',
            'last_modified_at',
            'modified_source',
            'sync_status',
            'deleted_at',
            'updated_at'
        ]);
        Object.keys(metadata).forEach((key) => {
            if (!allowed.has(key)) return;
            fields.push(`${key} = ?`);
            values.push(metadata[key]);
        });
        if (!fields.length) return;
        values.push(realmId, locationId);
        this.db.prepare(`
            UPDATE locations
            SET ${fields.join(', ')}
            WHERE realm_id = ? AND id = ?
        `).run(...values);
    }

    setLocationSyncMetadataBatch(entries = []) {
        if (!Array.isArray(entries) || entries.length === 0) return;
        this.db.exec('BEGIN IMMEDIATE');
        try {
            entries.forEach((entry) => {
                this.setLocationSyncMetadata(entry.realm, entry.id, entry.metadata);
            });
            this.db.exec('COMMIT');
        } catch (error) {
            this.db.exec('ROLLBACK');
            throw error;
        }
    }

    getAllMeta() {
        return this.listMetaValues.all().reduce((meta, row) => {
            try {
                meta[row.key] = JSON.parse(row.value);
            } catch (err) {
                meta[row.key] = row.value;
            }
            return meta;
        }, {});
    }

    recordAudit(entry) {
        if (!entry || !entry.changeCount) return;
        this.insertAudit.run(
            entry.timestamp || new Date().toISOString(),
            entry.route || 'unknown',
            Number(entry.changeCount) || 0,
            JSON.stringify(entry)
        );
    }

    readAudit(limit = 100) {
        const safeLimit = Math.max(1, Math.min(Number(limit) || 100, 1000));
        return this.selectAudit.all(safeLimit).map((row) => JSON.parse(row.entry_json));
    }

    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}

module.exports = { WorldStore, normalizeWorld };
