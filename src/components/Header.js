import React, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../images/Lecture Loop logo - transparent.png";
import UserContext from "../context/UserContext"; // Adjust the import path as necessary

const Header = () => {
  const { user, logout } = useContext(UserContext); // Destructure logout if provided by your context

  return (
    <header className="header">
      <Link to="/">
        <img src={logo} alt="Lecture Loop Logo" className="logo" />
      </Link>
      <h1 className="title">Lecture Loop</h1>
      <div className="buttons">
        {user ? (
          <>
            <span>Welcome, {user.username}</span>
            <button onClick={logout}>Logout</button>{" "}
            {/* Use logout from context */}
          </>
        ) : (
          <>
            <Link to="/register" className="register-button">
              Register
            </Link>
            <Link to="/login" className="login-button">
              Login
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
