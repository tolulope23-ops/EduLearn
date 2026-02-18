import sequelize from "../../../common/database/connection.js";
import { DataTypes } from "sequelize";

const VerificationToken = sequelize.define("VerificationToken", {
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
      type: DataTypes.ENUM("EMAIL_VERIFICATION", "PASSWORD_RESET"),
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

    usedAt:{ 
      type: DataTypes.DATE,
      allowNull: true
    },
}, {
    timestamps: true,
    tableName: "verification_tokens"
  }
);

export default VerificationToken;