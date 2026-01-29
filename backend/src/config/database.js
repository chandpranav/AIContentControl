const { Pool } = require('pg');
const config = require('./env');

// Create PostgreSQL connection pool
const pool = new Pool(
    config.database.url
        ? { connectionString: config.database.url }
        : {
            host: config.database.host,
            port: config.database.port,
            database: config.database.name,
            user: config.database.user,
            password: config.database.password,
        }
);

// Test connection on startup
pool.on('connect', () => {
    if (config.env === 'development') {
        console.log('✅ Connected to PostgreSQL database');
    }
});

pool.on('error', (err) => {
    console.error('❌ PostgreSQL connection error:', err.message);
});

// Graceful shutdown
const closePool = async () => {
    await pool.end();
    console.log('Database pool closed');
};

module.exports = { pool, closePool };
