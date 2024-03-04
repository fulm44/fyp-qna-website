require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3006; // Use the port from environment variables or default to 3006

// Middleware setup
app.use(cors());
app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Registration endpoint
app.post("/register", async (req, res) => {
  const { username, password, email, course } = req.body;

  // Basic validation
  if (!username || !password || !email || !course) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    // Check for existing user with the same username or email
    const [users] = await pool
      .promise()
      .query("SELECT * FROM users WHERE username = ? OR email = ?", [
        username,
        email,
      ]);
    if (users.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Username or email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool
      .promise()
      .query(
        "INSERT INTO users (username, email, password_hash, course, created_at) VALUES (?, ?, ?, ?, NOW())",
        [username, email, hashedPassword, course]
      );
    res.json({ success: true, message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Database error.",
        error: error.message,
      });
  }
});

// Define a simple route for the root URL
app.get("/", (req, res) => {
  res.send("Backend server is running...");
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
