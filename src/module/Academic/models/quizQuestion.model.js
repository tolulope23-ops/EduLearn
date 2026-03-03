import sequelize from "../../../common/database/connection.js";
import { DataTypes } from "sequelize";

const QuizQuestion = sequelize.define("QuizQuestion", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    submoduleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "quiz_questions",
    timestamps: true,
  }
);

export default QuizQuestion;