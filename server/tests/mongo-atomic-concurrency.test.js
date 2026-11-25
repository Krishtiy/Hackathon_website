require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Team = require('../src/models/Team');
const User = require('../src/models/User');

describe('LIVE ATLAS MONGO CONCURRENCY: Team Capacity Lock', () => {
  let leaderUser;
  let testTeam;
  let candidateUsers = [];

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clean up any test users
    await User.deleteMany({ email: /audit_concurrency_.*@test\.com/ });
    await Team.deleteMany({ name: /AuditConcurrencyTeam.*/ });

    // Create 1 leader
    leaderUser = await User.create({
      name: 'Audit Leader',
      email: `audit_concurrency_leader_${Date.now()}@test.com`,
      password: 'password123',
      college: 'Test College',
      phone: '9999999999'
    });

    // Create target team with 2 existing members (1 slot left out of 3)
    testTeam = await Team.create({
      name: `AuditConcurrencyTeam_${Date.now()}`,
      leader: leaderUser._id,
      members: [leaderUser._id]
    });

    // Add 2nd member
    const member2 = await User.create({
      name: 'Audit Member 2',
      email: `audit_concurrency_m2_${Date.now()}@test.com`,
      password: 'password123',
      college: 'Test College',
      phone: '9999999998',
      teamId: testTeam._id
    });
    testTeam.members.push(member2._id);
    await testTeam.save();

    // Create 4 candidate users competing for the single remaining 3rd slot
    for (let i = 0; i < 4; i++) {
      const u = await User.create({
        name: `Candidate ${i}`,
        email: `audit_concurrency_cand_${i}_${Date.now()}@test.com`,
        password: 'password123',
        college: 'Test College',
        phone: `999999990${i}`
      });
      candidateUsers.push(u);
    }
  }, 60000);

  afterAll(async () => {
    if (leaderUser) await User.deleteMany({ email: /audit_concurrency_.*@test\.com/ });
    if (testTeam) await Team.deleteMany({ name: /AuditConcurrencyTeam.*/ });
    await mongoose.disconnect();
  });

  it('SHOULD allow exactly 1 member to fill the 3rd slot and reject all 3 concurrent collisions', async () => {
    // Simulate 4 simultaneous requests to add a member using the atomic $expr controller logic
    const attemptAdd = async (candidate) => {
      const session = await mongoose.startSession();
      try {
        session.startTransaction();

        const updatedTeam = await Team.findOneAndUpdate(
          {
            _id: testTeam._id,
            leader: leaderUser._id,
            $expr: { $lt: [{ $size: '$members' }, 3] }
          },
          { $push: { members: candidate._id } },
          { new: true, session }
        );

        if (!updatedTeam) {
          await session.abortTransaction();
          return { success: false, reason: 'Team full' };
        }

        candidate.teamId = updatedTeam._id;
        await candidate.save({ session });
        await session.commitTransaction();
        return { success: true };
      } catch (err) {
        await session.abortTransaction();
        return { success: false, reason: err.message };
      } finally {
        session.endSession();
      }
    };

    // FIRE ALL 4 CALLS CONCURRENTLY AT THE EXACT SAME MILLISECOND
    const results = await Promise.all(candidateUsers.map(u => attemptAdd(u)));

    const successCount = results.filter(r => r.success).length;
    const rejectedCount = results.filter(r => !r.success).length;

    const finalTeam = await Team.findById(testTeam._id);

    // Mathematical consistency check
    expect(finalTeam.members.length).toBe(3); // STRICT LIMIT PRESERVED
    expect(successCount).toBe(1);             // EXACTLY 1 WON THE SLOT
    expect(rejectedCount).toBe(3);            // 3 SAFELY BLOCKED
  });
});
