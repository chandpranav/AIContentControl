const config = require('../config/env');
const { AppError } = require('../utils/errors');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    // Log error in development
    if (config.env === 'development') {
        console.error('❌ Error:', err);
    } else {
        // In production, log less verbose
        console.error(`❌ ${err.code || 'ERROR'}: ${err.message}`);
    }

    // Handle known operational errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                ...(err.details && { details: err.details }),
            },
        });
    }

    // Handle Postgres errors
    if (err.code === '23505') {
        return res.status(409).json({
            success: false,
            error: {
                code: 'CONFLICT',
                message: 'Resource already exists',
            },
        });
    }

    // Handle JWT errors (shouldn't reach here if auth middleware is working)
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            error: {
                code: 'AUTHENTICATION_ERROR',
                message: err.message,
            },
        });
    }

    // Handle syntax errors in JSON body
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'INVALID_JSON',
                message: 'Invalid JSON in request body',
            },
        });
    }

    // Unknown errors - don't leak details in production
    const message = config.env === 'development'
        ? err.message
        : 'Internal server error';

    return res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message,
        },
    });
};

/**
 * 404 handler for unknown routes
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Route ${req.method} ${req.path} not found`,
        },
    });
};

module.exports = { errorHandler, notFoundHandler };
