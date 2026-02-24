import { BadRequestError } from "../../../common/error/httpError.error.js";
import { UserAuthService } from "../service/auth.service.js";
import { UserAuthVerificationService } from "../service/verification.service.js";
import { UserRefreshTokenService } from "../service/refreshToken.service.js";
import { cookieOptions } from "../../../common/config/cookie.config.js";

export class UserAuthController {
  /**
   * @param {UserAuthService} userAuthService
   * @param {UserAuthVerificationService} verifyService
   * @param {UserRefreshTokenService} refreshTokenService
   * 
   */
  constructor(userAuthService, verifyService, refreshTokenService) {
    this.userAuthService = userAuthService;
    this.verifyService = verifyService;
    this.refreshTokenService = refreshTokenService;
  }

  signUp = async (req, res, next) => {
    try {
      const result = await this.userAuthService.signUp(req.body);

      return res.status(201).json({
        success: true,
        message: result.message,
        user: result.user
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const ipAddress = req.ip;
      const userAgent = req.headers["user-agent"] || "unknown";

      const signin = await this.userAuthService.login(req.body, {
        ipAddress,
        userAgent,
      });

      res.cookie("refreshToken", signin.refreshToken, cookieOptions)

      return res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken: signin.accessToken,
      });
    } catch (error) {
      next(error);
    }
  };


  refreshToken = async (req, res, next) => {
    try {
      const oldRefreshToken = req.cookies?.refreshToken;
    
      if (!oldRefreshToken) {
        throw new BadRequestError("Refresh token is missing");
      }

      const token =
        await this.refreshTokenService.rotateRefreshToken(
          oldRefreshToken.rawToken
        );

      res.cookie("refreshToken", token.refreshToken, cookieOptions);

      return res.status(200).json({
        success: true,
        accessToken: token.accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req, res, next) => {
    try {
      const { token } = req.query;

      if (!token || typeof token !== "string") {
        throw new BadRequestError("Verification token is required");
      };

      const ipAddress = req.ip;
      const userAgent = req.headers["user-agent"] || "unknown";

      const result =
        await this.userAuthService.verifyUserEmail(token, {
          ipAddress,
          userAgent,
        });

      res.cookie("refreshToken", result.refreshToken, cookieOptions);

      return res.status(200).json({
        success: true,
        message: result.message,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  resendEmailVerification = async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email) {
        throw new BadRequestError("Email is required");
      }

      const result =
        await this.userAuthService.resendEmailVerification(email);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email) {
        throw new BadRequestError("Email is required");
      }

      const result = await this.userAuthService.forgotPassword(email);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  resendPasswordResetVerification = async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email) {
        throw new BadRequestError("Email is required");
      }

      const result =
        await this.userAuthService.resendPasswordResetVerification(email);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        throw new BadRequestError(
          "Token and new password are required"
        );
      }

      const result =
        await this.userAuthService.resetPassword(
          token,
          newPassword
        );

      // Clear refresh cookie after password reset
      res.clearCookie("refreshToken", cookieOptions);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const { userId, sessionId } = req.user || {};

      if (!userId || !sessionId) {
        throw new BadRequestError(
          "Invalid session or unauthenticated"
        );
      }

      await this.userAuthService.logout(userId, sessionId);

      res.clearCookie("refreshToken", cookieOptions);

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}