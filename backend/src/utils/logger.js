// Acts as a centralized logger for the backend service, providing consistent log formatting and environment-aware debug output.

const logger = {
  info: (msg, meta) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, meta ? meta : ''),
  warn: (msg, meta) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, meta ? meta : ''),
  error: (msg, meta) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, meta ? meta : ''),
  debug: (msg, meta) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${msg}`, meta ? meta : '');
    }
  },
};

module.exports = logger;
