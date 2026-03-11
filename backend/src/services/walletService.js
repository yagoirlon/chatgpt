const Wallet = require('../models/Wallet');

exports.ensureWallet = async (userId) => {
  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) wallet = await Wallet.create({ user: userId, balance: 0, history: [] });
  return wallet;
};

exports.creditWallet = async ({ userId, amount, type, meta = {} }) => {
  const wallet = await exports.ensureWallet(userId);
  wallet.balance += amount;
  wallet.history.unshift({ type, amount, meta });
  await wallet.save();
  return wallet;
};

exports.debitWallet = async ({ userId, amount, type, meta = {} }) => {
  const wallet = await exports.ensureWallet(userId);
  if (wallet.balance < amount) throw new Error('Insufficient balance');
  wallet.balance -= amount;
  wallet.history.unshift({ type, amount: -amount, meta });
  await wallet.save();
  return wallet;
};
