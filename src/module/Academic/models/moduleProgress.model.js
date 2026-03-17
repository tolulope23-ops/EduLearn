import sequelize from "../../../common/database/connection.js";
import { DataTypes } from "sequelize";

const ModuleProgress = sequelize.define("ModuleProgress", {
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

    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0, max: 100 },
    },

    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    score: {
      type: DataTypes.INTEGER,
      validate: { min: 0, max: 100 },
    },

    attemptCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    completionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "module_progress",
    timestamps: true,
  }
);

export default ModuleProgress;