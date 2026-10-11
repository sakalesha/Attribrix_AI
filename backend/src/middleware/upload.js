// Acts as a file upload middleware for the backend service, using Multer to handle multipart/form-data file uploads with custom storage, size limits, and file type validation.

const multer = require('multer');
const path = require('path');
// Provides methods for interacting with the file system, such as creating directories and checking if they exist.
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

// Ensure upload directory exists
if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

// Configures how files are stored: destination directory and unique filenames.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb is a callback function that is used to determine the destination directory and filename.
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeFilename = `${uuidv4()}${ext}`;
    cb(null, safeFilename);
  },
});

// Validates incoming file types and rejects unsupported ones early.
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: JPEG, PNG, WEBP`), false);
  }
};

// Configures Multer instance with storage, limits, and file filter.
const upload = multer({
  storage,
  limits: {
    fileSize: config.maxFileSizeMb * 1024 * 1024,
    files: config.maxImageCount,
  },
  fileFilter,
});

module.exports = upload;
