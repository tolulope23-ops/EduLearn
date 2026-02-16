// import { DataTypes } from 'sequelize';
// import sequelize from '../connection';

// const User = sequelize.define("User", {
//   id: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true,
//   },

//   email: {
//     type: DataTypes.STRING,
//     unique: true,
//     allowNull: true,
//   },

//   accountStatus: {
//     type: DataTypes.ENUM("ACTIVE", "PENDING", "SUSPENDED", "DELETED"),
//     defaultValue: "PENDING",
//   },

//   isEmailVerified: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false,
//   },

//   emailVerifiedAt: {
//     type: DataTypes.DATE,
//   },

// }, {
//   timestamps: true,
// });

// return User;



// const AuthCredential = sequelize.define("AuthCredential", {
//   id: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true,
//   },

//   userId: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     unique: true,
//   },

//   type: {
//     type: DataTypes.ENUM("PASSWORD", "BIOMETRIC"),
//     allowNull: false,
//     defaultValue: "PASSWORD"
//   },

//   identifier: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },

//   secretHash: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },

//   failedAttempts: {
//     type: DataTypes.INTEGER,
//     defaultValue: 0,
//   },

//   lockedUntil: DataTypes.DATE,

//   lastLogin: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
// }, {
//     timestamps: true,
//     indexes: [
//       {
//         unique: true,
//         fields: ["type", "identifier"],
//       },
//     ],
//   }
// );

//   return AuthCredential;



// const RefreshToken = sequelize.define("RefreshToken", {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },

//     sessionId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//     },

//     tokenHash: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },

//     expiresAt: {
//       type: DataTypes.DATE,
//       allowNull: false,
//     },

//     revokedAt: DataTypes.DATE,
//   }, {
//     timestamps: true,
// });

// return RefreshToken;




// const AuthSession = sequelize.define("AuthSession", {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },

//     userId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//     },

//     ipAddress: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },

//     userAgent: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },

//     revokedAt: DataTypes.DATE,
// }, {
//         timestamps: true,
//     }
// );

// return AuthSession;




// const VerificationToken = sequelize.define("VerificationToken", {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },

//     userId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       unique: true,
//     },

//     type: {
//       type: DataTypes.ENUM("EMAIL_VERIFICATION", "PASSWORD_RESET"),
//       allowNull: false,
//     },

//     tokenHash: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },

//     expiresAt: {
//       type: DataTypes.DATE,
//       allowNull: false,
//     },

//     usedAt: DataTypes.DATE,
// }, {
//     timestamps: true,
//   }
// );

//   return VerificationToken;



// const Role = sequelize.define("Role", {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },

//     roleName: {
//       type: DataTypes.ENUM("STUDENT", "TEACHER"),
//       allowNull: false,
//     },

//     description:{ 
//       type: DataTypes.STRING,
//       allowNull: true
//     }
//   }, {
//     timestamps: true,
// });

// return Role;



// const Permission = sequelize.define("Permission",{
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },

//     name: {
//       type: DataTypes.STRING,
//       unique: true,
//       allowNull: false,
//     },

//     description:{ 
//       type: DataTypes.STRING,
//       allowNull: true
//     }
// }, {
//     timestamps: true,
// });

// return Permission;


// const RolePermission = sequelize.define("RolePermission",{
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },

//     roleId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//     },

//     permissionId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//     },
// }, {
//     timestamps: false,
//     indexes: [
//       {
//         unique: true,
//         fields: ["roleId", "permissionId"],
//       },
//     ],
// });

// return RolePermission;





// const UserRole = sequelize.define("UserRole",{
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },

//     userId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//     },

//     roleId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//     },
// }, {
//     timestamps: false,
//     indexes: [
//       {
//         unique: true,
//         fields: ["userId", "roleId"],
//       },
//     ],
// });

// return UserRole;