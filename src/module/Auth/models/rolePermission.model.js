import sequelize from "../../../common/database/connection";
import { DataTypes } from "sequelize";

const RolePermission = sequelize.define("RolePermission",{
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    permissionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
}, {
    timestamps: true,
    tableName: "role_permissions",
    indexes: [
      {
        unique: true,
        fields: ["roleId", "permissionId"],
      },
    ],
});

export default RolePermission;
