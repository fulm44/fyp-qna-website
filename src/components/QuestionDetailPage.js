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

  const fetchQuestionAndAnswers = async () => { // Fetch question and answers from the API
    try {
      const questionResponse = await fetch(
        `http://localhost:3006/questions/${questionId}`
      ); // Fetch the question details
      if (!questionResponse.ok)
        throw new Error("Failed to fetch question details");
      const questionData = await questionResponse.json(); 
      setQuestion(questionData); 

      const answersResponse = await fetch(
        `http://localhost:3006/questions/${questionId}/answers`
      );
      if (!answersResponse.ok) throw new Error("Failed to fetch answers");
      const answersData = await answersResponse.json();
      setAnswers(answersData); // Set the answers state
    } catch (error) {
      console.error("Failed to fetch question and answers:", error.message);
    }
  };

  useEffect(() => {
    fetchQuestionAndAnswers();
  }, [questionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return; // prevent submissions of empty answers

    try {
      const response = await fetch("http://localhost:3006/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: questionId,
          userId: user.userId,
          body: newAnswer,
        }),
      });

      if (!response.ok) {
        const resBody = await response.json();
        throw new Error(resBody.message || "Failed to submit answer");
      }

      setNewAnswer("");
      fetchQuestionAndAnswers();
    } catch (error) {
      console.error("Error submitting answer:", error.message);
    }
  };

  const handleVote = async (answerId, voteType) => {
    try {
      const response = await fetch(`http://localhost:3006/vote`, {
        // Ensure correct endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answerId,
          userId: user.userId,
          voteType, // Directly passing voteType (1 or -1) from button click
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit vote");
      }

      fetchQuestionAndAnswers(); // Refresh to show updated vote counts
    } catch (error) {
      console.error("Error submitting vote:", error.message);
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
              <p>{question.username}</p>
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
                answers.map((answer) => (
                  <div key={answer.answerId} className="answer">
                    <p>
                      <strong>{answer.answererUsername}</strong>
                    </p>
                    <p>{answer.body}</p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <p className="answer-date">
                        {new Date(answer.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                      <div className="vote-buttons">
                        <button
                          onClick={() => handleVote(answer.answerId, 1)} // Pass 1 for upvote
                          className="vote-button"
                        >
                          👍
                        </button>
                        <span className="vote-score">{answer.score}</span>
                        <button
                          onClick={() => handleVote(answer.answerId, -1)} // Pass -1 for downvote
                          className="vote-button"
                        >
                          👎
                        </button>
                      </div>
                    </div>
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
