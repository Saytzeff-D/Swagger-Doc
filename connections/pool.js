const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.HOST,
        dialect: 'mysql',
    }
);

module.exports = sequelize;

/*

const mysql = require('mysql')

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

module.exports = pool
*/