const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { normalizeWorld } = require('./world-store');

const SHEET_TITLE = 'Locations';
const META_KEY = 'google_sheets_location_sync_state';
const STATUS_META_KEY = 'google_sheets_sync_status';
const HEADER = [
    'realm',
    'id',
    'name',
    'type',
    'x',
    'y',
    'region',
    'description',
    'cityMap',
    'link',
    'biome',
    'disposition',
    'details',
    'cityScene',
    'tooltipImage',
    'fontFamily',
    'fontSize',
    'fontWeight',
    'fontStyle',
    'markerSize',
    'markerOffsetX',
    'markerOffsetY',
    'labelOffsetX',
    'labelOffsetY',
    'labelAlign',
    'rotation',
    'opacity',
    'textCurve',
    'hideLabel',
    'deleted',
    'lastUpdatedAt',
    'lastUpdatedSource',
    'syncRevision',
    'dbHash',
    'syncStatus',
    'syncMessage'
];

const DISPLAY_FIELDS = [
    'fontFamily',
    'fontSize',
    'fontWeight',
    'fontStyle',
    'markerSize',
    'markerOffsetX',
    'markerOffsetY',
    'labelOffsetX',
    'labelOffsetY',
    'rotation',
    'opacity',
    'textCurve',
    'labelAlign',
    'hideLabel'
];

const DIRECT_DETAIL_FIELDS = [
    'biome',
    'disposition',
    'details',
    'cityScene',
    'tooltipImage'
];

const DIRECT_NUMBER_FIELDS = new Set([
    'x',
    'y',
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

const DIRECT_BOOLEAN_FIELDS = new Set([
    'hideLabel'
]);

function nowIso() {
    return new Date().toISOString();
}

function stableStringify(value) {
    if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
    if (value && typeof value === 'object') {
        return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
    }
    return JSON.stringify(value);
}

function hashValue(value) {
    return crypto.createHash('sha256').update(stableStringify(value)).digest('hex');
}

function getConfig() {
    const spreadsheetId = process.env.MYRDAE_GOOGLE_SHEET_ID || process.env.GOOGLE_SHEET_ID || '';
    const serviceAccountFile = process.env.MYRDAE_GOOGLE_SERVICE_ACCOUNT_FILE || process.env.GOOGLE_APPLICATION_CREDENTIALS || '';
    const apiKey = process.env.MYRDAE_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY || '';
    let clientEmail = process.env.MYRDAE_GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL || '';
    let privateKey = process.env.MYRDAE_GOOGLE_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY || '';

    if ((!clientEmail || !privateKey) && serviceAccountFile && fs.existsSync(serviceAccountFile)) {
        const credentials = JSON.parse(fs.readFileSync(serviceAccountFile, 'utf8'));
        clientEmail = clientEmail || credentials.client_email || '';
        privateKey = privateKey || credentials.private_key || '';
    }

    return {
        spreadsheetId,
        apiKey,
        clientEmail,
        privateKey: privateKey ? privateKey.replace(/\\n/g, '\n') : '',
        syncTimes: parseSyncTimes(process.env.MYRDAE_SHEETS_SYNC_TIMES || '06:00,18:00'),
        treatMissingRowsAsDeletes: /^(1|true|yes|on)$/i.test(process.env.MYRDAE_SHEETS_TREAT_MISSING_ROWS_AS_DELETES || '')
    };
}

function parseSyncTimes(value) {
    const times = String(value || '')
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => {
            const match = /^(\d{1,2}):(\d{2})$/.exec(part);
            if (!match) return null;
            const hour = Number(match[1]);
            const minute = Number(match[2]);
            if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
            return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        })
        .filter(Boolean);
    return Array.from(new Set(times)).sort();
}

function isConfigured(config = getConfig()) {
    return Boolean(config.spreadsheetId && config.clientEmail && config.privateKey);
}

function getConfigurationStatus(config = getConfig()) {
    const missing = [];
    if (!config.spreadsheetId) missing.push('MYRDAE_GOOGLE_SHEET_ID');
    if (!config.clientEmail || !config.privateKey) {
        missing.push('service account credentials');
    }
    return {
        configured: isConfigured(config),
        spreadsheetIdPresent: Boolean(config.spreadsheetId),
        apiKeyPresent: Boolean(config.apiKey),
        writeCredentialsPresent: Boolean(config.clientEmail && config.privateKey),
        missing,
        message: missing.length
            ? `Google Sheets sync needs ${missing.join(' and ')}. An API key alone cannot write Sheets data.`
            : 'Google Sheets sync is configured.'
    };
}

function base64Url(input) {
    return Buffer.from(input).toString('base64url');
}

async function getAccessToken(config = getConfig()) {
    if (!isConfigured(config)) {
        throw new Error('Google Sheets sync is not configured. Set MYRDAE_GOOGLE_SHEET_ID and service account credentials.');
    }

    const issuedAt = Math.floor(Date.now() / 1000);
    const assertion = [
        base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' })),
        base64Url(JSON.stringify({
            iss: config.clientEmail,
            scope: 'https://www.googleapis.com/auth/spreadsheets',
            aud: 'https://oauth2.googleapis.com/token',
            exp: issuedAt + 3600,
            iat: issuedAt
        }))
    ].join('.');
    const signature = crypto.createSign('RSA-SHA256').update(assertion).sign(config.privateKey, 'base64url');

    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: `${assertion}.${signature}`
        })
    });
    const payload = await response.json();
    if (!response.ok) {
        throw new Error(payload.error_description || payload.error || `Google token request failed: HTTP ${response.status}`);
    }
    return payload.access_token;
}

