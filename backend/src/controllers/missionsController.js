const Mission = require('../models/Mission');
const MissionCompletion = require('../models/MissionCompletion');
const Referral = require('../models/Referral');
const { creditWallet } = require('../services/walletService');

exports.list = async (_req, res) => res.json(await Mission.find({ active: true }).sort({ stepsRequired: 1 }));
exports.create = async (req, res) => res.status(201).json(await Mission.create(req.body));

exports.complete = async (req, res) => {
  const mission = await Mission.findById(req.body.missionId);
  if (!mission) return res.status(404).json({ message: 'Mission not found' });
  const date = new Date().toISOString().split('T')[0];

  const already = await MissionCompletion.findOne({ user: req.user._id, mission: mission._id, date });
  if (already) return res.status(409).json({ message: 'Already completed today' });

  if (mission.type === 'steps' && req.user.stepsToday < mission.stepsRequired) return res.status(400).json({ message: 'Not enough steps' });
  if (mission.type === 'invite') {
    const count = await Referral.countDocuments({ inviterId: req.user._id, status: 'completed' });
    if (count < 1) return res.status(400).json({ message: 'Invite at least one friend first' });
  }

  await MissionCompletion.create({ user: req.user._id, mission: mission._id, date });
  req.user.coins += mission.rewardCoins;
  await Promise.all([
    req.user.save(),
    creditWallet({ userId: req.user._id, amount: mission.rewardCoins, type: 'mission', referenceId: mission._id, meta: { missionId: mission._id, date } })
  ]);

  res.json({ message: 'Mission completed', reward: mission.rewardCoins });
};
