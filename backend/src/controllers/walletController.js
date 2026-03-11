const Wallet = require('../models/Wallet');
const Withdrawal = require('../models/Withdrawal');
const { debitWallet, ensureWallet } = require('../services/walletService');

exports.balance = async (req, res) => res.json(await ensureWallet(req.user._id));

exports.withdraw = async (req, res) => {
  const { method, destination, coins } = req.body;
  if (coins < 100) return res.status(400).json({ message: 'Minimum withdrawal is 100 coins' });
  const wallet = await Wallet.findOne({ user: req.user._id });
  if (!wallet || wallet.balance < coins) return res.status(400).json({ message: 'Insufficient coins' });

  await debitWallet({ userId: req.user._id, amount: coins, type: 'withdrawal', meta: { method, destination } });
  const request = await Withdrawal.create({ user: req.user._id, method, destination, coins });
  res.status(201).json(request);
};
