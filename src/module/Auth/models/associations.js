import User from './user.model.js';
import AuthCredential from './authCredential.model.js';
import RefreshToken from './refreshToken.model.js';
import AuthSession from './authSession.model.js';
import VerificationToken from './verificationToken.model.js';
import Role from './role.model.js';
import Permission from './permission.model.js';
import UserRole from './userRole.model.js';
import RolePermission from './rolePermission.model.js';


// User relationships
User.hasMany(AuthCredential, { foreignKey: 'userId' });
AuthCredential.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(AuthSession, { foreignKey: 'userId' });
AuthSession.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(VerificationToken, { foreignKey: 'userId' });
VerificationToken.belongsTo(User, { foreignKey: 'userId' });

User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId' });

// Role ↔ Permission
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'roleId' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permissionId' });

// RefreshToken ↔ Session
RefreshToken.belongsTo(AuthSession, { foreignKey: 'sessionId' });
AuthSession.hasMany(RefreshToken, { foreignKey: 'sessionId' });
