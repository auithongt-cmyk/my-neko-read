const MINUTE = 60 * 1000;

module.exports = {
    PORT: 3000,
    MANGADEX_API: 'https://api.mangadex.org',
    USER_AGENT: 'NEKOread/1.0',
    REQUEST_TIMEOUT: 10000,         
    MANGADEX_MAX_WINDOW: 10000,     

    TTL: {
        list: 10 * MINUTE,          
        search: 5 * MINUTE,
        stats: 5 * MINUTE,
        genres: 24 * 60 * MINUTE,   
        cover: 24 * 60 * MINUTE,
    },
    API_CACHE_MAX: 200,             

    COVER: {
        CACHE_MAX: 300,             
        RETRIES: 2,                 
        CONCURRENCY: 6,             
    },
};
