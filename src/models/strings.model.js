import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

const StringModel = sequelize.define("String", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  properties: {
    type: DataTypes.JSON,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default StringModel;
