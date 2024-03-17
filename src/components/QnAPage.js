import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useUser } from "../context/UserContext";
import "../styles/QnAPage.css"; // Make sure this path is correct

function QnAPage() {
  const [questionsList, setQuestionsList] = useState([]);
  const { user } = useUser();

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

  // This function might be for opening a modal or redirecting to a question asking page
  const handleAskQuestion = () => {
    console.log("Ask question clicked");
    // Implement navigation to question asking form/page or modal opening
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
              <tr key={question.question_id}>
                <td>{question.title}</td>
                <td>{question.body}</td>
                <td>{question.username}</td>{" "}
                <td>{new Date(question.createdAt).toLocaleString()}</td>{" "}
                {/* Use createdAt */}{" "}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QnAPage;
