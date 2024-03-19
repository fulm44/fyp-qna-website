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
      .query("SELECT courseId FROM courses WHERE courseName = ?", [courseName]);
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
        "INSERT INTO users (username, email, passwordHash, courseId, createdAt) VALUES (?, ?, ?, ?, NOW())",
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
    const [users] = await pool
      .promise()
      .query("SELECT * FROM users WHERE username = ?", [username]);

    if (users.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    const user = users[0];

    // Corrected to use the updated column name
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (passwordMatch) {
      res.json({
        success: true,
        message: "Login successful",
        user: {
          username: user.username,
          userId: user.userId,
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

app.get("/questions", async (req, res) => {
  try {
    const [questions] = await pool.promise().query(`
      SELECT q.questionId, q.title, q.body, q.createdAt, u.username 
      FROM questions q
      JOIN users u ON q.userId = u.userId
      ORDER BY q.createdAt DESC
    `);
    res.json(questions);
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/submit-question", async (req, res) => {
  const { userId, title, body, courseId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "UserId is required" });
  } else if (!title) {
    return res.status(400).json({ message: "Title is required" });
  } else if (!body) {
    return res.status(400).json({ message: "Body is required" });
  } else if (!courseId) {
    return res.status(400).json({ message: "CourseId is required" });
  }

  try {
    await pool
      .promise()
      .query(
        "INSERT INTO questions (userId, title, body, createdAt, courseId) VALUES (?, ?, ?, NOW(), ?)",
        [userId, title, body, courseId]
      );

    res.json({ message: "Question submitted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error submitting question", error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Backend server is running...");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
