import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Register from "./components/Register";
import Login from "./components/Login";
import QnAPage from "./components/QnAPage";
import QuestionForm from "./components/QuestionForm";
import React, { useState } from "react";
import { UserProvider } from "./context/UserContext"; // Adjust path as necessary

function App() {
  const [user, setUser] = useState(null);
  const handleLogout = () => {
    setUser(null);
  };
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/qna" element={<QnAPage />} />
          <Route path="/ask-question" element={<QuestionForm />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
