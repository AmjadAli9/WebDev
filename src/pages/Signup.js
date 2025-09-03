import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = () => {
    if (!name || !email || !password) {
      alert("All fields are required.");
      return;
    }

    // Save all registered users
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    // Save active session
    localStorage.setItem("webdevhub_user", JSON.stringify({ name, email }));
    localStorage.setItem("isLoggedIn", "true");

    navigate("/home");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sign Up</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignup}>Sign Up</button>
        <p onClick={() => navigate("/login")} className="link">
          Already have an account? Login
        </p>
      </div>
    </div>
  );
};

export default Signup;
