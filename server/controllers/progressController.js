const Progress = require('../models/Progress');

const getProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user._id });
    
    const subjectProgress = {};
    let totalTopics = 0;
    let completedTopics = 0;

    progress.forEach(p => {
      if (!subjectProgress[p.subject]) {
        subjectProgress[p.subject] = { total: 0, completed: 0 };
      }
      subjectProgress[p.subject].total += 1;
      if (p.isCompleted) {
        subjectProgress[p.subject].completed += 1;
      }
      totalTopics += 1;
      if (p.isCompleted) {
        completedTopics += 1;
      }
    });

    Object.keys(subjectProgress).forEach(subject => {
      subjectProgress[subject].percentage = Math.round((subjectProgress[subject].completed / subjectProgress[subject].total) * 100);
    });

    res.json({
      success: true,
      data: {
        overall: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0,
        subjects: subjectProgress,
        details: progress
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleTopic = async (req, res) => {
  try {
    const { subject, topic } = req.body;

    let progress = await Progress.findOne({ userId: req.user._id, subject, topic });

    if (progress) {
      progress.isCompleted = !progress.isCompleted;
      progress.completedAt = progress.isCompleted ? new Date() : null;
      progress.lastStudiedAt = new Date();
    } else {
      progress = await Progress.create({
        userId: req.user._id,
        subject,
        topic,
        isCompleted: true,
        completedAt: new Date(),
        lastStudiedAt: new Date()
      });
    }

    await progress.save();
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markComplete = async (req, res) => {
  try {
    const { subject, topic } = req.body;

    let progress = await Progress.findOne({ userId: req.user._id, subject, topic });

    if (!progress) {
      progress = await Progress.create({
        userId: req.user._id,
        subject,
        topic,
        isCompleted: true,
        completedAt: new Date(),
        lastStudiedAt: new Date()
      });
    } else {
      progress.isCompleted = true;
      progress.completedAt = new Date();
      progress.lastStudiedAt = new Date();
      await progress.save();
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProgress, toggleTopic, markComplete };
