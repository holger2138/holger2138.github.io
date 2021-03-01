const { Sequelize } = require('sequelize');
const uri = 'mysql://root:qwerty2138@localhost:3306/relation01';
const db = new Sequelize(uri, {});
module.exports = db;
