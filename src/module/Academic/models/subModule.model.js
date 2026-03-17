import sequelize from "../../../common/database/connection.js";
import { DataTypes } from "sequelize";

const SubModule = sequelize.define("SubModule", {
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
      defaultValue: true,
    },

    contentSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    contentVersion: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    sequenceNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "submodules",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["moduleId", "sequenceNumber"],
      },
    ],
  }
);

export default SubModule;