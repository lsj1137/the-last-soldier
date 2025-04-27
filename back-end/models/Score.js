// models/Score.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const Score = sequelize.define('Score', {
  name: {
    type: DataTypes.STRING,
  },
  score: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Score;
