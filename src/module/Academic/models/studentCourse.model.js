import sequelize from "../../../common/database/connection.js";
import { DataTypes } from "sequelize";

const StudentCourses = sequelize.define("StudentCourses", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "student_courses",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["studentId", "courseId"], // prevents duplicates
      },
    ],
  }
);

export default StudentCourses;