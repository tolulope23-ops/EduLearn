import sequelize from "../../../common/database/connection.js";
import { DataTypes } from 'sequelize';

const Permission = sequelize.define("Permission",{
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    description:{ 
      type: DataTypes.STRING,
      allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'permissions'
});

export default Permission;
