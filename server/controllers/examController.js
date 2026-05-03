const Exam = require('../models/Exam');

const getExams = async (req, res) => {
  try {
    const { examType, isActive } = req.query;
    let query = {};

    if (examType) query.examType = examType;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const exams = await Exam.find(query).sort({ examDate: 1 });
    res.json({ success: true, count: exams.length, data: exams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    res.json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createExam = async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    res.json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    await exam.deleteOne();
    res.json({ success: true, message: 'Exam deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getExams, getExamById, createExam, updateExam, deleteExam };
