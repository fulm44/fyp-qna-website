require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.post("/register", async (req, res) => {
  const { username, password, email, courseName } = req.body;
  console.log("Received registration request with:", req.body);

  if (!username || !password || !email || !courseName) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    const [courseResult] = await pool
      .promise()
      .query("SELECT course_id FROM courses WHERE course_name = ?", [
        courseName,
      ]);
    if (courseResult.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }
    const courseId = courseResult[0].course_id;

    const [userExists] = await pool
      .promise()
      .query("SELECT * FROM users WHERE username = ? OR email = ?", [
        username,
        email,
      ]);
    if (userExists.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Username or email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool
      .promise()
      .query(
        "INSERT INTO users (username, email, password_hash, course_id, created_at) VALUES (?, ?, ?, ?, NOW())",
        [username, email, hashedPassword, courseId]
      );
    res.json({ success: true, message: "User registered successfully." });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      success: false,
      message: "Database error.",
      error: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    // Query database for user
    const [users] = await pool
      .promise()
      .query("SELECT * FROM users WHERE username = ?", [username]);

    if (users.length === 0) {
      // No user found with the provided username
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    const user = users[0];

    // Check if the provided password matches the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (passwordMatch) {
      // Password matches, login successful
      // Optionally, you can generate a token here if you're using JWT for authentication

      res.json({
        success: true,
        message: "Login successful",
        // Send back username or other user info you might need in your application
        username: user.username,
      });
    } else {
      // Password does not match
      res.status(401).json({ success: false, message: "Invalid credentials." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

app.get("/", (req, res) => {
  res.send("Backend server is running...");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
