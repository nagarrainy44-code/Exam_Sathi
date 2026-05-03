const express = require('express');
const router = express.Router();
const { getQuestions, submitQuiz, getAttemptHistory, createQuestion, updateQuestion, deleteQuestion, bulkCreateQuestions } = require('../controllers/quizController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/questions', getQuestions);
router.post('/submit', protect, submitQuiz);
router.get('/history', protect, getAttemptHistory);

router.post('/questions', protect, admin, createQuestion);
router.put('/questions/:id', protect, admin, updateQuestion);
router.delete('/questions/:id', protect, admin, deleteQuestion);
router.post('/questions/bulk', protect, admin, bulkCreateQuestions);

module.exports = router;
