const router = require('express').Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const c = require('../controllers/adminController');

router.use(auth, admin);
router.get('/users', c.users);
router.get('/missions', c.missions);
router.get('/tasks', c.tasks);
router.get('/withdrawals', c.withdrawals);
router.get('/stats', c.stats);
router.patch('/users/:userId/ban', c.banUser);
router.patch('/withdrawals/:withdrawalId/approve', c.approveWithdrawal);

module.exports = router;
