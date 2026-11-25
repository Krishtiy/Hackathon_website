const redis = require('../config/redis');

const getOrSetCache = async (key, ttlSeconds, fetchFunction) => {
  try {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);

    const fresh = await fetchFunction();
    if (fresh) {
      await redis.set(key, JSON.stringify(fresh), 'EX', ttlSeconds);
    }
    return fresh;
  } catch (err) {
    console.error(`Cache degradation on ${key}:`, err.message);
    return fetchFunction();
  }
};

const invalidateCache = async (pattern) => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  } catch (err) {
    console.error(`Cache invalidation error on ${pattern}:`, err.message);
  }
};

module.exports = { getOrSetCache, invalidateCache };
