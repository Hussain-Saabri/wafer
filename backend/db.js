// db.js
const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "to_do_db",
});


(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Connected to Database!");
    connection.release(); 
  } catch (err) {
    console.error("Error connecting to MySQL:", err);
  }
})();

module.exports = db;
