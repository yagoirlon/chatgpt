const router = require('express').Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const c = require('../controllers/walletController');

router.get('/balance', auth, c.balance);
router.get('/rewards', auth, c.rewards);
router.post('/withdraw', auth, [body('pixKey').isString(), body('coins').isInt({ min: 1000 })], validate, c.withdraw);

module.exports = router;
