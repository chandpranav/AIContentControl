const express = require('express');
const router = express.Router();

const strategyController = require('../controllers/strategy.controller');
const { validate } = require('../middleware/validate.middleware');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const { strategyLimiter } = require('../middleware/rateLimiter.middleware');
const { generateStrategySchema } = require('../validators/strategy.validator');

// Generate strategy - optional auth (saves to history if authenticated)
router.post(
    '/',
    strategyLimiter,
    optionalAuth,
    validate(generateStrategySchema),
    strategyController.generateStrategy
);

// Get user's strategies (requires auth)
router.get(
    '/',
    authenticate,
    strategyController.getStrategies
);

// Get specific strategy (requires auth)
router.get(
    '/:id',
    authenticate,
    strategyController.getStrategy
);

// Delete strategy (requires auth)
router.delete(
    '/:id',
    authenticate,
    strategyController.deleteStrategy
);

module.exports = router;
