const { pool } = require('../config/database');
const aiService = require('./ai.service');
const { injectPlatformSteps, ensureAllSections } = require('../utils/platforms');
const { NotFoundError } = require('../utils/errors');

/**
 * Generate and optionally save a strategy
 */
const generateStrategy = async (userId, platform, userInterest, targetInterest) => {
    // Generate strategy from AI
    let strategy = await aiService.generateStrategy(platform, userInterest, targetInterest);

    // Post-process: inject platform-specific steps
    strategy = injectPlatformSteps(strategy, platform);
    strategy = ensureAllSections(strategy, platform);

    // Save to database if user is authenticated
    if (userId) {
        const result = await pool.query(
            `INSERT INTO strategies (user_id, platform, user_interest, target_interest, strategy_data)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, created_at`,
            [userId, platform, userInterest, targetInterest, JSON.stringify(strategy)]
        );

        return {
            id: result.rows[0].id,
            createdAt: result.rows[0].created_at,
            platform,
            userInterest,
            targetInterest,
            strategy,
        };
    }

    return {
        platform,
        userInterest,
        targetInterest,
        strategy,
    };
};

/**
 * Get user's strategy history
 */
const getUserStrategies = async (userId, limit = 10, offset = 0) => {
    const result = await pool.query(
        `SELECT id, platform, user_interest, target_interest, strategy_data, created_at
     FROM strategies
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
    );

    const countResult = await pool.query(
        'SELECT COUNT(*) FROM strategies WHERE user_id = $1',
        [userId]
    );

    return {
        strategies: result.rows.map((row) => ({
            id: row.id,
            platform: row.platform,
            userInterest: row.user_interest,
            targetInterest: row.target_interest,
            strategy: row.strategy_data,
            createdAt: row.created_at,
        })),
        total: parseInt(countResult.rows[0].count, 10),
        limit,
        offset,
    };
};

/**
 * Get a specific strategy by ID
 */
const getStrategyById = async (userId, strategyId) => {
    const result = await pool.query(
        `SELECT id, platform, user_interest, target_interest, strategy_data, created_at
     FROM strategies
     WHERE id = $1 AND user_id = $2`,
        [strategyId, userId]
    );

    if (result.rows.length === 0) {
        throw new NotFoundError('Strategy not found');
    }

    const row = result.rows[0];
    return {
        id: row.id,
        platform: row.platform,
        userInterest: row.user_interest,
        targetInterest: row.target_interest,
        strategy: row.strategy_data,
        createdAt: row.created_at,
    };
};

/**
 * Delete a strategy
 */
const deleteStrategy = async (userId, strategyId) => {
    const result = await pool.query(
        'DELETE FROM strategies WHERE id = $1 AND user_id = $2 RETURNING id',
        [strategyId, userId]
    );

    if (result.rows.length === 0) {
        throw new NotFoundError('Strategy not found');
    }

    return { message: 'Strategy deleted successfully' };
};

module.exports = {
    generateStrategy,
    getUserStrategies,
    getStrategyById,
    deleteStrategy,
};
