import { Router } from "express";
import validationMiddleware from "../../../common/middleware/validation.middleware.js";
import { forgotPasswordSchema, loginSchema, resetPasswordSchema, signupSchema } from "../validation/auth.validation.js";
import { authController, authMiddleware, refreshTokenController } from "../container.js";

const router = Router();

// User registration
router.post('/register', validationMiddleware(signupSchema), authController.signUp);

// User login
router.post('/login', validationMiddleware(loginSchema), authController.login);

// Email verification (from link sent in email)
router.get('/verify-email', authController.verifyEmail);

// Forgot password - send reset link
router.post('/forgot-password', validationMiddleware(forgotPasswordSchema), authController.forgotPassword);

// Reset password - using token from email sent from the frontend
router.post("/reset-password", validationMiddleware(resetPasswordSchema),authController.resetPassword);


router.post("/refresh-token", refreshTokenController.refreshToken);

// Logout - requires user to be authenticated
router.post("/logout", authMiddleware.authenticate(), authController.logout);

export default router;