const express = require('express');
const router = express.Router();
const { getMaterials, getMaterialById, createMaterial, updateMaterial, deleteMaterial, incrementDownload } = require('../controllers/materialController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getMaterials);
router.get('/:id', getMaterialById);
router.post('/', protect, admin, upload.single('file'), createMaterial);
router.put('/:id', protect, admin, updateMaterial);
router.delete('/:id', protect, admin, deleteMaterial);
router.patch('/:id/download', incrementDownload);

module.exports = router;
