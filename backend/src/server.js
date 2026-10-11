// It defines the server for the backend module. It handles HTTP requests and responses.

const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');

const server = app.listen(config.port, () => {
  logger.info(`Attribrix Backend running on port ${config.port} [${config.env}]`);
  logger.info(`ML Service configured at: ${config.mlServiceUrl}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

module.exports = server;
