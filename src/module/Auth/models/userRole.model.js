import sequelize from "../../../common/database/connection";
import { DataTypes } from "sequelize";

const UserRole = sequelize.define("UserRole",{
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
}, {
    timestamps: true,
    tableName: "user_roles",
    indexes: [
      {
        unique: true,
        fields: ["userId", "roleId"],
      },
    ],
});

export default UserRole;