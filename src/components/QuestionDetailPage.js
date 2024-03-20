import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import "../styles/QuestionDetailPage.css";
import UserContext from "../context/UserContext";

const QuestionDetailPage = () => {
  const [question, setQuestion] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const { questionId } = useParams();
  const { user } = useContext(UserContext);

  // Define fetchQuestionDetails as a standalone function
  const fetchQuestionDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3006/questions/${questionId}`
      );
      if (!response.ok) throw new Error("Failed to fetch question details");
      const questionData = await response.json();
      setQuestion(questionData);
      // setAnswers(questionData.answers || []); // Uncomment when ready to use
    } catch (error) {
      console.error("Failed to fetch question details:", error.message);
    }
  };

  useEffect(() => {
    fetchQuestionDetails();
  }, [questionId]);

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3006/questions/${questionId}`
        );
        if (!response.ok) throw new Error("Failed to fetch question details");
        const questionData = await response.json();
        setQuestion(questionData);
        // Assuming you'll later modify your endpoint to also fetch answers:
        // setAnswers(questionData.answers || []);
      } catch (error) {
        console.error("Failed to fetch question details:", error.message);
      }
    };

    fetchQuestionDetails();
  }, [questionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    try {
      const response = await fetch("http://localhost:3006/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include authentication token if needed
        },
        body: JSON.stringify({
          questionId: questionId,
          userId: user.userId, // Ensure you have user ID available in your user context
          title: "Answer title", // Modify as needed. If your answers don't have titles, adjust accordingly.
          body: newAnswer,
        }),
      });

      if (!response.ok) {
        // You can get more details from the response body if needed
        const resBody = await response.json();
        throw new Error(resBody.message || "Failed to submit answer");
      }

      // Optionally, you can clear the form fields here if you want
      setNewAnswer("");

      // Fetch question details again to update answers. You might need to adjust this if your API doesn't return updated answers immediately.
      fetchQuestionDetails();
    } catch (error) {
      console.error("Error submitting answer:", error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="question-detail-page">
        {question ? (
          <>
            <div className="question-section">
              <h2>{question.title}</h2>
              <p>{question.body}</p>
            </div>
            <form onSubmit={handleSubmit} className="answer-form">
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Write your answer here..."
                required
              />
              <button type="submit">Submit Answer</button>
            </form>
            <div className="answers-section">
              <h3>Answers:</h3>
              {answers.length > 0 ? (
                answers.map((answer, index) => (
                  <div key={index} className="answer">
                    <p>{answer.text}</p>
                    {/* Display additional answer details here */}
                  </div>
                ))
              ) : (
                <p>No answers yet. Be the first to answer!</p>
              )}
            </div>
          </>
        ) : (
          <p>Loading question...</p>
        )}
      </div>
    </>
  );
};

export default QuestionDetailPage;
