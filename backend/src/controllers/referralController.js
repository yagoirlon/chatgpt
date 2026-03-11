const Referral = require('../models/Referral');

exports.getReferral = async (req, res) => {
  const referrals = await Referral.find({ referrer: req.user._id }).populate('referredUser', 'name email createdAt');
  res.json({ code: req.user.referralCode, referrals, rewardPerInvite: 10 });
};
