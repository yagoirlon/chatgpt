const router = require('express').Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { profile, updateProfile } = require('../controllers/userController');

router.get('/profile', auth, profile);
router.patch('/profile', auth, [body('name').optional().isLength({ min: 2 }), body('avatar').optional().isURL()], validate, updateProfile);
module.exports = router;
