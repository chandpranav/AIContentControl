const axios = require('axios');
const config = require('./env');

// OpenAI API client
const openaiClient = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        'Authorization': `Bearer ${config.openai.apiKey}`,
        'Content-Type': 'application/json',
    },
    timeout: 60000, // 60 second timeout for AI responses
});

// Request interceptor for logging in development
openaiClient.interceptors.request.use(
    (request) => {
        if (config.env === 'development') {
            console.log(`🤖 OpenAI Request: ${request.url}`);
        }
        return request;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
openaiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            console.error(`❌ OpenAI API Error [${status}]:`, data.error?.message || data);
        } else if (error.request) {
            console.error('❌ OpenAI API Error: No response received');
        } else {
            console.error('❌ OpenAI API Error:', error.message);
        }
        return Promise.reject(error);
    }
);

module.exports = { openaiClient };
