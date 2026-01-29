const { z } = require('zod');

// Password must have: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[\W_]/, 'Password must contain at least one special character');

// Signup validation
const signupSchema = z.object({
    businessEmail: z
        .string()
        .email('Invalid email address')
        .transform((val) => val.toLowerCase().trim()),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must not exceed 50 characters')
        .trim(),
    password: passwordSchema,
});

// Signin validation
const signinSchema = z.object({
    email: z
        .string()
        .email('Invalid email address')
        .transform((val) => val.toLowerCase().trim()),
    password: z.string().min(1, 'Password is required'),
});

// Change password validation
const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
});

// Refresh token validation
const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});

module.exports = {
    signupSchema,
    signinSchema,
    changePasswordSchema,
    refreshTokenSchema,
};
