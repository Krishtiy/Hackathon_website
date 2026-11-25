const redis = require('../config/redis');

const slidingWindowLimiter = ({ limit = 20, windowSec = 60, keyPrefix = 'rl' } = {}) => {
  return async (req, res, next) => {
    try {
      const identifier = req.user?._id?.toString() || req.ip || 'anonymous';
      const key = `${keyPrefix}:${req.baseUrl + req.path}:${identifier}`;
      const now = Date.now();
      const clearBefore = now - (windowSec * 1000);

      const pipeline = redis.pipeline();
      pipeline.zremrangebyscore(key, 0, clearBefore);
      pipeline.zadd(key, now, `${now}-${Math.random()}`);
      pipeline.zcard(key);
      pipeline.expire(key, windowSec);

      const results = await pipeline.exec();
      const count = results[2][1];

      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - count));

      if (count > limit) {
        res.setHeader('Retry-After', windowSec);
        return res.status(429).json({
          error: 'Too Many Requests',
          message: `Rate limit of ${limit} req/${windowSec}s exceeded.`,
          retryAfter: windowSec
        });
      }
      next();
    } catch (err) {
      console.error('RateLimiter fail-open bypass:', err.message);
      next();
    }
  };
};

module.exports = slidingWindowLimiter;
