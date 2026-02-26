import sequelize from "../../../common/database/connection.js";
import { DataTypes } from "sequelize";

const StudentProfile = sequelize.define("StudentProfile", {
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

  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  dailyGoal: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  classLevelId: {
    type: DataTypes.UUID,
    allowNull: true,
  },

}, {
  timestamps: true,
  tableName: "student_profiles",
});

export default StudentProfile;