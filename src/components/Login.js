import React, { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
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
    // Here, implement your logic for verifying login credentials
    console.log("Login attempt with:", username, password);
  };

  return (
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
  );
}

export default Login;
