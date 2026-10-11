const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const { testConnection } = require('./config/db');
const mlClient = require('./integrations/mlClient');
const errorHandler = require('./middleware/errorHandler');

const productRoutes = require('./modules/products/product.routes');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');

const app = express();

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files in dev
app.use('/uploads', express.static(path.resolve(config.uploadDir)));

// Health check endpoint
const handleHealth = async (req, res) => {
  const dbStatus = await testConnection();
  const mlStatus = await mlClient.checkHealth();

  res.status(200).json({
    status: 'ok',
    service: 'attribrix-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: config.env,
    dependencies: {
      database: dbStatus.connected ? 'connected' : 'disconnected (pending local/neon connection)',
      ml_service: mlStatus.ok ? 'connected' : 'disconnected',
    },
  });
};

app.get('/health', handleHealth);
app.get('/api/v1/health', handleHealth);

// API Modules
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Attribrix AI Backend API',
    docs: '/api/v1/health',
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