async function sheetsRequest(config, method, endpoint, body = null) {
    const token = await getAccessToken(config);
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}${endpoint}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
    });
    const text = await response.text();
    const payload = text ? JSON.parse(text) : {};
    if (!response.ok) {
        throw new Error(payload.error && payload.error.message ? payload.error.message : `Google Sheets request failed: HTTP ${response.status}`);
    }
    return payload;
}

async function ensureLocationsSheet(config) {
    const metadata = await sheetsRequest(config, 'GET', '?fields=sheets(properties(sheetId,title,gridProperties(rowCount,columnCount)))');
    const existing = (metadata.sheets || []).find((sheet) => sheet.properties && sheet.properties.title === SHEET_TITLE);
    if (existing) return existing.properties.sheetId;

    const result = await sheetsRequest(config, 'POST', ':batchUpdate', {
        requests: [{
            addSheet: {
                properties: {
                    title: SHEET_TITLE,
                    gridProperties: { rowCount: 1000, columnCount: HEADER.length }
                }
            }
        }]
    });
    const reply = result.replies && result.replies[0] && result.replies[0].addSheet;
    return reply && reply.properties ? reply.properties.sheetId : null;
}

function getRealmLocations(world) {
    return [
        ...((world.locations || []).map((location) => ({ realm: 'surface', location }))),
        ...(((world.underdark && world.underdark.locations) || []).map((location) => ({ realm: 'underdark', location })))
    ];
}

function columnName(index) {
    let column = '';
    let value = index + 1;
    while (value > 0) {
        const remainder = (value - 1) % 26;
        column = String.fromCharCode(65 + remainder) + column;
        value = Math.floor((value - 1) / 26);
    }
    return column;
}

function parseOptionalNumber(value, field, issues) {
    if (value === '' || value == null) return undefined;
    const number = Number(value);
    if (!Number.isFinite(number)) {
        issues.push(`${field} must be a number`);
        return undefined;
    }
    return number;
}

function parseOptionalBoolean(value, field, issues) {
    if (value === '' || value == null) return undefined;
    const text = String(value).trim().toLowerCase();
    if (['1', 'true', 'yes', 'y', 'on'].includes(text)) return true;
    if (['0', 'false', 'no', 'n', 'off'].includes(text)) return false;
    issues.push(`${field} must be TRUE or FALSE`);
    return undefined;
}

function compactObject(object) {
    const next = {};
    Object.keys(object || {}).forEach((key) => {
        const value = object[key];
        if (value === '' || value === undefined || value === null) return;
        next[key] = value;
    });
    return next;
}

