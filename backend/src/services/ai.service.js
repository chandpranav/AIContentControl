const { openaiClient } = require('../config/openai');
const config = require('../config/env');
const { buildPromptForPlatform, SYSTEM_MESSAGE } = require('../utils/prompts');
const { ExternalServiceError } = require('../utils/errors');

/**
 * Generate strategy using OpenAI
 */
const generateStrategy = async (platform, userInterest, targetInterest) => {
    const title = `Shifting ${platform.charAt(0).toUpperCase() + platform.slice(1)} Algorithm From ${userInterest} to ${targetInterest}`;
    const prompt = buildPromptForPlatform(platform, title, userInterest, targetInterest);

    try {
        const response = await openaiClient.post('/chat/completions', {
            model: config.openai.model,
            messages: [
                { role: 'system', content: SYSTEM_MESSAGE },
                { role: 'user', content: prompt },
            ],
            temperature: 0.7,
        });

        const content = response.data.choices[0].message.content.trim();

        // Parse JSON response
        let strategy;
        try {
            strategy = JSON.parse(content);
        } catch (parseError) {
            // Try to extract JSON from markdown code blocks
            const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch) {
                strategy = JSON.parse(jsonMatch[1].trim());
            } else {
                throw new ExternalServiceError('OpenAI', 'Failed to parse AI response as JSON');
            }
        }

        // Check for explicit content error from AI
        if (strategy.error === 'explicit_content') {
            throw new ExternalServiceError('OpenAI', 'Content flagged as inappropriate');
        }

        return {
            title: strategy.title || title,
            sections: strategy.sections || [],
        };
    } catch (error) {
        if (error instanceof ExternalServiceError) {
            throw error;
        }

        if (error.response) {
            throw new ExternalServiceError(
                'OpenAI',
                error.response.data?.error?.message || 'API request failed'
            );
        }

        throw new ExternalServiceError('OpenAI', error.message || 'Unknown error');
    }
};

module.exports = {
    generateStrategy,
};
