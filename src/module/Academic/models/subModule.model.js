import sequelize from "../../../common/database/connection.js";
import { DataTypes } from "sequelize";

const Submodule = sequelize.define("Submodule",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    moduleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM("document", "video", "quiz"),
      allowNull: false,
    },

    contentText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    contentUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    downloadable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    sequenceNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "submodules",
    timestamps: true,
  }
);

export default Submodule;