function normalizeLocationForHash(location) {
    // Compact so DB rows (which carry null/empty optional fields) hash the same
    // as sheet rows (which omit empty cells entirely).
    const copy = compactObject({ ...location });
    if (!copy.disposition || String(copy.disposition).toLowerCase() === 'neutral') {
        delete copy.disposition;
    }
    delete copy.updatedAt;
    delete copy.updatedSource;
    delete copy.syncRevision;
    delete copy.createdAt;
    delete copy.created_at;
    delete copy.updated_at;
    delete copy.external_sheet_id;
    delete copy.sheet_row_id;
    delete copy.last_synced_at;
    delete copy.last_modified_at;
    delete copy.lastModifiedAt;
    delete copy.modified_source;
    delete copy.sync_status;
    delete copy.deleted_at;
    return copy;
}

function makeRecordKey(realm, id) {
    return `${realm}:${id}`;
}

function locationToRow(realm, location, status = 'OK', message = '') {
    return [
        realm,
        location.id || '',
        location.name || '',
        location.type || '',
        location.x == null ? '' : location.x,
        location.y == null ? '' : location.y,
        location.region || '',
        location.description || '',
        location.cityMap || '',
        location.link || '',
        location.biome || '',
        location.disposition || 'neutral',
        location.details || '',
        location.cityScene || '',
        location.tooltipImage || '',
        location.fontFamily || '',
        location.fontSize == null ? '' : location.fontSize,
        location.fontWeight || '',
        location.fontStyle || '',
        location.markerSize == null ? '' : location.markerSize,
        location.markerOffsetX == null ? '' : location.markerOffsetX,
        location.markerOffsetY == null ? '' : location.markerOffsetY,
        location.labelOffsetX == null ? '' : location.labelOffsetX,
        location.labelOffsetY == null ? '' : location.labelOffsetY,
        location.labelAlign || '',
        location.rotation == null ? '' : location.rotation,
        location.opacity == null ? '' : location.opacity,
        location.textCurve == null ? '' : location.textCurve,
        location.hideLabel == null ? '' : Boolean(location.hideLabel),
        '',
        location.updatedAt || '',
        location.updatedSource || '',
        location.syncRevision == null ? '' : location.syncRevision,
        hashValue(normalizeLocationForHash(location)),
        status,
        message
    ];
}

function rowToObject(row) {
    const object = {};
    HEADER.forEach((key, index) => {
        object[key] = row[index] == null ? '' : row[index];
    });
    return object;
}

function rowToObjectWithHeaders(headerRow, row) {
    const object = {};
    HEADER.forEach((key) => {
        object[key] = '';
    });
    const seen = new Set();
    (headerRow || []).forEach((heading, index) => {
        const key = String(heading || '').trim();
        if (!key) return;
        seen.add(key);
        object[key] = row[index] == null ? '' : row[index];
    });
    if (!seen.size) return rowToObject(row);
    return object;
}

