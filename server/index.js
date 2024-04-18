require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt"); // encrypts password babyyyy
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

// pool to handle database connections
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// register endpoint
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
    const courseId = courseResult[0].courseId; // Corrected to match the actual property name

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

  const [courseResult] = await pool
    .promise()
    .query("SELECT courseId FROM courses WHERE courseName = ?", [courseName]);
  console.log(courseResult); // Add this line to log the result
});

//login endpoint
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
          courseId: user.courseId,
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

// Fetch quesitons endpoint
app.get("/questions", async (req, res) => {
  const { courseId } = req.query; // Fetch courseId from query params

  try {
    // Fetch questions based on the user's course ID
    const [questions] = await pool.promise().query(
      `
      SELECT q.questionId, q.title, q.body, q.createdAt, u.username 
      FROM questions q
      JOIN users u ON q.userId = u.userId
      WHERE q.courseId = ?
      ORDER BY q.createdAt DESC
    `,
      [courseId]
    );

    res.json(questions);
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Submit question endpoint
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

// Fetch question by ID endpoint
app.get("/questions/:questionId", async (req, res) => {
  const { questionId } = req.params;

  try {
    const [questions] = await pool.promise().query(
      `
      SELECT q.questionId, q.title, q.body, q.createdAt, u.username, q.courseId
      FROM questions q
      JOIN users u ON q.userId = u.userId
      WHERE q.questionId = ?
    `,
      [questionId]
    );

    if (questions.length === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(questions[0]);
  } catch (error) {
    console.error("Failed to fetch question:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Submit answer endpoint
app.post("/answers", async (req, res) => {
  const { questionId, userId, body } = req.body;

  // Log received fields for debugging
  console.log("Received fields:", { questionId, userId, body });

  // Ensure all required fields are provided
  if (!questionId || !userId || !body) {
    return res
      .status(400)
      .json({ message: "Question ID, User ID, and Body are required." });
  }

  try {
    // Insert the new answer into the database without the title field
    await pool
      .promise()
      .query(
        "INSERT INTO answers (questionId, userId, body, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())",
        [questionId, userId, body]
      );

    // Respond with a success message
    res.json({ message: "Answer submitted successfully" });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Fetch answers for a specific question
app.get("/questions/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;

  try {
    // Query to select answers for a specific question and calculate scores
    const [answers] = await pool.promise().query(
      `SELECT a.answerId, a.body, a.createdAt, u.username AS answererUsername,
      COALESCE(SUM(v.voteType), 0) AS score
      FROM answers a
      LEFT JOIN users u ON a.userId = u.userId
      LEFT JOIN votes v ON a.answerId = v.answerId
      WHERE a.questionId = ?
      GROUP BY a.answerId
      ORDER BY a.createdAt DESC`,
      [questionId]
    );
    console.log("answers", answers);
    res.json(answers);
  } catch (error) {
    console.error("Failed to fetch answers:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Search endpoint
app.get("/search", async (req, res) => {
  const { query, courseId } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query is required" });
  }

  try {
    const [results] = await pool.promise().query(
      `SELECT questionId, title, questions.body, questions.createdAt, users.username 
        FROM questions JOIN users ON questions.userId = users.userId 
        WHERE title LIKE ? AND questions.courseId = ? 
        ORDER BY questions.createdAt DESC
`,
      [`%${query}%`, courseId]
    );

    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res
      .status(500)
      .json({ message: "Error performing search", error: error.message });
  }
});
 
// Vote endpoint
app.post("/vote", async (req, res) => {
  const { userId, answerId, voteType } = req.body;

  console.log(`Received vote:`, req.body); // Debug: Confirm received data

  try {
    const existingVoteQuery =
      "SELECT voteId FROM votes WHERE userId = ? AND answerId = ?";
    const [existingVote] = await pool
      .promise()
      .query(existingVoteQuery, [userId, answerId]);

    let sql, values;

    if (existingVote.length > 0) {
      console.log(
        `Updating existing vote: AnswerID: ${answerId}, UserID: ${userId}, VoteType: ${voteType}`
      );
      sql = "UPDATE votes SET voteType = ? WHERE userId = ? AND answerId = ?";
      values = [voteType, userId, answerId];
    } else {
      console.log(
        `Inserting new vote: AnswerID: ${answerId}, UserID: ${userId}, VoteType: ${voteType}`
      );
      sql = "INSERT INTO votes (userId, answerId, voteType) VALUES (?, ?, ?)";
      values = [userId, answerId, voteType];
    }

    await pool.promise().query(sql, values);
    res.json({ success: true, message: "Vote recorded" });
  } catch (error) {
    console.error("SQL Error:", error); // Debug: Log SQL errors
    res.status(500).json({
      success: false,
      message: "Error recording vote",
      error: error.message,
    });
  }
});


//checking server is running
app.get("/", (req, res) => {
  res.send("Backend server is running...");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
