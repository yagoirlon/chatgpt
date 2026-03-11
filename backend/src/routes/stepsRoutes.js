const router = require('express').Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { sync, today } = require('../controllers/stepsController');

router.get('/today', auth, today);
router.post('/sync', auth, [
  body('stepsToday').isInt({ min: 0, max: 100000 }),
  body('deviceFingerprint').optional().isString(),
  body('isEmulator').optional().isBoolean(),
  body('fakeStepAppDetected').optional().isBoolean(),
  body('stepsInLastHour').optional().isInt({ min: 0 })
], validate, sync);
module.exports = router;
