import sequelize from "../../../common/database/connection.js";
import { DataTypes } from "sequelize";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
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
    allowNull: true
  },

}, {
  timestamps: true,
  tableName: 'users'
});

export default User;