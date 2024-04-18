import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import Header from "./Header";

const QuestionForm = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!title || !body) {
      setError("Both title and body are required");
      return;
    }
    if (!user.userId) {
      setError("User ID is missing. Please login again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3006/submit-question", { // API call
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userId: user.userId, 
          title,
          body,
          courseId: user.courseId,
        }),
      });

      if (!response.ok) {
        const resBody = await response.json();
        throw new Error(resBody.message || "Failed to post question");
      }

      // clear the form fields here if you want
      setTitle("");
      setBody("");

      // Redirect to QnA page
      navigate("/qna");
    } catch (error) {
      console.error("Error submitting question:", error);
      setError(error.message);
    }
  };

  return (
    <>
      <Header />
      <div>
        <h2>Submit Your Question</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label>Question:</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
          <button type="submit">Submit Question</button>
        </form>
      </div>
    </>
  );
};

export default QuestionForm;
