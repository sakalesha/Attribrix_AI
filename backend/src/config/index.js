// Single Source of Truth for all application settings and environment variables

require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/attribrix_db',
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  storageBucket: process.env.STORAGE_BUCKET_NAME || 'product-image',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
  maxImageCount: parseInt(process.env.MAX_IMAGE_COUNT || '10', 10),
};

module.exports = config;
