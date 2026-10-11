const { Pool } = require('pg');
const config = require('./index');

let pool = null;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: config.databaseUrl,
      ssl: config.env === 'production' ? { rejectUnauthorized: false } : false,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle database client', err);
    });
  }
  return pool;
}

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
