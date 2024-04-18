import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/Lecture Loop logo - transparent.png";
import UserContext from "../context/UserContext";

const Header = () => {
  const { user, logout } = useContext(UserContext); // Destructure logout if provided by your context
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const handleLogoClick = () => {
    if (user) {
      navigate("/qna");
    } else {
      navigate("/");
    }
  };

  return (
    <header className="header">
      <div onClick={handleLogoClick} style={{ cursor: "pointer" }}>
        <img src={logo} alt="Lecture Loop Logo" className="logo" />
      </div>

      <h1 className="title">Lecture Loop</h1>
      <div className="buttons">
        {user ? (
          <>
            <span>Welcome {user.username}</span>
            <button onClick={handleLogout}>Logout</button>{" "}
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
