const Material = require('../models/Material');

const getMaterials = async (req, res) => {
  try {
    const { subject, examType, topic, search } = req.query;
    let query = { isPublished: true };

    if (subject) query.subject = subject;
    if (examType) query.examType = examType;
    if (topic) query.topic = topic;
    if (search) query.$text = { $search: search };

    const materials = await Material.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: materials.length, data: materials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    material.views += 1;
    await material.save();

    res.json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createMaterial = async (req, res) => {
  try {
    const { title, description, subject, examType, topic, subtopic, fileType, tags, isPublished } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const folder = req.file.mimetype === 'application/pdf' ? 'pdfs' : 'images';
    const fileUrl = `/uploads/${folder}/${req.file.filename}`;

    const material = await Material.create({
      title,
      description,
      subject,
      examType,
      topic,
      subtopic,
      fileType,
      fileUrl,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
      tags: tags || [],
      isPublished: isPublished || false
    });

    res.status(201).json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    const updatedMaterial = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updatedMaterial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    await material.deleteOne();
    res.json({ success: true, message: 'Material deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const incrementDownload = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    material.downloads += 1;
    await material.save();
    res.json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMaterials, getMaterialById, createMaterial, updateMaterial, deleteMaterial, incrementDownload };
