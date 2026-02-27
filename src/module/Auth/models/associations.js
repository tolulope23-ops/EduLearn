import User from './user.model.js';
import StudentProfile from './studentProfile.model.js';
import AuthCredential from './authCredential.model.js';
import RefreshToken from './refreshToken.model.js';
import AuthSession from './authSession.model.js';
import VerificationToken from './verificationToken.model.js';
import Role from './role.model.js';
import Permission from './permission.model.js';
import UserRole from './userRole.model.js';
import RolePermission from './rolePermission.model.js';
import ClassLevel from '../../Academic/models/classLevel.model.js';

// User ↔ AuthCredential
User.hasMany(AuthCredential, { foreignKey: 'userId' });
AuthCredential.belongsTo(User, { foreignKey: 'userId' });

// User ↔ AuthSession
User.hasMany(AuthSession, { foreignKey: 'userId' });
AuthSession.belongsTo(User, { foreignKey: 'userId' });

// User ↔ VerificationToken
User.hasMany(VerificationToken, { foreignKey: 'userId' });
VerificationToken.belongsTo(User, { foreignKey: 'userId' });

// User ↔ StudentProfile (new)
User.hasOne(StudentProfile, { foreignKey: 'userId', as: 'students' });
StudentProfile.belongsTo(User, { foreignKey: 'userId' });

// UserProfile ↔ ClassLevel
ClassLevel.hasMany(StudentProfile, { foreignKey: 'classLevelId', as: 'students' });
StudentProfile.belongsTo(ClassLevel, { foreignKey: 'classLevelId', as: 'classLevel' });

// User ↔ Role (many-to-many)
User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId' });

// Role ↔ Permission (many-to-many)
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'roleId' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permissionId' });

// RefreshToken ↔ AuthSession
RefreshToken.belongsTo(AuthSession, {foreignKey: 'sessionId',as: 'session'});
AuthSession.hasMany(RefreshToken, {foreignKey: 'sessionId', as: 'refreshTokens'});