// src/pages/Navbar.js
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("webdevhub_user"));
    if (user?.name) {
      setUserName(user.name);
    }
  }, []);

  const pages = [
    { name: "Home", path: "/home" },
    { name: "CodePad", path: "/codepad" },
    { name: "Learn", path: "/tutorial" },
    { name: "Resources", path: "/resources" },
    { name: "Prep", path: "/interview-prep" },
    { name: "Community", path: "/community" },
    { name: "Challenges", path: "/devchallenges" },
    { name: "Project Ideas", path: "/project-idea" },
    { name: "Resume Builder", path: "/resume-builder" },
    { name: "Portfolio Generator", path: "/portfolio-generator" },
    { name: "Dev Tools", path: "/devtoolspage" },
    { name: "Design Tools", path: "/designtoolspage" },
    { name: "Typing Tester", path: "/typingspeed" },
    { name: "Spot The Bug", path: "/spotthebug" },
    { name: userName ? `${userName}'s Profile` : "Profile", path: "/profile" }, // New Profile Link
  ];

  const toggleMode = () => setDarkMode(!darkMode);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleSearch = (e) => {
    e.preventDefault();
    const match = pages.find((page) =>
      page.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (match) {
      navigate(match.path);
      setSearchTerm("");
    } else {
      alert("Page not found!");
    }
  };

  return (
    <nav className={`edu-navbar ${darkMode ? "dark" : "light"}`}>
      {/* Center links */}
      <div className={`navbar-center ${menuOpen ? "open" : ""}`}>
        {pages.map((page, index) => (
          <NavLink key={index} to={page.path}>
            {page.name}
          </NavLink>
        ))}
      </div>

      {/* Right side */}
      <div className="navbar-right">
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <i className="fas fa-search"></i>
          </button>
        </form>

        <button onClick={toggleMode} className="toggle-mode">
          {darkMode ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
        </button>

        <div className="hamburger" onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
