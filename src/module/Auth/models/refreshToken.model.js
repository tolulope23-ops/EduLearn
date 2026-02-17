import sequelize from "../../../common/database/connection";
import { DataTypes } from "sequelize";

const RefreshToken = sequelize.define("RefreshToken", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    sessionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    tokenHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    timestamps: true,
    tableName: "refresh_tokens"
});

export default RefreshToken;