const { Pool } = require('pg');
const config = require('./index');

let pool = null;

// Initializes and returns a singleton PostgreSQL connection pool with Neon SSL support.
function getPool() {
  if (!pool) {
    // Prevents local development connection crashes when using Neon without breaking plain local PostgreSQL fallback.
    const isNeonOrSsl =
      config.databaseUrl.includes('neon.tech') ||
      config.databaseUrl.includes('sslmode=require');
    const enableSsl = config.env === 'production' || isNeonOrSsl;

    pool = new Pool({
      connectionString: config.databaseUrl,
      ssl: enableSsl ? { rejectUnauthorized: false } : false,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle database client', err);
    });
  }
  return pool;
}

// Verifies database connectivity by executing a lightweight test query ('SELECT NOW()').
async function testConnection() {
  try {
    const client = await getPool().connect();
    const res = await client.query('SELECT NOW()');
    client.release();
    return { connected: true, timestamp: res.rows[0].now };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}

module.exports = {
  getPool,
  testConnection,
};
