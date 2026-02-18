import { UserRepository } from "../repository/user.repository.js";
import { UserAuthVerificationRepository } from "../repository/verificationToken.repository.js";
import { EmailService, emailTemplates } from './emailService.service.js';
import { FRONTEND_URL } from '../../../common/config/env.config.js'
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
  };

  async createVerificationToken(userId, type) {
    const { rawToken, hashToken } = await createToken();

    const expiresAt = addMinutes(5);

    await this.verifyToken.createVerificationToken({
      userId,
      tokenHash: hashToken,
      type,
      expiresAt
    });

    return rawToken;
  };

  async sendAuthVerification(userId, email, type) {
   //Create verification token
    const rawToken = await this.createVerificationToken(userId, type);

     //Determine subject of the email and link by type
    const subject = type === "EMAIL_VERIFICATION" ? "Verify your email" : "Reset your password";
    const link = subject === "Verify your email" ? "verify-email" : "reset-password"

    //Create verification link
    const verificationLink = `${FRONTEND_URL}/api/v1/auth/${link}?token=${rawToken}`;

    //Pick template dynamically(either email verification or password reset)
    const template = emailTemplates[type];
    const html = template(verificationLink);

    //Send email
    await this.emailService.sendVerification(email, subject, html);
  };

  async verifyEmailVerificationTokens(rawToken) {
    //Hash incoming token
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    //Check stored token
    const storedToken = await this.verifyToken.findValidToken(hashedToken, "EMAIL_VERIFICATION")
    if (!storedToken) {
      throw new InvalidTokenError();
    };

    //Update account status
    await this.userRepo.updateUserAccountStatus(storedToken.userId, 'ACTIVE');

    //Mark email verified
    await this.userRepo.markEmailVerified(storedToken.userId);

    //Delete token (this prevent replay attack)
    await this.verifyToken.deleteToken(storedToken.id);

    return { success: true };
  };

  async verifyPasswordResetToken(rawToken) {
    //Hash incoming token
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    //Check stored token
    const storedToken = await this.verifyToken.findValidToken(hashedToken, "PASSWORD_RESET")
    if (!storedToken) {
      throw new InvalidTokenError();
    };

    return{ userId: storedToken.userId, token: storedToken};
  };
};