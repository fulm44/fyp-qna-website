import React, { useState, useContext } from "react"; // Import useContext
import Header from "./Header";
import { useNavigate } from "react-router-dom";
// Import your UserContext
import UserContext from "../context/UserContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Use UserContext to set user data
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message
    if (!username) {
      setErrorMessage("Username cannot be blank");
      return;
    }
    if (!password) {
      setErrorMessage("Password cannot be blank");
      return;
    }

    try {
      const response = await fetch("http://localhost:3006/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);
      if (response.ok) {
        console.log("Login success:", data); //debuggggg
        setUser(data.user);
        navigate("/qna");
      } else {
        throw new Error(data.message || "An error occurred during login.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.toString());
    }
  };

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button type="submit">Login</button>
      </form>
    </>
  );
}

export default Login;
