import sequelize from "../../../common/database/connection.js";
import { DataTypes } from "sequelize";

const ModuleProgress = sequelize.define("ModuleProgress",
  {
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    moduleId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    completionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "module_progress",
    timestamps: true,
  }
);

export default ModuleProgress;