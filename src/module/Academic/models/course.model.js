import sequelize from "../../../common/database/connection.js";
import { DataTypes } from "sequelize";

const Course = sequelize.define("Course",{
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
        type: DataTypes.ENUM("MATHEMATICS", "ENGLISH", "SCIENCE", "ICT"),
        allowNull: false,
        defaultValue: "SCIENCE"
    },
  },
  {
    tableName: "courses",
    timestamps: true,
  }
);

export default Course;