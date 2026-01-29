const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { AuthenticationError } = require('../utils/errors');
const authService = require('../services/auth.service');

/**
 * Middleware to verify JWT token and attach user to request
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError('No token provided');
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, config.jwt.secret);

            // Don't allow refresh tokens to be used as access tokens
            if (decoded.type === 'refresh') {
                throw new AuthenticationError('Invalid token type');
            }

            // Attach user info to request
            req.userId = decoded.userId;

            // Optionally fetch full user (can be optimized with caching)
            // req.user = await authService.getUserById(decoded.userId);

            next();
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                throw new AuthenticationError('Token expired');
            }
            if (jwtError.name === 'JsonWebTokenError') {
                throw new AuthenticationError('Invalid token');
            }
            throw jwtError;
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Optional authentication - doesn't fail if no token, but attaches user if present
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];

            try {
                const decoded = jwt.verify(token, config.jwt.secret);
                if (decoded.type !== 'refresh') {
                    req.userId = decoded.userId;
                }
            } catch {
                // Token invalid, but that's okay for optional auth
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    authenticate,
    optionalAuth,
};
