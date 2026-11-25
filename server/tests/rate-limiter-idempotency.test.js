const slidingWindowLimiter = require('../src/middlewares/rateLimiter');
const idempotency = require('../src/middlewares/idempotency');
const redis = require('../src/config/redis');

describe('PHASE 1: Traffic Protection, Rate Limiter & Idempotency Key', () => {
  const userId = 'user_audit_99';

  beforeEach(async () => {
    const keys = await redis.keys('*user_audit_99*');
    if (keys.length > 0) await redis.del(...keys);
  });

  afterAll(async () => {
    const keys = await redis.keys('*user_audit_99*');
    if (keys.length > 0) await redis.del(...keys);
    await redis.quit();
  });

  it('SHOULD enforce sliding-window rate limit and return 429 when threshold exceeded', async () => {
    const limiter = slidingWindowLimiter({ limit: 3, windowSec: 5, keyPrefix: 'test-rl' });

    const createReqRes = () => {
      const req = {
        user: { _id: userId },
        baseUrl: '/api',
        path: '/quiz/submit',
        ip: '127.0.0.1'
      };
      const res = {
        statusCode: 200,
        headers: {},
        setHeader(name, value) { this.headers[name] = value; },
        status(code) { this.statusCode = code; return this; },
        json(payload) { this.body = payload; return this; }
      };
      return { req, res };
    };

    let nextCalledCount = 0;
    const next = () => { nextCalledCount++; };

    // Request 1, 2, 3: Should pass
    for (let i = 0; i < 3; i++) {
      const { req, res } = createReqRes();
      await limiter(req, res, next);
      expect(res.statusCode).toBe(200);
    }
    expect(nextCalledCount).toBe(3);

    // Request 4: Should be rate limited with HTTP 429
    const { req, res } = createReqRes();
    await limiter(req, res, next);
    expect(res.statusCode).toBe(429);
    expect(res.body.error).toBe('Too Many Requests');
    expect(res.headers['Retry-After']).toBe(5);
  });

  it('SHOULD cache response on Idempotency-Key and return identical body on replay', async () => {
    const idempMiddleware = idempotency(60);
    const idempotencyKey = `idemp-key-${Date.now()}`;

    const req1 = {
      user: { _id: userId },
      headers: { 'idempotency-key': idempotencyKey }
    };
    let jsonResult1;
    const res1 = {
      statusCode: 201,
      json(data) { jsonResult1 = data; return data; }
    };

    // First call: Passes to handler, handler responds with created resource
    await idempMiddleware(req1, res1, () => {});
    res1.json({ orderId: 'ord_123', status: 'CONFIRMED' });

    // Second call: Replay with same Idempotency-Key
    const req2 = {
      user: { _id: userId },
      headers: { 'idempotency-key': idempotencyKey }
    };
    let jsonResult2;
    let status2 = 200;
    const res2 = {
      status(code) { status2 = code; return this; },
      json(data) { jsonResult2 = data; return data; }
    };

    await idempMiddleware(req2, res2, () => {});

    // Proves duplicate was caught and returned cached response directly without re-execution
    expect(status2).toBe(201);
    expect(jsonResult2).toEqual({ orderId: 'ord_123', status: 'CONFIRMED' });
  });
});
