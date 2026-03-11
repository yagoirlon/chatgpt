const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/walletController');

router.get('/balance', auth, c.balance);
router.post('/withdraw', auth, c.withdraw);

module.exports = router;
