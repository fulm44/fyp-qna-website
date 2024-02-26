import React, { useState } from "react";
import "../styles/Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to hold the error message

  const validateForm = () => {
    if (!username) {
      setErrorMessage("The username cannot be blank.");
      return false;
    }
    if (!email.includes("@")) {
      setErrorMessage("Email provided is not valid.");
      return false;
    }
    if (!password) {
      setErrorMessage("Password is empty.");
      return false;
    }
    if (!confirmPassword) {
      setErrorMessage("Confirm password is empty.");
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return false;
    }
    return true; // Form is valid
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any existing error messages
    if (validateForm()) {
      console.log(username, password, email);
      // You might use fetch or axios to POST data to your backend
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <div>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      <div>
        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
