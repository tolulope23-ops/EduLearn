import { DataTypes } from 'sequelize';
import sequelize from '../connection';

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },

  accountStatus: {
    type: DataTypes.ENUM("ACTIVE", "PENDING", "SUSPENDED", "DELETED"),
    defaultValue: "PENDING",
  },

  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  emailVerifiedAt: {
    type: DataTypes.DATE,
  },

}, {
  timestamps: true,
  tableName: 'users'
});

return User;