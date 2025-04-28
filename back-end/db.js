// db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('last_soldier', process.env.DB_ID, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;