let mysql = require('mysql');

const config = {
    host: "localhost",
    user : "root",
    password : "bluetie@123",
    database : "sys",
    port : 9980
}

var connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

connection.connect((err) => {
    if (err) throw err;

    console.log('MySQL connection is establised')
})

module.exports = connection;