import sequelize from "../../../common/database/connection.js";
import { DataTypes } from "sequelize";

const SubmoduleProgress = sequelize.define("SubmoduleProgress",{
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },

  submoduleId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },

  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  score: {
    type: DataTypes.INTEGER,
    validate: { min: 0, max: 100 },
  },

  downloaded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  downloadedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  },
  {
    tableName: "submodule_progress",
    timestamps: true,
  }
);

export default SubmoduleProgress;