import sequelize from "../../../common/database/connection.js";
import { DataTypes } from "sequelize";

const QuizOption = sequelize.define("QuizOption", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    questionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    option: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    isCorrect: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "quiz_options",
    timestamps: true,
  }
);

export default QuizOption;