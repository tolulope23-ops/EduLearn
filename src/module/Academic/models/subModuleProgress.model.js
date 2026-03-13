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

  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  score: {
    type: DataTypes.INTEGER,
    validate: { min: 0, max: 100 },
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