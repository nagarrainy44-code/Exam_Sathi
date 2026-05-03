const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, 'uploads/pdfs/');
    } else if (file.mimetype.startsWith('image/')) {
      cb(null, 'uploads/images/');
    } else {
      cb(new Error('Invalid file type'), null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and images (JPEG, PNG) are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = upload;
