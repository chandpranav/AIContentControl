import api from './api';

/**
 * Authentication API service
 */
const authService = {
    /**
     * Register a new user
     */
    signup: async (businessEmail, username, password) => {
        const response = await api.post('/auth/signup', {
            businessEmail,
            username,
            password,
        });
        return response.data;
    },

    /**
     * Sign in user
     */
    signin: async (email, password) => {
        const response = await api.post('/auth/signin', {
            email,
            password,
        });
        return response.data;
    },

    /**
     * Refresh access token
     */
    refreshToken: async (refreshToken) => {
        const response = await api.post('/auth/refresh', {
            refreshToken,
        });
        return response.data;
    },

    /**
     * Change password
     */
    changePassword: async (currentPassword, newPassword) => {
        const response = await api.put('/auth/password', {
            currentPassword,
            newPassword,
        });
        return response.data;
    },

    /**
     * Logout user
     */
    logout: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try {
                await api.post('/auth/logout', { refreshToken });
            } catch (error) {
                // Ignore logout errors
            }
        }
        // Clear local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    /**
     * Get current user profile
     */
    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },
};

export default authService;
