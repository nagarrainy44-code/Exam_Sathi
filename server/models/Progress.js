const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date },
  lastStudiedAt: { type: Date },
  timeSpentMinutes: { type: Number, default: 0 }
}, { timestamps: true });

progressSchema.index({ userId: 1, subject: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
