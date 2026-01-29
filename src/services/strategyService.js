import api from './api';

/**
 * Strategy API service
 */
const strategyService = {
    /**
     * Generate a new strategy
     */
    generateStrategy: async (platform, userInterest, targetInterest) => {
        const response = await api.post('/strategies', {
            platform,
            userInterest,
            targetInterest,
        });
        return response.data;
    },

    /**
     * Get user's strategy history
     */
    getStrategies: async (limit = 10, offset = 0) => {
        const response = await api.get('/strategies', {
            params: { limit, offset },
        });
        return response.data;
    },

    /**
     * Get a specific strategy by ID
     */
    getStrategy: async (id) => {
        const response = await api.get(`/strategies/${id}`);
        return response.data;
    },

    /**
     * Delete a strategy
     */
    deleteStrategy: async (id) => {
        const response = await api.delete(`/strategies/${id}`);
        return response.data;
    },
};

export default strategyService;
