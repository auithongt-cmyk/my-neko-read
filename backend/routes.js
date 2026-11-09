const express = require('express');
const config = require('./config');
const stats = require('./stats');
const { isUuid, clampInt } = require('./validate');
const { mangadexUrl, addAllowedContentRatings, proxyMangaDex, apiCacheSize } = require('./mangadex');
const { coverHandler, coverCacheSize } = require('./coverProxy');
const {
    transformMangaList, transformRandom, transformGenres, transformStats,
} = require('./transform');

const router = express.Router();
const { TTL } = config;

router.get('/recommend', (req, res) => {
    const apiUrl = mangadexUrl('/manga');
    apiUrl.searchParams.set('limit', '60'); 
    apiUrl.searchParams.set('includes[]', 'cover_art');
    apiUrl.searchParams.set('order[rating]', 'desc');
    addAllowedContentRatings(apiUrl);
    proxyMangaDex(apiUrl, res, { ttl: TTL.list, transform: transformMangaList });
});

router.get('/popular', (req, res) => {
    const apiUrl = mangadexUrl('/manga');
    apiUrl.searchParams.set('limit', '20');
    apiUrl.searchParams.set('includes[]', 'cover_art');
    apiUrl.searchParams.set('order[followedCount]', 'desc');
    addAllowedContentRatings(apiUrl);
    proxyMangaDex(apiUrl, res, { ttl: TTL.list, transform: transformMangaList });
});

router.get('/random', (req, res) => {
    const apiUrl = mangadexUrl('/manga/random');
    apiUrl.searchParams.set('includes[]', 'cover_art');
    addAllowedContentRatings(apiUrl);
    proxyMangaDex(apiUrl, res, { ttl: 0, transform: transformRandom }); 
});

router.get('/search', (req, res) => {
    const limit = clampInt(req.query.limit, 100, 1, 100);
    const offset = clampInt(req.query.offset, 0, 0, config.MANGADEX_MAX_WINDOW - limit);
    const titleQuery = String(req.query.q || req.query.title || '').trim().slice(0, 100);
    const genreId = String(req.query.genre || '').trim();

    if (genreId && !isUuid(genreId)) {
        return res.status(400).json({ error: 'รหัสประเภทมังงะไม่ถูกต้อง' });
    }

    const apiUrl = mangadexUrl('/manga');
    apiUrl.searchParams.set('limit', String(limit));
    apiUrl.searchParams.set('offset', String(offset));
    apiUrl.searchParams.set('includes[]', 'cover_art');
    apiUrl.searchParams.set('order[relevance]', 'desc');
    addAllowedContentRatings(apiUrl);
    if (titleQuery) apiUrl.searchParams.set('title', titleQuery);
    if (genreId) apiUrl.searchParams.append('includedTags[]', genreId);

    proxyMangaDex(apiUrl, res, { ttl: TTL.search, transform: transformMangaList });
});

router.get('/genres', (req, res) => {
    proxyMangaDex(mangadexUrl('/manga/tag'), res, { ttl: TTL.genres, transform: transformGenres });
});

router.get('/rating/:mangaId', (req, res) => {
    const mangaId = String(req.params.mangaId || '').trim();
    if (!isUuid(mangaId)) {
        return res.status(400).json({ error: 'รหัสมังงะไม่ถูกต้อง' });
    }
    const apiUrl = mangadexUrl(`/statistics/manga/${encodeURIComponent(mangaId)}`);
    proxyMangaDex(apiUrl, res, { ttl: TTL.stats, transform: transformStats(mangaId) });
});

router.get('/cover/:mangaId/:fileName', coverHandler);

router.get('/cache-stats', (req, res) => {
    res.json({ ...stats, apiCacheSize: apiCacheSize(), coverCacheSize: coverCacheSize() });
});

module.exports = router;