function parseSheetLocation(rowObject, rowNumber, seenKeys) {
    const issues = [];
    const realm = String(rowObject.realm || 'surface').trim().toLowerCase();
    const id = String(rowObject.id || '').trim();
    const name = String(rowObject.name || '').trim();
    const type = String(rowObject.type || '').trim();
    const xText = String(rowObject.x ?? '').trim();
    const yText = String(rowObject.y ?? '').trim();
    const x = xText === '' ? Number.NaN : Number(xText);
    const y = yText === '' ? Number.NaN : Number(yText);
    const disposition = String(rowObject.disposition || 'neutral').trim().toLowerCase();
    const deleted = /^(1|true|yes|y|delete|deleted)$/i.test(String(rowObject.deleted || '').trim());
    const key = makeRecordKey(realm, id);

    if (!['surface', 'underdark'].includes(realm)) issues.push('realm must be surface or underdark');
    if (!id) issues.push('id is required');
    if (id && !/^[a-z0-9][a-z0-9-]*$/i.test(id)) issues.push('id may contain only letters, numbers, and hyphens');
    if (!deleted && !name) issues.push('name is required');
    if (!deleted && !type) issues.push('type is required');
    if (!deleted && (!Number.isFinite(x) || x < 0 || x > 100)) issues.push('x must be a number from 0 to 100');
    if (!deleted && (!Number.isFinite(y) || y < 0 || y > 100)) issues.push('y must be a number from 0 to 100');
    if (!deleted && !['hostile', 'neutral', 'friendly'].includes(disposition)) {
        issues.push('disposition must be hostile, neutral, or friendly');
    }
    if (id && seenKeys.has(key)) issues.push(`duplicate location key ${key}`);
    if (id) seenKeys.add(key);

    const details = {};
    const display = {};
    DIRECT_DETAIL_FIELDS.forEach((field) => {
        if (rowObject[field] !== '') details[field] = rowObject[field];
        else delete details[field];
    });
    DISPLAY_FIELDS.forEach((field) => {
        if (DIRECT_NUMBER_FIELDS.has(field)) {
            const parsed = parseOptionalNumber(rowObject[field], field, issues);
            if (parsed !== undefined) display[field] = parsed;
            else if (rowObject[field] === '') delete display[field];
            return;
        }
        if (DIRECT_BOOLEAN_FIELDS.has(field)) {
            const parsed = parseOptionalBoolean(rowObject[field], field, issues);
            if (parsed !== undefined) display[field] = parsed;
            else if (rowObject[field] === '') delete display[field];
            return;
        }
        if (rowObject[field] !== '') display[field] = rowObject[field];
        else delete display[field];
    });
    const syncRevision = Number(rowObject.syncRevision);
    const location = {
        ...compactObject(details),
        ...compactObject(display),
        id,
        name,
        type,
        x,
        y,
        region: rowObject.region || '',
        description: rowObject.description || '',
        cityMap: rowObject.cityMap || '',
        link: rowObject.link || '',
        disposition,
        updatedAt: rowObject.lastUpdatedAt || nowIso(),
        updatedSource: rowObject.lastUpdatedSource || 'google-sheet',
        syncRevision: Number.isFinite(syncRevision) ? syncRevision : 0
    };

    Object.keys(location).forEach((field) => {
        if (location[field] === '') delete location[field];
    });
    location.id = id;
    location.name = name;
    location.type = type;
    location.x = x;
    location.y = y;
    if (rowObject.region !== '') location.region = rowObject.region;
    if (rowObject.description !== '') location.description = rowObject.description;
    if (rowObject.cityMap !== '') location.cityMap = rowObject.cityMap;
    if (rowObject.link !== '') location.link = rowObject.link;

    return { rowNumber, realm, id, key, location, deleted, dbHash: rowObject.dbHash || '', issues };
}

async function readSheetRows(config) {
    await ensureLocationsSheet(config);
    const lastColumn = columnName(HEADER.length - 1);
    const payload = await sheetsRequest(config, 'GET', `/values/${encodeURIComponent(`${SHEET_TITLE}!A1:${lastColumn}5000`)}`);
    const values = payload.values || [];
    if (!values.length) return [];
    const headerRow = values[0] || [];
    return values.slice(1).map((row, index) => parseSheetLocation(rowToObjectWithHeaders(headerRow, row), index + 2, new Set()));
}

async function writeRows(config, rows) {
    await ensureLocationsSheet(config);
    const lastColumn = columnName(HEADER.length - 1);
    const clearLastColumn = columnName(Math.max(HEADER.length - 1, 51));
    await sheetsRequest(config, 'POST', `/values/${encodeURIComponent(`${SHEET_TITLE}!A:${clearLastColumn}`)}:clear`, {});
    await sheetsRequest(config, 'PUT', `/values/${encodeURIComponent(`${SHEET_TITLE}!A1`)}?valueInputOption=USER_ENTERED`, {
        range: `${SHEET_TITLE}!A1`,
        majorDimension: 'ROWS',
        values: [HEADER, ...rows]
    });
}

function getSyncState(store) {
    const state = store.getMeta(META_KEY, {});
    return state && typeof state === 'object' ? state : {};
}

function setSyncState(store, state) {
    store.setMetaValue(META_KEY, state);
}

function logSync(dataRoot, entry) {
    const logPath = path.join(dataRoot, '.runtime', 'sheets-sync-log.jsonl');
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, JSON.stringify({ timestamp: nowIso(), ...entry }) + '\n', 'utf8');
}

function updateStatus(store, dataRoot, status) {
    const next = {
        timestamp: nowIso(),
        configured: isConfigured(),
        ...status
    };
    store.setMetaValue(STATUS_META_KEY, next);
    logSync(dataRoot, next);
    return next;
}

