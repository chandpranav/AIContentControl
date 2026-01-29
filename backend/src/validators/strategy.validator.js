const { z } = require('zod');

// List of supported platforms
const SUPPORTED_PLATFORMS = ['instagram', 'facebook', 'youtube'];

// Bad content regex for safety filtering
const BAD_CONTENT_REGEX = /\b(?:porn|sex|sexual|xxx|nude|explicit|adult|hate|racist|terror|kill|rape|violence)\b/i;

// Custom validation for content safety
const safeContentString = (fieldName) =>
    z
        .string()
        .min(2, `${fieldName} must be at least 2 characters`)
        .max(200, `${fieldName} must not exceed 200 characters`)
        .trim()
        .refine(
            (val) => !BAD_CONTENT_REGEX.test(val),
            'Content contains inappropriate or explicit terms'
        );

// Strategy generation request validation
const generateStrategySchema = z.object({
    platform: z
        .string()
        .toLowerCase()
        .refine(
            (val) => SUPPORTED_PLATFORMS.includes(val),
            `Platform must be one of: ${SUPPORTED_PLATFORMS.join(', ')}`
        ),
    userInterest: safeContentString('Current interest'),
    targetInterest: safeContentString('Target interest'),
});

// Strategy ID params validation
const strategyIdSchema = z.object({
    id: z.string().regex(/^\d+$/, 'Invalid strategy ID').transform(Number),
});

module.exports = {
    generateStrategySchema,
    strategyIdSchema,
    SUPPORTED_PLATFORMS,
    BAD_CONTENT_REGEX,
};
