import sequelize from "../../../common/database/connection.js";
import { DataTypes } from "sequelize";

const ClassLevel = sequelize.define("ClassLevel", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  name: {
    type: DataTypes.ENUM("JUNIOR", "SENIOR"),
    allowNull: false,
    defaultValue: "SENIOR"
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  }

}, {
  timestamps: true,
  tableName: "class_levels",
});

export default ClassLevel;