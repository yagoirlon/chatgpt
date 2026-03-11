const Task = require('../models/Task');
const TaskCompletion = require('../models/TaskCompletion');
const Revenue = require('../models/Revenue');
const { creditWallet } = require('../services/walletService');

exports.list = async (_req, res) => res.json(await Task.find({ isActive: true }));
exports.create = async (req, res) => res.status(201).json(await Task.create(req.body));

exports.complete = async (req, res) => {
  const task = await Task.findById(req.body.taskId);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const existing = await TaskCompletion.findOne({ user: req.user._id, task: task._id });
  if (existing) return res.status(409).json({ message: 'Task already completed' });

  await TaskCompletion.create({ user: req.user._id, task: task._id });
  req.user.coins += task.reward;
  await Promise.all([
    req.user.save(),
    creditWallet({ userId: req.user._id, amount: task.reward, type: 'task', meta: { taskId: task._id } }),
    Revenue.create({ user: req.user._id, source: task.type === 'ad' ? 'admob' : 'offerwall', amountUSD: task.reward * 0.02 })
  ]);

  res.json({ message: 'Task completed', reward: task.reward });
};
