const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    referralCode: { type: String, required: true, unique: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    coins: { type: Number, default: 0 },
    stepsToday: { type: Number, default: 0 },
    totalSteps: { type: Number, default: 0 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isBanned: { type: Boolean, default: false },
    deviceFingerprints: [{ type: String }],
    lastKnownIp: String,
    pushToken: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
