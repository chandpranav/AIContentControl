const authService = require('../services/auth.service');

/**
 * Handle user signup
 */
const signup = async (req, res, next) => {
    try {
        const result = await authService.signup(req.body);

        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Handle user signin
 */
const signin = async (req, res, next) => {
    try {
        const result = await authService.signin(req.body);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Handle token refresh
 */
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshAccessToken(refreshToken);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Handle password change
 */
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const result = await authService.changePassword(
            req.userId,
            currentPassword,
            newPassword
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
 * Handle logout
 */
const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.logout(refreshToken);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await authService.getUserById(req.userId);

        res.status(200).json({
            success: true,
            data: {
                id: user.id,
                email: user.business_email,
                username: user.username,
                createdAt: user.created_at,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signup,
    signin,
    refreshToken,
    changePassword,
    logout,
    getProfile,
};
