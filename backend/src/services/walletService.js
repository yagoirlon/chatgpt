const Wallet = require('../models/Wallet');
const Reward = require('../models/Reward');
const Transaction = require('../models/Transaction');

const mapType = (type) => {
  if (type === 'step') return 'steps';
  if (type === 'mission') return 'missions';
  if (type === 'referral') return 'referrals';
  if (type === 'ads') return 'ads';
  if (type === 'withdrawal') return 'withdrawals';
  return type;
};

exports.ensureWallet = async (userId) => {
  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) wallet = await Wallet.create({ user: userId, balance: 0, history: [] });
  return wallet;
};

exports.creditWallet = async ({ userId, amount, type, meta = {}, referenceId, steps = 0 }) => {
  const wallet = await exports.ensureWallet(userId);
  wallet.balance += amount;
  wallet.history.unshift({ type, amount, meta });
  await wallet.save();

  await Promise.all([
    Reward.create({ userId, source: type === 'ads' ? 'task' : type, steps, coinsEarned: amount, meta, referenceId }),
    Transaction.create({
      userId,
      type: mapType(type),
      flow: 'credit',
      amount,
      balanceAfter: wallet.balance,
      meta
    })
  ]);

  return wallet;
};

exports.debitWallet = async ({ userId, amount, type, meta = {} }) => {
  const wallet = await exports.ensureWallet(userId);
  if (wallet.balance < amount) throw new Error('Insufficient balance');
  wallet.balance -= amount;
  wallet.history.unshift({ type, amount: -amount, meta });
  await wallet.save();

  await Transaction.create({
    userId,
    type: mapType(type),
    flow: 'debit',
    amount,
    balanceAfter: wallet.balance,
    meta
  });

  return wallet;
};
