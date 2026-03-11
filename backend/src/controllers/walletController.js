const Wallet = require('../models/Wallet');
const Withdrawal = require('../models/Withdrawal');
const Transaction = require('../models/Transaction');
const Reward = require('../models/Reward');
const { debitWallet, ensureWallet } = require('../services/walletService');
const { coinsToBRL } = require('../services/rewardRulesService');

exports.balance = async (req, res) => {
  const [wallet, transactions, rewards, withdrawals] = await Promise.all([
    ensureWallet(req.user._id),
    Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50),
    Reward.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50),
    Withdrawal.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20)
  ]);
  res.json({ ...wallet.toObject(), valueBRL: coinsToBRL(wallet.balance), rewards, transactions, withdrawals });
};

exports.rewards = async (req, res) => {
  const rewards = await Reward.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(100);
  res.json(rewards);
};

exports.withdraw = async (req, res) => {
  const { pixKey, coins } = req.body;
  if (coins < 1000) return res.status(400).json({ message: 'Minimum withdrawal is 1000 coins (R$10)' });
  const wallet = await Wallet.findOne({ user: req.user._id });
  if (!wallet || wallet.balance < coins) return res.status(400).json({ message: 'Insufficient coins' });

  await debitWallet({ userId: req.user._id, amount: coins, type: 'withdrawal', meta: { pixKey } });
  const request = await Withdrawal.create({ userId: req.user._id, coins, amountBRL: coinsToBRL(coins), pixKey, status: 'pending' });
  res.status(201).json(request);
};
