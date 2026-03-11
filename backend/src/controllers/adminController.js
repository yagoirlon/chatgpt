const User = require('../models/User');
const Mission = require('../models/Mission');
const Task = require('../models/Task');
const Withdrawal = require('../models/Withdrawal');
const Revenue = require('../models/Revenue');
const { simulatePixTransfer } = require('../services/pixService');

exports.users = async (_req, res) => res.json(await User.find().select('-password').sort({ createdAt: -1 }));
exports.missions = async (_req, res) => res.json(await Mission.find().sort({ createdAt: -1 }));
exports.tasks = async (_req, res) => res.json(await Task.find().sort({ createdAt: -1 }));
exports.withdrawals = async (_req, res) => res.json(await Withdrawal.find().populate('user', 'email name'));

exports.banUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.userId, { isBanned: true }, { new: true });
  res.json(user);
};

exports.approveWithdrawal = async (req, res) => {
  const request = await Withdrawal.findById(req.params.withdrawalId);
  if (!request) return res.status(404).json({ message: 'Not found' });

  if (request.method === 'PIX') {
    const tx = await simulatePixTransfer({ destination: request.destination, amountCoins: request.coins });
    request.pixTxId = tx.txId;
  }
  request.status = 'approved';
  await request.save();
  res.json(request);
};

exports.stats = async (_req, res) => {
  const [users, pendingWithdrawals, revenue] = await Promise.all([
    User.countDocuments(),
    Withdrawal.countDocuments({ status: 'pending' }),
    Revenue.aggregate([{ $group: { _id: null, total: { $sum: '$amountUSD' } } }])
  ]);
  res.json({ users, pendingWithdrawals, revenueUSD: revenue[0]?.total || 0 });
};
