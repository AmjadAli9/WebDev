import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Loading.css";

const Loading = () => {
  const navigate = useNavigate();
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFeatures(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/signup");

  return (
    <div className="loading-page">
      <div className="loading-container">
        <h1 className="title">🚀 Welcome to <span className="highlight">WebDev-Hub</span></h1>
        <p className="intro">
          Imagine building your dream house. 🏡<br />
          <strong>Programming</strong> is like learning how to use the tools — bricks, wood, paint — to bring your ideas to life.<br />
          At WebDev-Hub, we guide you step by step from your first nail ⚒️ to your complete masterpiece. 🎯
        </p>

        <div className="loader"></div>

        {showFeatures && (
          <div className="features">
            <h2>Why you'll love WebDev-Hub 💻</h2>
            <ul>
              <li>🌱 <strong>Beginner-friendly</strong>: Start with zero knowledge.</li>
              <li>🧩 <strong>Step-by-step learning</strong>: From HTML basics to full-stack apps.</li>
              <li>🛠 <strong>Real-time tools</strong>: Build and test projects instantly.</li>
              <li>🚢 <strong>Deployment made simple</strong>: Launch your site with one click.</li>
              <li>🤝 <strong>Community support</strong>: Learn, share, and grow together.</li>
            </ul>
          </div>
        )}

        <div className="auth-buttons">
          <button className="login-btn" onClick={handleLogin}>🔑 Login</button>
          <button className="signup-btn" onClick={handleSignup}>🆕 Sign Up</button>
        </div>

        <footer className="footer-note">
          <p>💡 Tip: Don't worry if this is your first time. We've got your back every step of the way!</p>
        </footer>
      </div>
    </div>
  );
};

export default Loading;
