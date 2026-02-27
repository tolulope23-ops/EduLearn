import { UserRepository } from "../repository/user.repository.js";
import { UserAuthVerificationRepository } from "../repository/verificationToken.repository.js";
import { EmailService } from './emailService.service.js';
import { FRONTEND_URL } from '../../../common/config/env.config.js';
import { createToken } from "../utils/verificationToken.utils.js";
import { addMinutes } from "../utils/passwordHashing.utils.js";
import { InvalidTokenError } from "../../../common/error/domainError.error.js";
import crypto from 'crypto';

export class UserAuthVerificationService {
  /**
   * @param {UserAuthVerificationRepository} verifyToken
   * @param {EmailService} emailService
   * @param {UserRepository} userRepo
   */
  constructor(verifyToken, emailService, userRepo) {
    this.verifyToken = verifyToken;
    this.emailService = emailService;
    this.userRepo = userRepo;
  }

  /**
   * Create a verification token and store hashed version
   */
  async createVerificationToken(userId, type) {
    const { rawToken, hashToken } = await createToken();
    const expiresAt = addMinutes(2);

    await this.verifyToken.createVerificationToken({
      userId,
      tokenHash: hashToken,
      type: type,
      expiresAt: expiresAt,
    });

     console.log("hashed",hashToken);
    return rawToken;
  }

  /**
   * Send email verification or password reset
   */
  async sendAuthVerification(userId, email, type) {
    const rawToken = await this.createVerificationToken(userId, type);
    console.log("raw",rawToken);

    const path = type === "EMAIL_VERIFICATION" ? "verify-email" : "reset-password";

    const verificationLink = `${FRONTEND_URL}/api/v1/auth/${path}?token=${rawToken}`;

    await this.emailService.sendVerification(email, type, verificationLink);
  };

  /**
   * Verify an email verification token and activate user
   */
  async verifyEmailVerificationTokens(rawToken) {
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    const storedToken = await this.verifyToken.findValidVerificationToken(hashedToken, "EMAIL_VERIFICATION");

    if (!storedToken) throw new InvalidTokenError();

    await this.userRepo.updateUserAccountStatus(storedToken.userId, 'ACTIVE');

    await this.userRepo.markEmailVerified(storedToken.userId);
    
    // Delete token to prevent replay attack
    await this.verifyToken.deleteVerificationToken(storedToken.id);

    return {userId: storedToken.userId};
  };

  /**
   * Verify a password reset token
   */
  async verifyPasswordResetToken(rawToken) {
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    const storedToken = await this.verifyToken.findValidVerificationToken(hashedToken, "PASSWORD_RESET");
    if (!storedToken) throw new InvalidTokenError();

    // Delete token to prevent replay attack
    await this.verifyToken.deleteVerificationToken(storedToken.id);

    return { userId: storedToken.userId, token: storedToken};
  };
};