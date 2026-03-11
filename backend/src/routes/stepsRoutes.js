const router = require('express').Router();
const auth = require('../middleware/auth');
const { sync } = require('../controllers/stepsController');

router.post('/sync', auth, sync);
module.exports = router;
