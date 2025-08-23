// DataCache.js
// Caché local simple en memoria para datos

export default class DataCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, val) {
    this.cache.set(key, { val, ts: Date.now() });
  }

  get(key, maxAge = 1000 * 60 * 5) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() - item.ts > maxAge) {
      this.cache.delete(key);
      return null;
    }
    return item.val;
  }
}
