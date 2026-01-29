const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const config = require('../config/env');
const {
    ConflictError,
    AuthenticationError,
    NotFoundError,
} = require('../utils/errors');

const SALT_ROUNDS = 10;

/**
 * Generate JWT access token
 */
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (userId) => {
    return jwt.sign({ userId, type: 'refresh' }, config.jwt.secret, {
        expiresIn: config.jwt.refreshExpiresIn,
    });
};

/**
 * Parse duration string to milliseconds
 */
const parseDuration = (duration) => {
    const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 86400000; // Default 7 days
    return parseInt(match[1]) * units[match[2]];
};

/**
 * Store refresh token in database
 */
const storeRefreshToken = async (userId, token) => {
    const expiresAt = new Date(Date.now() + parseDuration(config.jwt.refreshExpiresIn));
    await pool.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [userId, token, expiresAt]
    );
};

/**
 * Register a new user
 */
const signup = async ({ businessEmail, username, password }) => {
    // Check if email already exists
    const existingUser = await pool.query(
        'SELECT 1 FROM users WHERE LOWER(business_email) = LOWER($1)',
        [businessEmail]
    );

    if (existingUser.rows.length > 0) {
        throw new ConflictError('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user
    const result = await pool.query(
        `INSERT INTO users (business_email, username, password)
     VALUES ($1, $2, $3)
     RETURNING id, business_email, username, created_at`,
        [businessEmail, username, hashedPassword]
    );

    const user = result.rows[0];

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token
    await storeRefreshToken(user.id, refreshToken);

    return {
        user: {
            id: user.id,
            email: user.business_email,
            username: user.username,
        },
        accessToken,
        refreshToken,
    };
};

/**
 * Authenticate user and return tokens
 */
const signin = async ({ email, password }) => {
    // Find user by email
    const result = await pool.query(
        'SELECT * FROM users WHERE LOWER(business_email) = LOWER($1)',
        [email]
    );

    if (result.rows.length === 0) {
        throw new AuthenticationError('Invalid email or password');
    }

    const user = result.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AuthenticationError('Invalid email or password');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token
    await storeRefreshToken(user.id, refreshToken);

    return {
        user: {
            id: user.id,
            email: user.business_email,
            username: user.username,
        },
        accessToken,
        refreshToken,
    };
};

/**
 * Refresh access token
 */
const refreshAccessToken = async (refreshToken) => {
    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, config.jwt.secret);

        if (decoded.type !== 'refresh') {
            throw new AuthenticationError('Invalid refresh token');
        }

        // Check if token exists in database and is not expired
        const result = await pool.query(
            `SELECT * FROM refresh_tokens 
       WHERE token = $1 AND user_id = $2 AND expires_at > NOW()`,
            [refreshToken, decoded.userId]
        );

        if (result.rows.length === 0) {
            throw new AuthenticationError('Invalid or expired refresh token');
        }

        // Delete old refresh token (rotation)
        await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);

        // Generate new tokens
        const newAccessToken = generateAccessToken(decoded.userId);
        const newRefreshToken = generateRefreshToken(decoded.userId);

        // Store new refresh token
        await storeRefreshToken(decoded.userId, newRefreshToken);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error;
        }
        throw new AuthenticationError('Invalid refresh token');
    }
};

/**
 * Change user password
 */
const changePassword = async (userId, currentPassword, newPassword) => {
    // Get user
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0) {
        throw new NotFoundError('User not found');
    }

    const user = result.rows[0];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new AuthenticationError('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password
    await pool.query(
        'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
        [hashedPassword, userId]
    );

    // Invalidate all refresh tokens for this user
    await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);

    return { message: 'Password updated successfully' };
};

/**
 * Logout - invalidate refresh token
 */
const logout = async (refreshToken) => {
    await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
    return { message: 'Logged out successfully' };
};

/**
 * Get user by ID
 */
const getUserById = async (userId) => {
    const result = await pool.query(
        'SELECT id, business_email, username, created_at FROM users WHERE id = $1',
        [userId]
    );

    if (result.rows.length === 0) {
        throw new NotFoundError('User not found');
    }

    return result.rows[0];
};

module.exports = {
    signup,
    signin,
    refreshAccessToken,
    changePassword,
    logout,
    getUserById,
    generateAccessToken,
};