function recordSyncFailure(store, dataRoot, status) {
    return updateStatus(store, dataRoot, {
        ok: false,
        ...status,
        error: status && status.error ? status.error : 'Google Sheets sync failed.'
    });
}

function buildExportRows(world) {
    return getRealmLocations(world).map(({ realm, location }) => {
        const validation = validateLocation(location, realm);
        return locationToRow(realm, location, validation.length ? 'INVALID' : 'OK', validation.join('; '));
    });
}

function validateLocation(location, realm) {
    const issues = [];
    if (!['surface', 'underdark'].includes(realm)) issues.push('realm must be surface or underdark');
    if (!location.id) issues.push('id is required');
    if (!location.name || !String(location.name).trim()) issues.push('name is required');
    if (!location.type || !String(location.type).trim()) issues.push('type is required');
    if (typeof location.x !== 'number' || location.x < 0 || location.x > 100) issues.push('x must be a number from 0 to 100');
    if (typeof location.y !== 'number' || location.y < 0 || location.y > 100) issues.push('y must be a number from 0 to 100');
    return issues;
}

function buildDbEntryMap(world) {
    return new Map(getRealmLocations(world).map(({ realm, location }) => [
        makeRecordKey(realm, location.id),
        { realm, location }
    ]));
}

function findUnsyncedSheetChanges(sheetRows, dbEntries) {
    const changes = [];
    (sheetRows || []).forEach((row) => {
        if (!row || !row.id) return;
        if (row.issues.length) {
            changes.push({
                rowNumber: row.rowNumber,
                key: row.key,
                reason: row.issues.join('; ')
            });
            return;
        }
        const dbEntry = dbEntries.get(row.key);
        const sheetHash = hashValue(normalizeLocationForHash(row.location));
        const dbHash = dbEntry ? hashValue(normalizeLocationForHash(dbEntry.location)) : '';
        const sheetChanged = !dbEntry || row.dbHash !== sheetHash;
        const sheetMatchesDatabase = dbEntry && sheetHash === dbHash;
        if (sheetChanged && !sheetMatchesDatabase) {
            changes.push({
                rowNumber: row.rowNumber,
                key: row.key,
                reason: dbEntry
                    ? 'Sheet row differs from its dbHash and current database.'
                    : 'Sheet row is new and not in the database.'
            });
        }
    });
    return changes;
}

function replaceRealmLocations(world, realm, locations) {
    if (realm === 'surface') {
        world.locations = locations;
    } else {
        world.underdark = world.underdark || { mapImage: 'images/myrdae-map-layers/underdark-map.webp', locations: [], roads: [] };
        world.underdark.locations = locations;
    }
}

function stampLocation(location, source) {
    const timestamp = nowIso();
    return {
        ...location,
        updatedAt: timestamp,
        updatedSource: source,
        last_modified_at: timestamp,
        modified_source: source,
        sync_status: 'pending',
        syncRevision: Number(location.syncRevision || 0) + 1
    };
}

function buildLocationSyncMetadata(config, realmEntries, status, syncedAt = nowIso()) {
    return realmEntries.map(({ realm, location }, index) => ({
        realm,
        id: location.id,
        metadata: {
            external_sheet_id: config.spreadsheetId,
            sheet_row_id: index + 2,
            last_synced_at: syncedAt,
            sync_status: status,
            updated_at: location.updatedAt || location.last_modified_at || syncedAt
        }
    }));
}

async function exportLocationsToSheet(store, dataRoot, source = 'manual-export') {
    const config = getConfig();
    if (!isConfigured(config)) {
        return updateStatus(store, dataRoot, {
            ok: false,
            action: source,
            error: 'Google Sheets sync is not configured.'
        });
    }

    const world = normalizeWorld(store.readWorld());
    const realmEntries = getRealmLocations(world);
    const sheetRows = await readSheetRows(config);
    const unsyncedSheetChanges = findUnsyncedSheetChanges(sheetRows, buildDbEntryMap(world));
    if (unsyncedSheetChanges.length) {
        return updateStatus(store, dataRoot, {
            ok: false,
            action: source,
            error: `Export blocked: ${unsyncedSheetChanges.length} unsynced Sheet row(s) would be overwritten. Run Sync Sheet first.`,
            unsyncedSheetRows: unsyncedSheetChanges.slice(0, 25)
        });
    }
    const rows = buildExportRows(world);
    await writeRows(config, rows);
    const syncedAt = nowIso();
    if (typeof store.setLocationSyncMetadataBatch === 'function') {
        store.setLocationSyncMetadataBatch(buildLocationSyncMetadata(config, realmEntries, 'exported', syncedAt));
    }

    const syncState = {};
    realmEntries.forEach(({ realm, location }) => {
        syncState[makeRecordKey(realm, location.id)] = {
            recordHash: hashValue(normalizeLocationForHash(location)),
            syncedAt
        };
    });
    setSyncState(store, syncState);
    return updateStatus(store, dataRoot, {
        ok: true,
        action: source,
        exportedRows: rows.length,
        invalidRows: rows.filter((row) => row[HEADER.indexOf('syncStatus')] === 'INVALID').length
    });
}

