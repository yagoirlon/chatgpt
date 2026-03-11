const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimit');
const c = require('../controllers/authController');

router.post('/register', authLimiter, [
  body('name').isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('avatar').optional().isURL(),
  body('deviceId').optional().isString(),
  body('deviceModel').optional().isString(),
  body('deviceBrand').optional().isString(),
  body('osVersion').optional().isString()
], validate, c.register);
router.post('/login', authLimiter, [body('email').isEmail(), body('password').notEmpty()], validate, c.login);
router.post('/reset-password', authLimiter, [body('email').isEmail(), body('newPassword').isLength({ min: 6 })], validate, c.resetPassword);

module.exports = router;
