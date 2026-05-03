const express = require('express');
const router = express.Router();
const { getExams, getExamById, createExam, updateExam, deleteExam } = require('../controllers/examController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getExams);
router.get('/:id', getExamById);
router.post('/', protect, admin, createExam);
router.put('/:id', protect, admin, updateExam);
router.delete('/:id', protect, admin, deleteExam);

module.exports = router;
