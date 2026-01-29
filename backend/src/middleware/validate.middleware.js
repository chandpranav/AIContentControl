const { ZodError } = require('zod');

/**
 * Create validation middleware from a Zod schema
 * @param {Object} schema - Zod schema to validate against
 * @param {string} source - Where to get data from: 'body', 'query', 'params'
 */
const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        try {
            const data = req[source];
            const result = schema.parse(data);

            // Replace with parsed/transformed data
            req[source] = result;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const details = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Invalid request data',
                        details,
                    },
                });
            }

            next(error);
        }
    };
};

module.exports = { validate };
