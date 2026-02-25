import { DuplicateRecordError, InvalidCredentialsError, RecordNotFoundError} from "../../../common/error/domainError.error.js";
import { UserAuthRepository } from "../repository/authCredential.repository.js";
import { RoleRepository } from "../repository/role.repository.js";
import { UserRepository } from "../repository/user.repository.js";
import { UserRoleRepository } from "../repository/userRole.repository.js";
import { UserAuthVerificationRepository } from "../repository/verificationToken.repository.js";
import { PasswordHasher } from "../utils/passwordHashing.utils.js";
import { generateAccessToken } from "../utils/verificationToken.utils.js";
import { UserRefreshTokenService } from "./refreshToken.service.js";
import { UserSessionService } from "./session.service.js";
import { UserAuthVerificationService } from "./verification.service.js";

export class UserAuthService {
  /**
   * @param {UserRepository} userRepo
   * @param {UserAuthRepository} userAuth
   * @param {PasswordHasher} hashPassword
   * @param {UserAuthVerificationService} verifyService
   * @param {UserAuthVerificationRepository} verifyRepo
   * @param {UserSessionService} session 
   * @param {UserRefreshTokenService} refreshToken
   * @param {UserRoleRepository} userRole
   * @param {RoleRepository} role
   */
  constructor(
    userRepo, 
    userAuth, 
    hashPassword, 
    verifyService,
    verifyRepo,
    session, 
    refreshToken, 
    userRole, 
    role
  ) {
    this.userRepo = userRepo;
    this.userAuth = userAuth;
    this.hashPassword = hashPassword;
    this.verifyService = verifyService;
    this.verifyRepo = verifyRepo

    this.session = session;
    this.refreshToken = refreshToken;
    this.userRole = userRole;
    this.role = role;
  }

  /** SIGN UP */
  async signUp({ fullName, email, password, location }) {
    // Check duplicate
    const existingUser = await this.userRepo.getUserByEmail(email);
    if (existingUser) throw new DuplicateRecordError("Email already exists");

    // Hash password
    const hashedPassword = await this.hashPassword.hash(password);

    // Create user
    const newUser = await this.userRepo.createUser({ email });

    // Create user credential
    await this.userAuth.createUserCredential({
      userId: newUser.id,
      type: "PASSWORD",
      secretHash: hashedPassword
    });

    console.log(fullName, location);
    

    // Assign default role
    const roleEntity = await this.role.getRoleByName("STUDENT");
    await this.userRole.assignRoleToUser({ userId: newUser.id, roleId: roleEntity.id });

    // Send email verification
    try {
      await this.verifyService.sendAuthVerification(
        newUser.id,
        email,
        "EMAIL_VERIFICATION"
      );
    } catch (error) {
      console.error("Verification email failed:", error.message);
    };

    return {
      success: true,
      user: {fullName, user: newUser.email},
      message: "Registration successful. Please verify your email."
    };
  }

  /** LOGIN */
  async login({ email, password }, sessionData) {
    const user = await this.userRepo.getUserByEmail(email);
    if (!user) throw new InvalidCredentialsError("Invalid email or password");

    // if (!user.isEmailVerified)
    //   throw new InvalidCredentialsError("Please verify your email first");

    const credential = await this.userAuth.getUserCredentialByUserId(user.id);

    // Check if account is locked
    if (credential.lockedUntil && credential.lockedUntil > new Date()) {
      throw new InvalidCredentialsError("Account temporarily locked");
    }

    // Check failed attempts
    if (credential.failedAttempts >= 5) {
      await this.userAuth.lockUserAccess(user.id, new Date(Date.now() + 10 * 1000));
      throw new InvalidCredentialsError("Too many failed attempts");
    }

    // Verify password
    const isPasswordCorrect = await this.hashPassword.verify(password, credential.secretHash);
    if (!isPasswordCorrect) {
      await this.userAuth.incrementFailedAttempts(user.id);
      throw new InvalidCredentialsError("Invalid email or password");
    }

    // Reset failed attempts on success
    await this.userAuth.resetFailedAttempts(user.id);
    await this.userAuth.updateUserLastLogin(user.id);

    // Create session
    const userSession = await this.session.createSession(user.id, sessionData);

    // Create refresh token
    const refreshToken = await this.refreshToken.createRefreshToken(userSession.id);

    // Generate access token
    const accessToken = await generateAccessToken(user.id, userSession.id);

    return { accessToken, refreshToken };
  };

  /** VERIFY EMAIL */
  async verifyUserEmail(token, sessionData) {
    const verifyResult = await this.verifyService.verifyEmailVerificationTokens(token);

    const userId = verifyResult.userId;

    //Auto-login after verification
    const userSession = await this.session.createSession(
      userId,
      sessionData
    );

    const refreshToken =
      await this.refreshToken.createRefreshToken(userSession.id);

    const accessToken = await generateAccessToken(
      userId,
      userSession.id
    );

    return {
      message: "Email verified successfully",
      accessToken,
      refreshToken
    };
  }

  async resendEmailVerification(email) {
    //Find user by email
    const user = await this.userRepo.getUserByEmail(email);
    if (!user) throw new RecordNotFoundError("User not found");

    //Check if already verified, before resending verification token
    if (user.isEmailVerified) {
      return { message: "Email already verified" };
    }

    await this.verifyRepo.deleteVerificationTokenByUser(user.id, 'EMAIL_VERIFICATION');
    // If email not verified, send verification email
    try {
      await this.verifyService.sendAuthVerification(
        user.id,
        email,
        "EMAIL_VERIFICATION"
      );
      return {message: "Verification email sent successfully"};
    } catch (error) {
      console.error("Failed to send verification email:", error.message);
    };
  };

  /** FORGOT PASSWORD */
  async forgotPassword(email) {
    const user = await this.userRepo.getUserByEmail(email);

    if (user && user.isEmailVerified) {
      await this.verifyService.sendAuthVerification(
        user.id,
        email,
        "PASSWORD_RESET"
      );
    };
    return {
      message: "If the account exists and is verified, a password reset link has been sent."
    };
  };

  /** RESET PASSWORD */
  async resetPassword(rawToken, newPassword) {
    const verify = await this.verifyService.verifyPasswordResetToken(rawToken);

    // Hash new password
    const hashedPassword = await this.hashPassword.hash(newPassword);

    // Update user password
    await this.userAuth.updateUserPassword(verify.userId, hashedPassword);

    // Revoke all sessions
    await this.session.sessionRepo.revokeAllUsersSessions(verify.userId);

    return { message: "Password reset successfully" };
  };

  async resendPasswordResetVerification(email) {
    //Find user by email
    const user = await this.userRepo.getUserByEmail(email);
    if (!user) throw new RecordNotFoundError("User not found");

    //Check if already verified, before resending verification token
      await this.verifyRepo.deleteVerificationTokenByUser(user.id, 'PASSWORD_RESET');

    // send resetpassword verification
     try {
        await this.verifyService.sendAuthVerification(user.id, email, "PASSWORD_RESET");
      } catch (error) {
        console.error("Failed to send verification email:", error.message);
      };

    return { message: "Password Reset verification email sent successfully" };
  };

  /** LOGOUT */
  async logout(userId, sessionId) {
    await this.refreshToken.refreshTokenRepo.revokeRefreshTokenBySessionId(sessionId)

    await this.session.sessionRepo.revokeSession(sessionId);
    
    await this.userAuth.resetFailedAttempts(userId);

    return { message: "Logged out successfully" };
  };
};