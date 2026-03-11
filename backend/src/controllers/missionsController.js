const Mission = require('../models/Mission');
const MissionCompletion = require('../models/MissionCompletion');
const { creditWallet } = require('../services/walletService');

exports.list = async (_req, res) => res.json(await Mission.find({ isActive: true }).sort({ targetSteps: 1 }));

exports.create = async (req, res) => res.status(201).json(await Mission.create(req.body));

exports.complete = async (req, res) => {
  const mission = await Mission.findById(req.body.missionId);
  if (!mission) return res.status(404).json({ message: 'Mission not found' });
  if (req.user.stepsToday < mission.targetSteps) return res.status(400).json({ message: 'Not enough steps' });

  const already = await MissionCompletion.findOne({ user: req.user._id, mission: mission._id });
  if (already) return res.status(409).json({ message: 'Already completed' });

  await MissionCompletion.create({ user: req.user._id, mission: mission._id });
  req.user.coins += mission.reward;
  await Promise.all([
    req.user.save(),
    creditWallet({ userId: req.user._id, amount: mission.reward, type: 'mission', meta: { missionId: mission._id } })
  ]);
  res.json({ message: 'Mission completed', reward: mission.reward });
};
