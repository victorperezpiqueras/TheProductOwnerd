// const mysql = require('mysql');
const mysql2 = require('mysql2');

/* var connection = mysql.createConnection({
    host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
 */

/* POOL DE CONNECTIONS */
const connection = mysql2
  .createPool({
    connectionLimit: 30,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  })
  .promise();

console.log('Connection host', process.env.DB_HOST);
module.exports = connection;
