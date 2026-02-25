// Import all models and export for easy accesibility when importing from other file.
import User from './user.model.js';
import AuthCredential from './authCredential.model.js';
import RefreshToken from './refreshToken.model.js';
import AuthSession from './authSession.model.js';
import VerificationToken from './verificationToken.model.js';
import Role from './role.model.js';
import Permission from './permission.model.js';
import UserRole from './userRole.model.js';
import RolePermission from './rolePermission.model.js';
import UserProfile from './userProfile.model.js';

// Import associations
import './associations.js';

export {
  User,
  UserProfile,
  AuthCredential,
  RefreshToken,
  AuthSession,
  VerificationToken,
  Role,
  Permission,
  UserRole,
  RolePermission,

};
