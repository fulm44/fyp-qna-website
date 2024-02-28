import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/Lecture Loop logo - transparent.png";

const Header = () => {
  return (
    <header className="header">
      <Link to="/">
        <img src={logo} alt="Lecture Loop Logo" className="logo" />
      </Link>
      <h1 className="title">Lecture Loop</h1>
      <div className="buttons">
        <Link to="/register" className="register-button">
          Register
        </Link>
        <Link to="/login" className="login-button">
          Login
        </Link>
      </div>
    </header>
  );
};

export default Header;
