const { creditWallet } = require('../services/walletService');
const { getConfig } = require('../services/rewardRulesService');

exports.claimAdReward = async (req, res) => {
  const cfg = await getConfig();
  const today = new Date().toISOString().split('T')[0];
  if (req.user.adViewsDate !== today) {
    req.user.adViewsToday = 0;
    req.user.adViewsDate = today;
  }
  if (req.user.adViewsToday >= cfg.maxAdsPerDay) return res.status(400).json({ message: 'Daily ad limit reached' });

  req.user.adViewsToday += 1;
  req.user.coins += cfg.adRewardPerView;
  req.user.coinsEarnedToday += cfg.adRewardPerView;
  await Promise.all([
    req.user.save(),
    creditWallet({ userId: req.user._id, amount: cfg.adRewardPerView, type: 'ads', meta: { source: 'ad_watch', adViewsToday: req.user.adViewsToday } })
  ]);

  res.json({ reward: cfg.adRewardPerView, adViewsToday: req.user.adViewsToday });
};

exports.config = async (_req, res) => {
  const cfg = await getConfig();
  res.json(cfg);
};
