const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');

const getQuestions = async (req, res) => {
  try {
    const { subject, topic, examType, difficulty, limit = 20 } = req.query;
    let query = {};

    if (subject) query.subject = subject;
    if (topic) query.topic = topic;
    if (examType) query.examType = examType;
    if (difficulty) query.difficulty = difficulty;

    const questions = await Question.find(query)
      .select('-__v')
      .limit(parseInt(limit))
      .sort({ _id: 'asc' });

    res.json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { subject, topic, answers } = req.body;

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;
    const processedAnswers = [];

    for (const answer of answers) {
      const question = await Question.findById(answer.questionId);
      if (!question) continue;

      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      
      if (answer.selectedAnswer === null || answer.selectedAnswer === undefined) {
        unanswered++;
      } else if (isCorrect) {
        correctAnswers++;
      } else {
        wrongAnswers++;
      }

      processedAnswers.push({
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect
      });
    }

    const totalQuestions = answers.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    const attempt = await QuizAttempt.create({
      userId: req.user._id,
      subject,
      topic,
      answers: processedAnswers,
      score,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      unanswered,
      timeTakenSeconds: req.body.timeTakenSeconds || 0,
      startedAt: req.body.startedAt ? new Date(req.body.startedAt) : new Date(),
      completedAt: new Date()
    });

    // Fetch question details for results
    const questionIds = processedAnswers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } }).select('question options correctAnswer explanation');

    const results = processedAnswers.map((ans, i) => ({
      question: questions.find(q => q._id.toString() === ans.questionId)?.question || '',
      options: questions.find(q => q._id.toString() === ans.questionId)?.options || [],
      correctAnswer: questions.find(q => q._id.toString() === ans.questionId)?.correctAnswer,
      explanation: questions.find(q => q._id.toString() === ans.questionId)?.explanation,
      selectedAnswer: ans.selectedAnswer,
      isCorrect: ans.isCorrect
    }));

    res.json({
      success: true,
      data: {
        score,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        unanswered,
        accuracy: correctAnswers + wrongAnswers > 0 ? Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100) : 0,
        attemptId: attempt._id,
        results
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAttemptHistory = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user._id })
      .sort({ completedAt: -1 })
      .limit(20)
      .select('-answers');

    res.json({ success: true, count: attempts.length, data: attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createQuestion = async (req, res) => {
  try {
    const { subject, topic, examType, question, options, correctAnswer, explanation, difficulty, year } = req.body;

    if (!subject) {
      return res.status(400).json({ success: false, message: 'Subject is required' });
    }
    if (!question) {
      return res.status(400).json({ success: false, message: 'Question text is required' });
    }
    if (!options || !Array.isArray(options) || options.filter(o => o && o.trim()).length < 2) {
      return res.status(400).json({ success: false, message: 'At least 2 non-empty options are required' });
    }

    const validOptions = options.map(o => String(o).trim()).filter(o => o);
    const ca = Number(correctAnswer);

    if (isNaN(ca) || ca < 0 || ca >= validOptions.length) {
      return res.status(400).json({ success: false, message: `correctAnswer must be between 0 and ${validOptions.length - 1}` });
    }

    const newQuestion = await Question.create({
      subject: subject || 'General',
      topic: topic || 'General',
      examType,
      question,
      options: validOptions,
      correctAnswer: ca,
      explanation,
      difficulty: difficulty || 'medium',
      year: year ? Number(year) : undefined
    });
    res.status(201).json({ success: true, data: newQuestion });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    res.json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    await question.deleteOne();
    res.json({ success: true, message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const bulkCreateQuestions = async (req, res) => {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'Questions array is required' });
    }
    const created = await Question.insertMany(questions, { runValidators: true });
    res.status(201).json({ success: true, count: created.length, data: created });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getQuestions, submitQuiz, getAttemptHistory, createQuestion, updateQuestion, deleteQuestion, bulkCreateQuestions };
