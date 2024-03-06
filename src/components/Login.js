import React, { useState } from "react";
import Header from "./Header";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Add this line to handle success message

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
        // Ensure the URL matches your backend endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Login successful"); // Display success message or handle user redirection
        console.log("Login success:", data);
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
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}{" "}
        {/* Display success message */}
        <button type="submit">Login</button>
      </form>
    </>
  );
}

export default Login;
