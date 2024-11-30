import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const navigateHome = () =>{
    navigate('/');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/login", {
        Email: email,
        Password: password,
      });
      console.log("after post")
      const user = response.data.user;
      // Navigate to the user's home page
      navigate(`/home/${user.ID}`);
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <img
          src={`${process.env.PUBLIC_URL}/favicon.png`}
          alt="WorkConnect logo"
          style={{ width: "200px", height: "200px" }}
          className="favicon-image"
          onClick={navigateHome}
        />
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="login-button">
          Log In
        </button>
        <br />
        <br />
        <span><a href="./create">New User?</a></span>
        <br />
        <br />
        <span><a href="./forgot">Forgot Username/Password?</a></span>
      </form>
    </div>
  );
};

export default LoginPage;
