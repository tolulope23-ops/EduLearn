import { UserRepository } from "./repository/user.repository.js";
import { UserAuthRepository } from "./repository/authCredential.repository.js";

import { UserAuthService } from "./service/auth.service.js";
import { PasswordHasher } from "./utils/passwordHashing.utils.js";
import { UserAuthVerificationService } from "./service/verification.service.js";
import { UserAuthVerificationRepository } from "./repository/verificationToken.repository.js";
import { EmailService } from "./service/emailService.service.js";
import { UserSessionService } from "./service/session.service.js";
import { UserSessionRepository } from "./repository/authSession.repository.js";
import { UserRefreshTokenService } from "./service/refreshToken.service.js";
import { UserRefreshTokenRepository } from "./repository/refreshToken.repository.js";
import { UserAuthMiddleware } from "../../common/middleware/auth.middleware.js";
import { UserAuthController } from "./controller/auth.controller.js";
import { RoleRepository } from "./repository/role.repository.js";
import { UserRoleRepository } from "./repository/userRole.repository.js";

// Repositories
const userRepoInstance = new UserRepository();
const userAuthRepoInstance = new UserAuthRepository();
const passwordHash = new PasswordHasher();
const roleRep = new RoleRepository();
const userRole = new UserRoleRepository();

const userVerificationRepoInstance = new UserAuthVerificationRepository();
const emailInstance = new EmailService();

const sessionRepoInstance = new UserSessionRepository();
const refreshTokenRepoInstance = new UserRefreshTokenRepository();


// Services
export const sessionService = new UserSessionService(sessionRepoInstance);
export const refreshTokenService = new UserRefreshTokenService(
  refreshTokenRepoInstance,
  sessionRepoInstance,
  sessionService
);

export const verificationService = new UserAuthVerificationService(
  userVerificationRepoInstance,
  emailInstance,
  userRepoInstance
);

export const authService = new UserAuthService(
  userRepoInstance,
  userAuthRepoInstance,
  passwordHash,
  verificationService,
  userVerificationRepoInstance,
  sessionService,
  refreshTokenService,
  userRole,
  roleRep
);

export const authMiddleware = new UserAuthMiddleware(sessionRepoInstance);

export const authController = new UserAuthController(authService, verificationService, refreshTokenService);