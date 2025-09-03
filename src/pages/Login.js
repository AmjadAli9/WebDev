import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      setError("No account found with this email.");
      return;
    }

    if (user.password !== password) {
      setError("Incorrect password.");
      return;
    }

    // ✅ Save session data
    localStorage.setItem(
      "webdevhub_user",
      JSON.stringify({ email: user.email, name: user.name || "" })
    );
    localStorage.setItem("isLoggedIn", "true");

    navigate("/home");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Login to continue to WebDevHub</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <p className="login-footer">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}
