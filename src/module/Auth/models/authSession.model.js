import sequelize from "../../../common/database/connection.js";
import { DataTypes } from "sequelize";

const AuthSession = sequelize.define("AuthSession", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    ipAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    userAgent: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
}, {
      timestamps: true,
      tableName: 'auth_sessions'
    }
);

export default AuthSession;

