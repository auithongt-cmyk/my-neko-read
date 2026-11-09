const https = require('https');
const config = require('./config');
const stats = require('./stats');
const TtlLruCache = require('./cache');
const { isUuid, isFileName } = require('./validate');

const { CACHE_MAX, RETRIES, CONCURRENCY } = config.COVER;

const coverCache = new TtlLruCache(CACHE_MAX);
const coverInflight = new Map(); 
const coverAgent = new https.Agent({ keepAlive: true, maxSockets: CONCURRENCY });

let coverActive = 0;
const coverQueue = [];

function withCoverSlot(task) {
    return new Promise((resolve, reject) => {
        const run = () => {
            coverActive++;
            task().then(resolve, reject).finally(() => {
                coverActive--;
                const next = coverQueue.shift(); 
                if (next) next();
            });
        };
        if (coverActive < CONCURRENCY) run();
        else coverQueue.push(run);           
    });
}

function fetchCoverOnce(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(
            url,
            { agent: coverAgent, headers: { 'User-Agent': config.USER_AGENT }, timeout: config.REQUEST_TIMEOUT },
            (apiRes) => {
                if (apiRes.statusCode !== 200) {
                    apiRes.resume();
                    const error = new Error(`status ${apiRes.statusCode}`);
                    error.statusCode = apiRes.statusCode;
                    return reject(error);
                }
                const chunks = [];
                apiRes.on('data', (chunk) => chunks.push(chunk));
                apiRes.on('end', () => resolve(Buffer.concat(chunks)));
                apiRes.on('error', reject);
            }
        );
        req.on('timeout', () => req.destroy(new Error('timeout')));
        req.on('error', reject);
    });
}

async function fetchCoverWithRetry(url) {
    let lastError;
    for (let attempt = 0; attempt <= RETRIES; attempt++) {
        try {
            return await withCoverSlot(() => fetchCoverOnce(url));
        } catch (error) {
            lastError = error;
            const clientError = error.statusCode && error.statusCode < 500 && error.statusCode !== 429;
            if (clientError) break; 
            await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
        }
    }
    throw lastError;
}

async function coverHandler(req, res) {
    const { mangaId, fileName } = req.params;
    if (!isUuid(mangaId) || !isFileName(fileName)) {
        return res.status(400).send('พารามิเตอร์ของรูปปกไม่ถูกต้อง');
    }

    const key = `${mangaId}/${fileName}`;
    const coverUrl = `https://uploads.mangadex.org/covers/${encodeURIComponent(mangaId)}/${encodeURIComponent(fileName)}.256.jpg`;

    const sendImage = (buffer, cacheStatus) => {
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('X-Cache', cacheStatus);
        res.send(buffer);
    };

    const cached = coverCache.get(key);
    if (cached) {
        stats.coverHit++;
        return sendImage(cached, 'HIT');
    }

    stats.coverMiss++;
    try {
        if (!coverInflight.has(key)) {
            coverInflight.set(key, fetchCoverWithRetry(coverUrl).finally(() => coverInflight.delete(key)));
        }
        const buffer = await coverInflight.get(key);
        coverCache.set(key, buffer, config.TTL.cover);
        sendImage(buffer, 'MISS');
    } catch (error) {
        res.status(error.statusCode || 502).send('ไม่พบรูปภาพปก');
    }
}

module.exports = { coverHandler, coverCacheSize: () => coverCache.size };
