const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FILE_RE = /^[A-Za-z0-9._-]{1,100}$/;

function isUuid(value) {
    return UUID_RE.test(value);
}

function isFileName(value) {
    return FILE_RE.test(value);
}

function clampInt(value, fallback, min, max) {
    const parsed = Number.parseInt(String(value ?? ''), 10);
    if (!Number.isInteger(parsed)) return fallback;
    return Math.min(Math.max(parsed, min), max);
}

module.exports = { isUuid, isFileName, clampInt };
