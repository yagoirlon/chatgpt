const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const User = require('../models/User');
const Referral = require('../models/Referral');
const { signToken } = require('../utils/jwt');
const { creditWallet, ensureWallet } = require('../services/walletService');
const { validateRegistrationRisk } = require('../services/antiFraudService');

exports.register = async (req, res) => {
  const { name, email, password, referralCode, avatar, deviceId, deviceModel, deviceBrand, osVersion } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already in use' });

  const risk = await validateRegistrationRisk({ deviceId, ip: req.ip });
  if (risk.blocked) return res.status(403).json({ message: risk.reason });

  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hash,
    avatar: avatar || '',
    referralCode: nanoid(6).toUpperCase(),
    deviceId,
    deviceModel,
    deviceBrand,
    osVersion,
    lastKnownIp: req.ip
  });
  await ensureWallet(user._id);

  if (referralCode) {
    const inviter = await User.findOne({ referralCode });
    if (inviter) {
      user.referredBy = inviter._id;
      await user.save();
      await Referral.create({ inviterId: inviter._id, invitedId: user._id, reward: 50, status: 'pending' });
      await creditWallet({ userId: user._id, amount: 1, type: 'referral', meta: { invitedBy: inviter._id, signupBonus: true } });
      user.coins += 1;
      await user.save();
    }
  }

  res.status(201).json({ token: signToken(user), user });
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
