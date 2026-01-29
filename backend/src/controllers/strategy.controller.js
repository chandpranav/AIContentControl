const strategyService = require('../services/strategy.service');

/**
 * Generate a new strategy
 */
const generateStrategy = async (req, res, next) => {
    try {
        const { platform, userInterest, targetInterest } = req.body;

        const result = await strategyService.generateStrategy(
            req.userId, // May be undefined if not authenticated
            platform,
            userInterest,
            targetInterest
        );

        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get user's strategy history
 */
const getStrategies = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = parseInt(req.query.offset, 10) || 0;

        const result = await strategyService.getUserStrategies(
            req.userId,
            limit,
            offset
        );

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get a specific strategy
 */
const getStrategy = async (req, res, next) => {
    try {
        const strategyId = parseInt(req.params.id, 10);
        const result = await strategyService.getStrategyById(req.userId, strategyId);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a strategy
 */
const deleteStrategy = async (req, res, next) => {
    try {
        const strategyId = parseInt(req.params.id, 10);
        const result = await strategyService.deleteStrategy(req.userId, strategyId);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    generateStrategy,
    getStrategies,
    getStrategy,
    deleteStrategy,
};
