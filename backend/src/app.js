const express = require('express');
const cors = require('cors');
const path = require('path');

const config = require('./config/env');
const logger = require('./middleware/logger.middleware');
const { apiLimiter } = require('./middleware/rateLimiter.middleware');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler.middleware');
const routes = require('./routes');

// Create Express app
const app = express();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// CORS configuration
app.use(cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logging
app.use(logger);

// Rate limiting for all API routes
app.use('/api', apiLimiter);

// API routes (v1)
app.use('/api/v1', routes);

// Legacy route support (for backward compatibility with existing frontend)
// Maps old routes to new structure
app.post('/api/get-strategy', (req, res, next) => {
    req.url = '/api/v1/strategies';
    app._router.handle(req, res, next);
});

app.post('/api/auth/signup', (req, res, next) => {
    req.url = '/api/v1/auth/signup';
    app._router.handle(req, res, next);
});

app.post('/api/auth/signin', (req, res, next) => {
    req.url = '/api/v1/auth/signin';
    app._router.handle(req, res, next);
});

app.put('/api/auth/change-password', (req, res, next) => {
    // Transform body to match new schema (userId from token, not body)
    req.url = '/api/v1/auth/password';
    app._router.handle(req, res, next);
});

// Serve static files in production
if (config.env === 'production') {
    app.use(express.static(path.join(__dirname, '../../public')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../public', 'index.html'));
    });
}

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;
