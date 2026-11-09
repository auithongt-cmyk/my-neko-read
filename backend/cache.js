class TtlLruCache {
    constructor(maxSize) {
        this.maxSize = maxSize;
        this.map = new Map(); 
    }

    get(key) {
        const entry = this.map.get(key);
        if (!entry) return null;
        if (entry.expires < Date.now()) {
            this.map.delete(key);
            return null;
        }
        this.map.delete(key);      
        this.map.set(key, entry);
        return entry.data;
    }

    set(key, data, ttl) {
        this.map.delete(key);
        this.map.set(key, { data, expires: Date.now() + ttl });
        if (this.map.size > this.maxSize) {
            this.map.delete(this.map.keys().next().value); 
        }
    }

    get size() {
        return this.map.size;
    }
}

module.exports = TtlLruCache;
