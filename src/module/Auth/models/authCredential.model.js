import sequelize from "../../../common/database/connection.js";
import { DataTypes } from "sequelize";

const AuthCredential = sequelize.define("AuthCredential", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },

  type: {
    type: DataTypes.ENUM("PASSWORD", "BIOMETRIC"),
    allowNull: false,
    defaultValue: "PASSWORD"
  },
  
  secretHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  failedAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  lockedUntil: { 
    type: DataTypes.DATE,
    allowNull: true
  },

  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
    timestamps: true,
    tableName: 'auth_credentials'
  }
);

export default AuthCredential;