const redis = require('../src/config/redis');
const LeaderboardService = require('../src/services/leaderboardService');
const { getOrSetCache, invalidateCache } = require('../src/services/cacheService');

describe('PHASE 1 & 2: Redis Distributed Caching & Leaderboard Engine', () => {
  const testTeamA = 'team_alpha_101';
  const testTeamB = 'team_beta_102';

  beforeAll(async () => {
    // Ensure clean state for test keys
    await redis.del('hackathon:leaderboard:round1');
    await redis.del('test:cache:sample');
  });

  afterAll(async () => {
    await redis.del('hackathon:leaderboard:round1');
    await redis.del('test:cache:sample');
    await redis.quit();
  });

  it('SHOULD connect and respond to PING on Upstash Redis', async () => {
    const pong = await redis.ping();
    expect(pong).toBe('PONG');
  });

  it('SHOULD rank teams accurately with microsecond tie-breaking in ZSET', async () => {
    // Team A and Team B have equal points (85), but Team A finished in 500s while Team B took 1200s
    await LeaderboardService.updateScore(testTeamA, 85, 500);
    await LeaderboardService.updateScore(testTeamB, 85, 1200);

    const topTeams = await LeaderboardService.getTop(5);
    expect(topTeams.length).toBeGreaterThanOrEqual(2);

    // Team A must be ranked #1 because it submitted faster with identical points
    expect(topTeams[0].teamId).toBe(testTeamA);
    expect(topTeams[0].points).toBe(85);
    expect(topTeams[1].teamId).toBe(testTeamB);
    expect(topTeams[1].points).toBe(85);

    const rankA = await LeaderboardService.getTeamRank(testTeamA);
    const rankB = await LeaderboardService.getTeamRank(testTeamB);
    expect(rankA).toBe(1);
    expect(rankB).toBe(2);
  });

  it('SHOULD cache-aside data and serve from Redis memory on subsequent calls', async () => {
    let databaseHits = 0;
    const fetchFromDb = async () => {
      databaseHits++;
      return { hackathon: '2026', status: 'ACTIVE' };
    };

    // First call: Misses cache, hits database
    const res1 = await getOrSetCache('test:cache:sample', 60, fetchFromDb);
    expect(res1.status).toBe('ACTIVE');
    expect(databaseHits).toBe(1);

    // Second call: Hits Redis cache, does NOT increment databaseHits
    const res2 = await getOrSetCache('test:cache:sample', 60, fetchFromDb);
    expect(res2.status).toBe('ACTIVE');
    expect(databaseHits).toBe(1);

    // Invalidation check
    await invalidateCache('test:cache:*');
    const cachedAfterDelete = await redis.get('test:cache:sample');
    expect(cachedAfterDelete).toBeNull();
  });
});
