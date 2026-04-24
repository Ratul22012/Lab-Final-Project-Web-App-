const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ratul", 
    database: "typing_test"
});

db.connect(err => {
    if(err) throw err;
    console.log("MySQL Connected...");
});

module.exports = db;
