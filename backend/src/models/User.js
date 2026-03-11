const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    referralCode: { type: String, required: true, unique: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    coins: { type: Number, default: 0 },
    stepsToday: { type: Number, default: 0 },
    totalSteps: { type: Number, default: 0 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isBanned: { type: Boolean, default: false },
    isSuspicious: { type: Boolean, default: false },
    deviceId: String,
    deviceModel: String,
    deviceBrand: String,
    osVersion: String,
    deviceFingerprints: [{ type: String }],
    lastKnownIp: String,
    pushToken: String,
    streakCount: { type: Number, default: 0 },
    lastActiveDate: String,
    adViewsToday: { type: Number, default: 0 },
    adViewsDate: String,
    coinsEarnedToday: { type: Number, default: 0 },
    coinValueBRL: { type: Number, default: 0.01 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
