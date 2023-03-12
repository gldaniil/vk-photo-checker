const sequelize = require('./db');
const { DataTypes } = require('sequelize');

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
  userId: { type: DataTypes.STRING, unique: true }
});

const Photo = sequelize.define("photo", {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
  ownerId: { type: DataTypes.STRING },
  photoId: { type: DataTypes.STRING, unique: true }
});

module.exports = {
  User,
  Photo,
};