const Sequelize = require('sequelize');

const connection = new Sequelize('asksome1', 'root', '1234',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;