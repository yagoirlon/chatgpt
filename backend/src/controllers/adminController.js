const User = require('../models/User');
const Mission = require('../models/Mission');
const Task = require('../models/Task');
const Withdrawal = require('../models/Withdrawal');
const Revenue = require('../models/Revenue');
const { simulatePixTransfer } = require('../services/pixService');
const { creditWallet } = require('../services/walletService');

exports.users = async (_req, res) => res.json(await User.find().select('-password').sort({ createdAt: -1 }));
exports.missions = async (_req, res) => res.json(await Mission.find().sort({ createdAt: -1 }));
exports.tasks = async (_req, res) => res.json(await Task.find().sort({ createdAt: -1 }));
exports.suspiciousUsers = async (_req, res) => res.json(await User.find({ isSuspicious: true }).select('-password').sort({ updatedAt: -1 }));
exports.withdrawals = async (_req, res) => res.json(await Withdrawal.find().populate('userId', 'email name coins'));
exports.createMission = async (req, res) => res.status(201).json(await Mission.create(req.body));
exports.createTask = async (req, res) => res.status(201).json(await Task.create(req.body));

exports.banUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.userId, { isBanned: true }, { new: true });
  res.json(user);
};

exports.adjustRewards = async (req, res) => {
  const { userId, coins, reason } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await creditWallet({ userId: user._id, amount: Number(coins), type: 'manual', meta: { reason } });
  user.coins += Number(coins);
  await user.save();
  res.json({ ok: true, user });
};

exports.approveWithdrawal = async (req, res) => {
  const request = await Withdrawal.findById(req.params.withdrawalId);
  if (!request) return res.status(404).json({ message: 'Not found' });
  const tx = await simulatePixTransfer({ destination: request.pixKey, amountCoins: request.coins });
  request.status = 'approved';
  request.pixTxId = tx.txId;
  await request.save();
  res.json(request);
};

exports.rejectWithdrawal = async (req, res) => {
  const request = await Withdrawal.findByIdAndUpdate(req.params.withdrawalId, { status: 'rejected' }, { new: true });
  if (!request) return res.status(404).json({ message: 'Not found' });
  res.json(request);
};

exports.markWithdrawalPaid = async (req, res) => {
  const request = await Withdrawal.findByIdAndUpdate(req.params.withdrawalId, { status: 'paid' }, { new: true });
  if (!request) return res.status(404).json({ message: 'Not found' });
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
