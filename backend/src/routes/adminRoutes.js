const router = require('express').Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const c = require('../controllers/adminController');

router.use(auth, admin);
router.get('/users', c.users);
router.get('/users/suspicious', c.suspiciousUsers);
router.get('/missions', c.missions);
router.get('/tasks', c.tasks);
router.get('/withdrawals', c.withdrawals);
router.get('/stats', c.stats);
router.post('/missions', c.createMission);
router.post('/tasks', c.createTask);
router.post('/rewards/adjust', c.adjustRewards);
router.patch('/users/:userId/ban', c.banUser);
router.patch('/withdrawals/:withdrawalId/approve', c.approveWithdrawal);
router.patch('/withdrawals/:withdrawalId/reject', c.rejectWithdrawal);
router.patch('/withdrawals/:withdrawalId/paid', c.markWithdrawalPaid);

module.exports = router;
