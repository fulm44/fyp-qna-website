import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import SearchBar from "./SearchBar";
import { useUser } from "../context/UserContext";
import "../styles/QnAPage.css";

function QnAPage() {
  const [questionsList, setQuestionsList] = useState([]);
  const { user } = useUser();
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    if (user?.courseId) {
      try {
        const response = await fetch(
          `http://localhost:3006/questions?courseId=${user.courseId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        setQuestionsList(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
  };

  const handleSearch = async (query) => {
    if (query.length === 0) {
      fetchQuestions();
    } else {
      try {
        const searchUrl = `http://localhost:3006/search?query=${encodeURIComponent(
          query
        )}&courseId=${user.courseId}`;
        const response = await fetch(searchUrl);
        if (!response.ok) {
          throw new Error("Search failed");
        }
        const results = await response.json();
        setQuestionsList(results);
      } catch (error) {
        console.error("Error performing search:", error);
      }
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [user?.courseId]);

  return (
    <div className="qna-page">
      <Header />
      <h1 className="title">Questions and Answers</h1>
      {user && (
        <button
          className="ask-button"
          onClick={() => navigate("/ask-question")}
        >
          Ask Question
        </button>
      )}
      <SearchBar onSearch={handleSearch} />
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
              <tr
                key={question.questionId}
                onClick={() => navigate(`/questions/${question.questionId}`)}
                style={{ cursor: "pointer" }}
              >
                <td className="clickable-title">{question.title}</td>
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
