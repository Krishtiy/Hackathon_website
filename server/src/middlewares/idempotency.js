const redis = require('../config/redis');

const idempotency = (ttlSeconds = 300) => {
  return async (req, res, next) => {
    const idempotencyKey = req.headers['idempotency-key'];
    if (!idempotencyKey) return next();

    const lockKey = `idemp:${req.user?._id || 'anon'}:${idempotencyKey}`;

    try {
      const acquired = await redis.set(lockKey, JSON.stringify({ state: 'PENDING' }), 'EX', ttlSeconds, 'NX');

      if (!acquired) {
        const cached = await redis.get(lockKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.state === 'PENDING') {
            return res.status(409).json({ message: 'Request with this Idempotency-Key is currently in progress.' });
          }
          return res.status(parsed.statusCode).json(parsed.body);
        }
      }

      const originalJson = res.json.bind(res);
      res.json = (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redis.set(lockKey, JSON.stringify({ state: 'DONE', statusCode: res.statusCode, body }), 'EX', ttlSeconds);
        } else {
          redis.del(lockKey);
        }
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error('Idempotency bypass on error:', err.message);
      next();
    }
  };
};

module.exports = idempotency;
