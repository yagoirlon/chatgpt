const router = require('express').Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validate = require('../middleware/validate');
const c = require('../controllers/missionsController');

router.get('/', auth, c.list);
router.post('/', auth, admin, [body('title').isString(), body('stepsRequired').isInt({ min: 0 }), body('rewardCoins').isInt({ min: 0 })], validate, c.create);
router.post('/complete', auth, [body('missionId').isString()], validate, c.complete);

module.exports = router;
