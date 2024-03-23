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

  const fetchQuestionAndAnswers = async () => {
    try {
      const questionResponse = await fetch(
        `http://localhost:3006/questions/${questionId}`
      );
      if (!questionResponse.ok)
        throw new Error("Failed to fetch question details");
      const questionData = await questionResponse.json();
      setQuestion(questionData);

      const answersResponse = await fetch(
        `http://localhost:3006/questions/${questionId}/answers`
      );
      if (!answersResponse.ok) throw new Error("Failed to fetch answers");
      const answersData = await answersResponse.json();
      setAnswers(answersData);
    } catch (error) {
      console.error("Failed to fetch question and answers:", error.message);
    }
  };

  useEffect(() => {
    fetchQuestionAndAnswers();
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
          userId: user.userId,
          body: newAnswer,
        }),
      });

      if (!response.ok) {
        const resBody = await response.json();
        throw new Error(resBody.message || "Failed to submit answer");
      }

      setNewAnswer("");

      // Refetch question and answers to update the UI
      fetchQuestionAndAnswers();
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
                    <p>User: {answer.answererUsername}</p>
                    <p>{answer.body}</p>
                    <p>Time posted: {answer.createdAt}</p>
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
