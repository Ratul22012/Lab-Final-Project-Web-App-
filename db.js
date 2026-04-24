const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "Atif",
    password: "arpita", 
    database: "typing_test"
});

db.connect(err => {
    if(err) throw err;
    console.log("MySQL Connected...");
});

module.exports = db;
