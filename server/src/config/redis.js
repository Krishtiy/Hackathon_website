require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const Redis = require('ioredis');

// Clean connection URL by trimming any accidental outer quotes or whitespace
const rawUrl = (process.env.REDIS_URL || 'redis://localhost:6379').replace(/^["']|["']$/g, '').trim();

// BullMQ and Redis standard connection requires maxRetriesPerRequest: null
const redis = new Redis(rawUrl, {
  maxRetriesPerRequest: null,
  retryStrategy(times) {
    return Math.min(times * 100, 3000);
  },
  enableReadyCheck: true,
  lazyConnect: false
});

redis.on('connect', () => console.log('⚡ Connected to Upstash Redis'));
redis.on('error', (err) => console.error('⚠️ Redis Client Warning:', err.message));

module.exports = redis;
