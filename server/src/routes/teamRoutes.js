const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const { createTeam, getTeamById, addMember, getMyTeam, getAllTeams, verifyTeamPayment, deleteTeam, getRound1Results, advanceTeamToFinale } = require('../controllers/teamController');

// Create team
router.post('/', protect, createTeam);

// Get your own team
router.get('/myteam', protect, getMyTeam);

// Get a specific team's details
router.get('/:id', protect, getTeamById);

// Add member to team
router.post('/:id/members', protect, addMember);

// --- ADMIN ROUTES ---

// Admin: Get all teams
// Use 'isAdmin' here
router.get('/', protect, admin, getAllTeams);

// Admin: Verify a team's payment
// And here
router.post('/:id/verify-payment', protect, admin, verifyTeamPayment);

// Admin: Delete a team
// And here
router.delete('/:id', protect, admin, deleteTeam);

router.get('/results/1', protect,getRound1Results);

router.post('/:id/advance', protect, admin, advanceTeamToFinale);

router.get('/:id', protect, getTeamById);

module.exports = router;