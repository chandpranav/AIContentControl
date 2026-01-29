const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimiter.middleware');
const {
    signupSchema,
    signinSchema,
    changePasswordSchema,
    refreshTokenSchema,
} = require('../validators/auth.validator');

// Public routes (with rate limiting)
router.post(
    '/signup',
    authLimiter,
    validate(signupSchema),
    authController.signup
);

router.post(
    '/signin',
    authLimiter,
    validate(signinSchema),
    authController.signin
);

router.post(
    '/refresh',
    authLimiter,
    validate(refreshTokenSchema),
    authController.refreshToken
);

// Protected routes
router.put(
    '/password',
    authenticate,
    validate(changePasswordSchema),
    authController.changePassword
);

router.post(
    '/logout',
    authenticate,
    authController.logout
);

router.get(
    '/profile',
    authenticate,
    authController.getProfile
);

module.exports = router;
