import sequelize from "../../../common/database/connection";
import { DataTypes } from "sequelize";

const Lesson = sequelize.define("Lesson", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "lessons",
    timestamps: true,
  }
);

export default Lesson;