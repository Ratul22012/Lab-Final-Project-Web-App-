const mysql = require("mysql2");

// Connect without selecting a database first
const connection = mysql.createConnection({
    host: "localhost",
    user: "Atif",
    password: "arpita"
});

connection.connect(err => {
    if (err) {
        console.error("LOGIN FAILED. details:", err.message);
        process.exit(1);
    }
    console.log("LOGIN SUCCESSFUL! User and password are correct.");

    // Try to create the database
    connection.query("CREATE DATABASE IF NOT EXISTS typing_test", (err, result) => {
        if (err) {
            console.error("COULD NOT CREATE DATABASE 'typing_test'. Error:", err.message);
            console.log("Suggestion: You might need to log in as 'root' to create the database or grant permissions to 'Atif'.");
        } else {
            console.log("Database 'typing_test' ensured.");
            
            // Now try to select it to be sure
            connection.query("USE typing_test", (err) => {
                if(err) {
                    console.error("COULD NOT USE DATABASE. Error:", err.message);
                } else {
                    console.log("Successfully connected to 'typing_test' database!");
                }
                connection.end();
            });
        }
    });
});
