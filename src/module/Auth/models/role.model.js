import sequelize from "../../../common/database/connection";
import { DataTypes } from 'sequelize';

const Role = sequelize.define("Role", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    roleName: {
      type: DataTypes.ENUM("STUDENT", "TEACHER"),
      allowNull: false,
    },

    description:{ 
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: "roles"
});

export default Role;