const rateLimit = require('express-rate-limit');
const config = require('../config/env');

/**
 * General API rate limiter
 * 100 requests per 15 minutes
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => config.env === 'test', // Skip in tests
});

/**
 * Strict rate limiter for auth endpoints
 * 10 requests per 15 minutes
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many authentication attempts, please try again later',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => config.env === 'test',
});

/**
 * Strategy generation rate limiter
 * 20 requests per hour (AI API costs money!)
 */
const strategyLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Strategy generation limit reached. Please try again in an hour.',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => config.env === 'test',
});

module.exports = { apiLimiter, authLimiter, strategyLimiter };
