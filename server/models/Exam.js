const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  examName: { type: String, required: true, index: true },
  examType: { type: String, required: true, index: true },
  notificationDate: { type: Date },
  applicationStart: { type: Date },
  applicationEnd: { type: Date },
  examDate: { type: Date, required: true },
  resultDate: { type: Date },
  eligibility: { type: String },
  ageLimit: { type: String },
  vacancies: { type: Number },
  officialLink: { type: String },
  description: { type: String },
  syllabusUrl: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