async function syncLocationsWithSheet(store, dataRoot, source = 'scheduled-sync') {
    const config = getConfig();
    if (!isConfigured(config)) {
        return updateStatus(store, dataRoot, { ok: false, action: source, error: 'Google Sheets sync is not configured.' });
    }

    const syncState = getSyncState(store);
    const world = normalizeWorld(store.readWorld());
    const dbEntries = buildDbEntryMap(world);
    const sheetRows = await readSheetRows(config);
    const seenKeys = new Set();
    const parsedRows = [];
    const rowStatuses = new Map();
    let importCount = 0;
    let deleteCount = 0;
    let conflictCount = 0;
    let invalidCount = 0;
    const rejectedRows = [];

    sheetRows.forEach((row) => {
        const duplicateIssues = [];
        if (row.id && seenKeys.has(row.key)) duplicateIssues.push(`duplicate location key ${row.key}`);
        if (row.id) seenKeys.add(row.key);
        row.issues.push(...duplicateIssues);
        parsedRows.push(row);
    });

    const nextByRealm = {
        surface: [...(world.locations || [])],
        underdark: [...((world.underdark && world.underdark.locations) || [])]
    };

    function upsertLocation(realm, nextLocation) {
        const list = nextByRealm[realm];
        const index = list.findIndex((item) => item.id === nextLocation.id);
        if (index === -1) list.push(nextLocation);
        else list[index] = nextLocation;
    }

    function removeLocation(realm, id) {
        const list = nextByRealm[realm];
        const index = list.findIndex((item) => item.id === id);
        if (index !== -1) list.splice(index, 1);
    }

    parsedRows.forEach((row) => {
        if (row.issues.length) {
            invalidCount += 1;
            const message = row.issues.join('; ');
            rowStatuses.set(row.key || `row:${row.rowNumber}`, { status: 'INVALID', message });
            const rejected = locationToRow(row.realm || 'surface', row.location || { id: row.id }, 'INVALID', message);
            rejected[HEADER.indexOf('deleted')] = row.deleted ? 'TRUE' : '';
            rejectedRows.push(rejected);
            return;
        }

        const dbEntry = dbEntries.get(row.key);
        const stateEntry = syncState[row.key];
        const dbHash = dbEntry ? hashValue(normalizeLocationForHash(dbEntry.location)) : '';
        const sheetHash = hashValue(normalizeLocationForHash(row.location));

        if (!dbEntry && stateEntry) {
            if (row.dbHash === sheetHash) {
                deleteCount += 1;
                rowStatuses.set(row.key, { status: 'DELETED', message: 'Deleted from database by map editor.' });
                return;
            }
            conflictCount += 1;
            rowStatuses.set(row.key, { status: 'CONFLICT', message: 'Location was deleted in the map editor and changed in the sheet.' });
            const rejected = locationToRow(row.realm, row.location, 'CONFLICT', 'Location was deleted in the map editor and changed in the sheet.');
            rejectedRows.push(rejected);
            return;
        }

        const dbChanged = Boolean(dbEntry && stateEntry && stateEntry.recordHash && stateEntry.recordHash !== dbHash);
        const sheetChanged = !dbEntry || row.dbHash !== sheetHash;
        const contentMatches = Boolean(dbEntry && sheetHash === dbHash);

        // If the sheet and database contents are identical, any hash mismatch is
        // stale bookkeeping (e.g. hash format drift), not a real edit. Mark OK and
        // let the rewrite below refresh the stored hashes.
        if (contentMatches && !row.deleted) {
            rowStatuses.set(row.key, { status: 'OK', message: '' });
            return;
        }

        if (dbChanged && sheetChanged) {
            conflictCount += 1;
            rowStatuses.set(row.key, { status: 'CONFLICT', message: 'DB and sheet both changed since last sync. Keeping database value.' });
            return;
        }

        if (row.deleted) {
            if (!dbChanged) {
                removeLocation(row.realm, row.id);
                deleteCount += 1;
                rowStatuses.set(row.key, { status: 'DELETED', message: 'Deleted from database.' });
            } else {
                conflictCount += 1;
                rowStatuses.set(row.key, { status: 'CONFLICT', message: 'Sheet requested deletion, but DB changed since last sync.' });
            }
            return;
        }

        if (sheetChanged && !dbChanged) {
            upsertLocation(row.realm, stampLocation(row.location, 'google-sheet'));
            importCount += 1;
            rowStatuses.set(row.key, { status: 'IMPORTED', message: 'Imported into database.' });
            return;
        }

        rowStatuses.set(row.key, { status: 'OK', message: '' });
    });

    if (config.treatMissingRowsAsDeletes) {
        dbEntries.forEach((entry, key) => {
            if (!seenKeys.has(key)) {
                removeLocation(entry.realm, entry.location.id);
                deleteCount += 1;
            }
        });
    }

    replaceRealmLocations(world, 'surface', nextByRealm.surface);
    replaceRealmLocations(world, 'underdark', nextByRealm.underdark);
    if (importCount || deleteCount) {
        store.writeWorld(world, { source: 'google-sheet-sync' });
        store.setMetaValue('last_sheet_database_write_at', nowIso());
    }

    if (conflictCount || invalidCount) {
        return updateStatus(store, dataRoot, {
            ok: false,
            action: source,
            importedRows: importCount,
            deletedRows: deleteCount,
            conflictRows: conflictCount,
            invalidRows: invalidCount,
            exportedRows: 0,
            error: `Sync stopped before rewriting the Sheet because ${conflictCount} conflict row(s) and ${invalidCount} invalid row(s) need review.`
        });
    }

    const freshWorld = normalizeWorld(store.readWorld());
    const freshEntries = getRealmLocations(freshWorld);
    const rows = freshEntries.map(({ realm, location }) => {
        const status = rowStatuses.get(makeRecordKey(realm, location.id)) || {};
        const validation = validateLocation(location, realm);
        return locationToRow(realm, location, validation.length ? 'INVALID' : (status.status || 'OK'), validation.join('; ') || status.message || '');
    }).concat(rejectedRows);
    await writeRows(config, rows);
    const syncedAt = nowIso();
    if (typeof store.setLocationSyncMetadataBatch === 'function') {
        store.setLocationSyncMetadataBatch(buildLocationSyncMetadata(config, freshEntries, 'ok', syncedAt));
    }

    const nextState = {};
    freshEntries.forEach(({ realm, location }) => {
        nextState[makeRecordKey(realm, location.id)] = {
            recordHash: hashValue(normalizeLocationForHash(location)),
            syncedAt
        };
    });
    setSyncState(store, nextState);

    return updateStatus(store, dataRoot, {
        ok: true,
        action: source,
        importedRows: importCount,
        deletedRows: deleteCount,
        conflictRows: conflictCount,
        invalidRows: invalidCount,
        exportedRows: rows.length
    });
}

function getStatus(store) {
    const configStatus = getConfigurationStatus();
    return store.getMeta(STATUS_META_KEY, {
        configured: configStatus.configured,
        ok: null,
        message: configStatus.configured ? 'Google Sheets sync has not run yet.' : configStatus.message,
        configuration: configStatus
    });
}

module.exports = {
    SHEET_TITLE,
    HEADER,
    META_KEY,
    STATUS_META_KEY,
    getConfig,
    isConfigured,
    getConfigurationStatus,
    recordSyncFailure,
    exportLocationsToSheet,
    syncLocationsWithSheet,
    getStatus,
    hashValue,
    normalizeLocationForHash,
    findUnsyncedSheetChanges,
    locationToRow,
    rowToObjectWithHeaders,
    parseSheetLocation,
    stampLocation
};
