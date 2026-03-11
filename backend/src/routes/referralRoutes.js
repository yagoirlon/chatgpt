const router = require('express').Router();
const auth = require('../middleware/auth');
const { getReferral } = require('../controllers/referralController');

router.get('/', auth, getReferral);
module.exports = router;
