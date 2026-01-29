const config = require('../config/env');

/**
 * Request logger middleware
 */
const logger = (req, res, next) => {
    if (config.env === 'development') {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${req.method} ${req.url}`);
    }
    next();
};

module.exports = logger;
