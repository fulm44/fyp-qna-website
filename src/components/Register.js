import React, { useState } from "react";
import "../styles/Register.css";
import Header from "./Header";
import "../styles/Header.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [course, setCourse] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

  const validateForm = () => {
    if (!username) {
      setErrorMessage("The username cannot be blank.");
      return false;
    }
    if (!email.includes("@aston.ac.uk")) {
      setErrorMessage(
        "Email provided is not valid. Must end with @aston.ac.uk."
      );
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
    if (!course) {
      setErrorMessage("Course can't be empty.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage(""); // Reset success message
    if (validateForm()) {
      try {
        // Assuming you have a function to make POST requests to your backend
        const response = await fetch("http://localhost:3006/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password, // Ensure your backend handles password encryption
            email,
            course,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Display success message
          setSuccessMessage("Account registered successfully.");
          // Optionally, clear the form or redirect the user
        } else {
          // Handle errors from the server
          setErrorMessage(
            data.message || "An error occurred during registration."
          );
        }
      } catch (error) {
        console.error("Registration error:", error);
        setErrorMessage("An error occurred during registration.");
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="register-form">
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
          <div>
            <label>Course</label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Select your course
              </option>
              <option value="computer_science">Computer Science</option>
              <option value="business">Business</option>
              <option value="maths">Maths</option>
              <option value="english">English</option>
              <option value="engineering">Engineering</option>
              <option value="economics">Economics</option>
              <option value="law">Law</option>
            </select>
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}{" "}
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
