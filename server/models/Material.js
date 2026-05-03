const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  subject: { type: String, required: true, index: true },
  examType: { type: String, required: true, index: true },
  topic: { type: String, trim: true },
  subtopic: { type: String, trim: true },
  fileType: { type: String, enum: ['pdf', 'image', 'link'], required: true },
  fileUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  fileSize: { type: Number },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  downloads: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
