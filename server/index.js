require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = 3001;

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: process.env.DB_USER, // Use environment variable
  password: process.env.DB_PASSWORD, // Use environment variable
  database: process.env.DB_NAME, // Use environment variable
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Simple route to test the database connection
app.get("/test-db", (req, res) => {
  pool.query("SELECT 1 + 1 AS solution", (error, results) => {
    if (error) throw error;
    res.send(`The solution is: ${results[0].solution}`);
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
