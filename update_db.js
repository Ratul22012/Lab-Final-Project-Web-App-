const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ratul",
    database: "typing_test"
});

connection.connect(err => {
    if (err) {
        console.error("Connection failed:", err.message);
        process.exit(1);
    }
    console.log("Connected to database.");

    const alterQueryV1 = "ALTER TABLE scores ADD COLUMN cpm INT DEFAULT 0";
    const alterQueryV2 = "ALTER TABLE scores ADD COLUMN verdict VARCHAR(50) DEFAULT 'N/A'";

    connection.query(alterQueryV1, (err) => {
        if (err && err.code !== 'ER_DUP_FIELDNAME') {
            console.error("Failed to add cpm column:", err.message);
        } else {
            console.log("cpm column added (or already exists).");
        }

        connection.query(alterQueryV2, (err) => {
            if (err && err.code !== 'ER_DUP_FIELDNAME') {
                console.error("Failed to add verdict column:", err.message);
            } else {
                console.log("verdict column added (or already exists).");
            }
            connection.end();
            process.exit(0);
        });
    });
});
