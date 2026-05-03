const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  subject: { type: String, required: true, index: true },
  topic: { type: String, required: true, default: 'General' },
  examType: { type: String, index: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true, min: 0 },
  explanation: { type: String },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  year: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
