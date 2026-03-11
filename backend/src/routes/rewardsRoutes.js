const router = require('express').Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { rewards } = require('../controllers/walletController');
const c = require('../controllers/rewardsController');
const RewardConfig = require('../models/RewardConfig');

router.get('/', auth, rewards);
router.get('/config', auth, c.config);
router.post('/ads/claim', auth, c.claimAdReward);
router.patch('/config', auth, admin, [
  body('stepToCoinSteps').optional().isInt({ min: 1000 }),
  body('maxDailyStepsCounted').optional().isInt({ min: 5000 }),
  body('maxDailyCoinsFromSteps').optional().isFloat({ min: 0.1 }),
  body('adRewardPerView').optional().isFloat({ min: 0.1 }),
  body('maxAdsPerDay').optional().isInt({ min: 1, max: 20 }),
  body('referralRewardOnTarget').optional().isFloat({ min: 0.1 }),
  body('referralTargetSteps').optional().isInt({ min: 500 })
], validate, async (req, res) => {
  let cfg = await RewardConfig.findOne();
  if (!cfg) cfg = await RewardConfig.create({});
  Object.assign(cfg, req.body);
  await cfg.save();
  res.json(cfg);
});

module.exports = router;
