const Referral = require('../models/Referral');

exports.getReferral = async (req, res) => {
  const referrals = await Referral.find({ inviterId: req.user._id }).populate('invitedId', 'name email avatar createdAt');
  res.json({
    code: req.user.referralCode,
    link: `https://stepreward.app/register?ref=${req.user.referralCode}`,
    referrals,
    rewardPerInvite: { inviter: 50, invitedSignupBonus: 1, condition: 'invited user must reach 3000 steps' }
  });
};
