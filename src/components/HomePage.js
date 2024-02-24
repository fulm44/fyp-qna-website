// src/components/HomePage.js
import React from "react";
import "../styles/HomePage.css";
import logo from "../images/Lecture Loop logo - transparent.png"; // path to logo

const HomePage = () => {
  return (
    <div className="homePage">
      <header className="header">
        <img src={logo} alt="Lecture Loop Logo" className="logo" />
        <h1 className="title">Lecture Loop</h1>
        <div className="buttons">
          <button className="register-button">Register</button>
          <button className="login-button">Login</button>
        </div>
      </header>
      <section className="aboutSection">
        <p>
          This is where you can explore and participate in QnA for your courses.
          Get answers, share knowledge, and connect with peers and educators.
        </p>
      </section>
      <section className="hero">
        <h2>Connect, Learn, and Succeed Together</h2>
        <p>Join your module's community and interact with each other!</p>
      </section>
      <section className="features">
        <h2>How It Works</h2>
        <p>Simple steps to engage with your academic community:</p>
        <ol>
          <li>Sign up with your student email and join your course group.</li>
          <li>Post your questions and contribute answers.</li>
          <li>Collaborate with peers and educators.</li>
        </ol>
      </section>
      <footer className="site-footer">
        <nav>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
        </nav>
      </footer>
    </div>
  );
};

export default HomePage;
