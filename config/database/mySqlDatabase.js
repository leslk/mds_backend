const mysql = require('mysql2');

require('dotenv').config();
const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
});
connection.connect((err => {
    if(err) throw err;
    console.log('Connected');
}));

exports.databaseConnection = connection;