const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['exam_alert', 'new_material', 'deadline', 'result', 'general'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  examName: { type: String },
  isRead: { type: Boolean, default: false },
  scheduledFor: { type: Date },
  sentAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
