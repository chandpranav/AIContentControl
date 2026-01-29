const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const strategyRoutes = require('./strategy.routes');

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
        },
    });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/strategies', strategyRoutes);

module.exports = router;
