const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const User = require('../models/User');
const Referral = require('../models/Referral');
const { signToken } = require('../utils/jwt');
const { creditWallet, ensureWallet } = require('../services/walletService');

exports.register = async (req, res) => {
  const { name, email, password, referralCode } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already in use' });

  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hash, referralCode: nanoid(6).toUpperCase() });
  await ensureWallet(user._id);

  if (referralCode) {
    const referrer = await User.findOne({ referralCode });
    if (referrer) {
      user.referredBy = referrer._id;
      await user.save();
      await Referral.create({ referrer: referrer._id, referredUser: user._id });
      await creditWallet({ userId: referrer._id, amount: 10, type: 'referral', meta: { invited: user._id } });
    }
  }

  const token = signToken(user);
  res.status(201).json({ token, user });
};

exports.login = async (req, res) => {
  const { email, password, pushToken } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  if (pushToken) user.pushToken = pushToken;
  await user.save();
  res.json({ token: signToken(user), user });
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  res.json({ message: 'Password updated' });
};
