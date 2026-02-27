import { Router } from "express";
import  validationMiddleware from "../../../common/middleware/validation.middleware.js";
import { forgotPasswordSchema, loginSchema, resetPasswordSchema, signupSchema } from "../validation/auth.validation.js";
import { authController, authMiddleware} from "../container.js";
import { createRateLimiter } from "../../../common/middleware/rateLimitter.middleware.js";

const router = Router();

const resendEmailLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many resend attempts. Try again later.",
  keyGenerator: (req) => req.body.email
});

const forgotPasswordLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs:  60 * 60 * 1000, // 1 hour
  message: "Too many password reset requests today.",
  keyGenerator: (req) => req.body.email,
});

// User registration
router.post('/register', validationMiddleware(signupSchema), authController.signUp);

// User login
router.post('/login', validationMiddleware(loginSchema), authController.login);

// Email verification (from link sent in email)
router.get('/verify-email', authController.verifyEmail);

//Resend Email verification
router.post('/resend-verification', resendEmailLimiter, authController.resendEmailVerification);

// Forgot password - send reset link
router.post('/forgot-password', forgotPasswordLimiter, validationMiddleware(forgotPasswordSchema), authController.forgotPassword);

//Resend Email for password reset verification
router.post('/password-resend-verification', authController.resendPasswordResetVerification);

// Reset password - using token from email sent from the frontend
router.post("/reset-password", validationMiddleware(resetPasswordSchema), authController.resetPassword);

router.post("/refresh-token", authController.refreshToken);

// Logout - requires user to be authenticated
router.post("/logout", authMiddleware.authenticate(), authController.logout);

export default router;