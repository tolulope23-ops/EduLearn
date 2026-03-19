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

  async createVerificationToken(userId, type) {
    const { rawToken, hashToken } = await createToken();
    const expiresAt = addMinutes(10);

    await this.verifyToken.createVerificationToken({
      userId,
      tokenHash: hashToken,
      type,
      expiresAt,
    });

    return rawToken;
  }

  async sendAuthVerification(userId, email, type, name) {
    const rawToken = await this.createVerificationToken(userId, type);
    console.log(`Sending ${type} token:`, rawToken);

    const path = type === "EMAIL_VERIFICATION" ? "verify-email" : "reset-password";
    const verificationLink = `${FRONTEND_URL}/${path}?token=${rawToken}`;

    await this.emailService.sendVerification(email, type, verificationLink, name);
  }

  /**
   * Verify email token and activate user
   */
  async verifyEmailVerificationTokens(rawToken) {
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    // Find the token in DB
    const storedToken = await this.verifyToken.findValidVerificationToken(
      hashedToken,
      "EMAIL_VERIFICATION"
    );

    if (!storedToken) {
      throw new InvalidTokenError("Token not found or expired");
    }

    const user = await this.userRepo.getUserById(storedToken.userId);
    if (!user) {
      throw new InvalidTokenError("User not found for this token");
    }

    // If user is already verified
    if (user.isEmailVerified) {
      return {
        message: "Email is already verified.",
        alreadyVerified: true,
        userId: user.id,
      };
    }

    // Otherwise, mark email as verified
    await this.userRepo.updateUserAccountStatus(user.id, "ACTIVE");
    await this.userRepo.markEmailVerified(user.id);

    // Delete token so it cannot be reused
    await this.verifyToken.deleteVerificationToken(storedToken.id);

    return {
      message: "Email verified.",
      alreadyVerified: false,
      userId: user.id,
    };
  }

  async verifyPasswordResetToken(rawToken) {
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    const storedToken = await this.verifyToken.findValidVerificationToken(
      hashedToken,
      "PASSWORD_RESET"
    );

    if (!storedToken) {
      throw new InvalidTokenError("Token not found or expired");
    }

    // Delete token to prevent replay attack
    await this.verifyToken.deleteVerificationToken(storedToken.id);

    return { userId: storedToken.userId, token: storedToken };
  }
};


//   /**
//    * Create a verification token and store hashed version
//    */
//   async createVerificationToken(userId, type) {
//     const { rawToken, hashToken } = await createToken();
//     const expiresAt = addMinutes(5);

//     await this.verifyToken.createVerificationToken({
//       userId,
//       tokenHash: hashToken,
//       type: type,
//       expiresAt: expiresAt,
//     });

//     return rawToken;
//   }

//   /**
//    * Send email verification or password reset
//    */
//   async sendAuthVerification(userId, email, type, name) {
//     const rawToken = await this.createVerificationToken(userId, type);
//     console.log(rawToken);
  

//     const path = type === "EMAIL_VERIFICATION" ? "verify-email" : "reset-password";

//     const verificationLink = `${FRONTEND_URL}/${path}?token=${rawToken}`;

//     await this.emailService.sendVerification(email, type, verificationLink, name);
//   };

//   /**
//    * Verify an email verification token and activate user
//    */
//   async verifyEmailVerificationTokens(rawToken) {
//     const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

//     const storedToken = await this.verifyToken.findValidVerificationToken(hashedToken, "EMAIL_VERIFICATION");

//     if (!storedToken) throw new InvalidTokenError();

//     await this.userRepo.updateUserAccountStatus(storedToken.userId, 'ACTIVE');

//     await this.userRepo.markEmailVerified(storedToken.userId);
    
//     // Delete token to prevent replay attack
//     await this.verifyToken.deleteVerificationToken(storedToken.id);

//     return {userId: storedToken.userId};
//   };

//   /**
//    * Verify a password reset token
//    */
//   async verifyPasswordResetToken(rawToken) {
//     const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

//     const storedToken = await this.verifyToken.findValidVerificationToken(hashedToken, "PASSWORD_RESET");
//     if (!storedToken) throw new InvalidTokenError();

//     // Delete token to prevent replay attack
//     await this.verifyToken.deleteVerificationToken(storedToken.id);

//     return { userId: storedToken.userId, token: storedToken};
//   };
// };
