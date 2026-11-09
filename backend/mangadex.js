const https = require('https');
const config = require('./config');
const stats = require('./stats');
const TtlLruCache = require('./cache');

const apiCache = new TtlLruCache(config.API_CACHE_MAX);
const apiInflight = new Map(); 

function mangadexUrl(pathname) {
    return new URL(`${config.MANGADEX_API}${pathname}`);
}

function addAllowedContentRatings(apiUrl) {
    apiUrl.searchParams.append('contentRating[]', 'safe');
    apiUrl.searchParams.append('contentRating[]', 'suggestive');
}

function requestJson(apiUrl) {
    return new Promise((resolve, reject) => {
        const req = https.get(
            apiUrl,
            {
                headers: { 'User-Agent': config.USER_AGENT, Accept: 'application/json' },
                timeout: config.REQUEST_TIMEOUT,
            },
            (apiRes) => {
                if (apiRes.statusCode !== 200) {
                    apiRes.resume();
                    const error = new Error(`MangaDex ตอบกลับด้วยสถานะ ${apiRes.statusCode || 'ไม่ทราบสาเหตุ'}`);
                    error.statusCode = apiRes.statusCode || 502;
                    return reject(error);
                }
                let raw = '';
                apiRes.setEncoding('utf8');
                apiRes.on('data', (chunk) => { raw += chunk; });
                apiRes.on('end', () => {
                    try {
                        resolve(JSON.parse(raw));
                    } catch (parseError) {
                        const error = new Error('ข้อมูลจาก MangaDex ไม่ถูกต้อง');
                        error.statusCode = 502;
                        reject(error);
                    }
                });
            }
        );
        req.on('timeout', () => {
            const error = new Error('MangaDex ตอบกลับช้าเกินไป');
            error.statusCode = 504;
            req.destroy(error);
        });
        req.on('error', reject);
    });
}

async function getJson(apiUrl, { ttl = 0, transform = null } = {}) {
    const key = apiUrl.href;

    if (ttl > 0) {
        const hit = apiCache.get(key);
        if (hit) {
            stats.apiHit++;
            return { data: hit, cache: 'HIT' };
        }
    }
    stats.apiMiss++;

    const load = () => requestJson(apiUrl).then((raw) => (transform ? transform(raw) : raw));
    let data;
    if (ttl > 0) {
        if (!apiInflight.has(key)) {
            apiInflight.set(key, load().finally(() => apiInflight.delete(key)));
        }
        data = await apiInflight.get(key);
        apiCache.set(key, data, ttl);
    } else {
        data = await load();
    }
    return { data, cache: 'MISS' };
}

async function proxyMangaDex(apiUrl, res, options) {
    try {
        const { data, cache } = await getJson(apiUrl, options);
        res.setHeader('X-Cache', cache);
        res.json(data);
    } catch (error) {
        const status = error.statusCode || 502;
        res.status(status).json({ error: error.statusCode ? error.message : 'เชื่อมต่อ MangaDex ไม่สำเร็จ' });
    }
}

module.exports = {
    mangadexUrl,
    addAllowedContentRatings,
    proxyMangaDex,
    apiCacheSize: () => apiCache.size,
};
