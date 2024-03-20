import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useUser } from "../context/UserContext";
import "../styles/QnAPage.css";
import { useNavigate } from "react-router-dom";

function QnAPage() {
  const [questionsList, setQuestionsList] = useState([]);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:3006/questions", {
          headers: {
            // If you have authentication, pass your token in headers
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        setQuestionsList(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAskQuestion = () => {
    console.log("Ask question clicked");
    navigate("/ask-question");
  };

  return (
    <div className="qna-page">
      <Header />
      <h1 className="title">Questions and Answers</h1>
      {user && (
        <button className="ask-button" onClick={handleAskQuestion}>
          Ask Question
        </button>
      )}
      <div className="questions-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Question</th>
              <th>Asked By</th>
              <th>Asked On</th>
            </tr>
          </thead>
          <tbody>
            {questionsList.map((question) => (
              <tr key={question.questionId}>
                <td
                  className="clickable-title"
                  onClick={() => navigate(`/questions/${question.questionId}`)}
                  style={{ cursor: "pointer" }}
                >
                  {question.title}
                </td>
                <td>{question.body}</td>
                <td>{question.username}</td>
                <td>{new Date(question.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QnAPage;
