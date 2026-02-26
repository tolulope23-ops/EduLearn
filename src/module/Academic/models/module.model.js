import sequelize from "../../../common/database/connection.js";
import { DataTypes } from "sequelize";

const Module = sequelize.define("Module", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    lessonId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    sequenceNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "modules",
    timestamps: true,
  }
);

export default Module;