const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    reward: Number,
    type: { type: String, enum: ['ad', 'install', 'link', 'survey'] },
    url: String,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
