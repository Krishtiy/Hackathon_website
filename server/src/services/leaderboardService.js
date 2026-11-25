const redis = require('../config/redis');

const ZSET_KEY = 'hackathon:leaderboard:round1';

class LeaderboardService {
  /**
   * Score = Points + Tie-breaker (1 - (timeInSeconds / 10,000,000))
   */
  static async updateScore(teamId, points, secondsTaken) {
    const tieBreaker = 1 - Math.min(secondsTaken / 10000000, 0.999999);
    const compositeScore = points + tieBreaker;
    await redis.zadd(ZSET_KEY, compositeScore, teamId.toString());
  }

  static async getTop(limit = 10) {
    const raw = await redis.zrevrange(ZSET_KEY, 0, limit - 1, 'WITHSCORES');
    const result = [];
    for (let i = 0; i < raw.length; i += 2) {
      result.push({
        rank: (i / 2) + 1,
        teamId: raw[i],
        points: Math.floor(parseFloat(raw[i + 1]))
      });
    }
    return result;
  }

  static async getTeamRank(teamId) {
    const rank = await redis.zrevrank(ZSET_KEY, teamId.toString());
    return rank !== null ? rank + 1 : null;
  }
}

module.exports = LeaderboardService;
