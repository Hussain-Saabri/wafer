const mysql = require("mysql2");
const db = mysql.createConnection(
    {
        host:"sql12.freesqldatabase.com",
        user:"sql12805658",
        password:"gJR4E4cfQt",
        database:"sql12805658"
    }


)

db.connect((err) => {
  if (err) {
    console.log("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to Database!");
  }
});

module.exports = db;