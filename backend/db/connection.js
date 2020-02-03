var mysql = require('mysql');

/* var connection = mysql.createConnection({
    host: "eu-cdbr-west-02.cleardb.net",
    user: "b1f28cd54288b7",
    password: "29ce9236",
    database: "heroku_8e4eeaee95cc47d"
});
 */
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
console.log(process.env.DB_HOST);
module.exports = connection;
