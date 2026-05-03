const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  topic: { type: String },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedAnswer: { type: Number },
    isCorrect: { type: Boolean }
  }],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  wrongAnswers: { type: Number, required: true },
  unanswered: { type: Number, default: 0 },
  timeTakenSeconds: { type: Number },
  startedAt: { type: Date },
  completedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
