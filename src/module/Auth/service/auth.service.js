import { DuplicateRecordError, InvalidCredentialsError, RecordNotFoundError } from "../../../common/error/domainError.error.js";
import { UserAuthRepository } from "../repository/authCredential.repository.js";
import { RoleRepository } from "../repository/role.repository.js";
import { UserRepository } from "../repository/user.repository.js";
import { UserRoleRepository } from "../repository/userRole.repository.js";
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
   * @param {UserSessionService} session 
   * @param {UserRefreshTokenService} refreshToken
   * @param {UserRoleRepository} userRole
   * @param {RoleRepository} role
   */
  constructor(userRepo, userAuth, hashPassword, verifyService, session, refreshToken, userRole, role) {
    this.userRepo = userRepo;
    this.userAuth = userAuth;
    this.hashPassword = hashPassword;
    this.verifyService = verifyService;
    this.session = session;
    this.refreshToken = refreshToken;
    this.userRole = userRole;
    this.role = role;
  };

  async signUp(data) {
    const {email, password} = data;

    const userExists = await this.userRepo.getUserByEmail(email);

    if(userExists)
        throw new DuplicateRecordError("Email already Exists");

    
    const hashPass = await this.hashPassword.hash(password);
    
    const newUser = await this.userRepo.createUser({email});
    
    await this.userAuth.createUserCredential({
        userId: newUser.id,
        type: 'PASSWORD',
        secretHash: hashPass
    });

    // get role id by name
    const role = await this.role.getRoleByName("STUDENT");
    
    // Assign default role to user
    await this.userRole.assignRoleToUser({userId: newUser.id, roleId: role.id});

    return newUser;
  };

  async login (data, sessionData) {
    const {email, password} = data;

    const userExists = await this.userRepo.getUserByEmail(email);
    if(!userExists)
      throw RecordNotFoundError('User not found');

    const userCredential = await this.userAuth.getUserCredentialByUserId(userExists.id);

    // Check account lock due to failed attempts
    if (userCredential.lockedUntil && userCredential.lockedUntil > new Date())
      throw new InvalidCredentialsError("Account temporarily locked");
    
    // Check failed attempts threshold
    if (userCredential.failedAttempts && userCredential.failedAttempts >= 5) {
      await this.deps.userAuth.lockUserAccess(userCredential.userId, addSeconds(10));
      throw new InvalidCredentialsError("Too many failed attempts");
    };

    // Verify password
    const isPasswordCorrect = await this.hashPassword.verify(password, userCredential.secretHash);

    if (!isPasswordCorrect) {
      await this.deps.userAuth.incrementFailedAttempts(userCredential.userId);
      throw new InvalidCredentialsError('Password is Incorrect');
    };

    // Reset failed attempts after successful login
    await this.userAuth.resetFailedAttempts(userCredential.userId);

    // Update last login timestamp
    await this.userAuth.updateUserLastLogin(userCredential.userId);

    // Create user session
    const userSession = await this.session.createSession(userCredential.userId, sessionData);

    // Create refresh token
    const refreshToken = await this.refreshToken.createRefreshToken(userSession.id);

    // Generate access token
    const accessToken = await generateAccessToken(userCredential.userId, userSession.id);

    return {
      refreshToken,
      accessToken,
    };
  };


  async forgotPassword(email) {
    const user = await this.userRepo.getUserByEmail(email);

    // Send password reset verification
    await this.verifyService.sendAuthVerification(
      user.id,
      email,
      "PASSWORD_RESET"
    );

    return { success: true};
  };

  async resetPassword(rawToken, newPassword){
    // verify Token
    const verify = await this.verifyService.verifyPasswordResetToken(rawToken);
    
    //Hash user new password
    const hashPass = await this.hashPassword.hash(newPassword);

    //Update user password
    await this.userAuth.updateUserPassword(verify.userId, hashPass);

    //Deleted Token after successful password update(this prevent replay attack)
    await this.verifyToken.deleteToken(verify.token.id);

    //Revoke refreshToken
    await this.refreshToken.refreshTokenRepo.revokeAllRefreshToken(verify.userId);

    //Revoke session
    await this.session.sessionRepo.revokeAllUsersSessions(verify.userId);

    return {success: true};
  };

  async logout (userId, sessionId){
    await this.refreshToken.refreshTokenRepo.revokeBySessionId(sessionId);
    await this.session.sessionRepo.revokeSession(sessionId);
    await this.userAuth.resetFailedAttempts(userId);

    return { message: "Logged out successfully" };
  };
};
