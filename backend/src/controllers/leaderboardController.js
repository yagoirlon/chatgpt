const Step = require('../models/Step');
const Referral = require('../models/Referral');

exports.weekly = async (_req, res) => {
  const start = new Date();
  start.setDate(start.getDate() - 7);
  const startDate = start.toISOString().split('T')[0];

  const topSteps = await Step.aggregate([
    { $match: { date: { $gte: startDate } } },
    { $group: { _id: '$userId', steps: { $sum: '$stepCount' } } },
    { $sort: { steps: -1 } },
    { $limit: 20 },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { _id: 0, userId: '$user._id', name: '$user.name', avatar: '$user.avatar', steps: 1 } }
  ]);

  const topReferrals = await Referral.aggregate([
    { $match: { createdAt: { $gte: start } } },
    { $group: { _id: '$inviterId', referrals: { $sum: 1 } } },
    { $sort: { referrals: -1 } },
    { $limit: 20 },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { _id: 0, userId: '$user._id', name: '$user.name', avatar: '$user.avatar', referrals: 1 } }
  ]);

  res.json({ topSteps, topReferrals });
};
