import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCode,
  FaBookOpen,
  FaLayerGroup,
  FaUserGraduate,
  FaUsers,
  FaPuzzlePiece,
  FaLightbulb,
  FaFileAlt,
  FaTools,
  FaPalette,
  FaKeyboard,
  FaBug,
  FaRobot,
  FaImage,
  FaUser,
  FaSearch,
  FaMoon,
  FaSun,
  FaBars,
} from "react-icons/fa";

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
    { name: "Home", path: "/home", icon: <FaHome /> },
    { name: "CodePad", path: "/codepad", icon: <FaCode /> },
    { name: "Learn", path: "/tutorial", icon: <FaBookOpen /> },
    { name: "Resources", path: "/resources", icon: <FaLayerGroup /> },
    { name: "Prep", path: "/interview-prep", icon: <FaUserGraduate /> },
    { name: "Community", path: "/community", icon: <FaUsers /> },
    { name: "Challenges", path: "/devchallenges", icon: <FaPuzzlePiece /> },
    { name: "Project Ideas", path: "/project-idea", icon: <FaLightbulb /> },
    { name: "Resume Builder", path: "/resume-builder", icon: <FaFileAlt /> },
    { name: "Dev Tools", path: "/devtoolspage", icon: <FaTools /> },
    { name: "Design Tools", path: "/designtoolspage", icon: <FaPalette /> },
    { name: "Typing Tester", path: "/typingspeed", icon: <FaKeyboard /> },
    { name: "Spot The Bug", path: "/spotthebug", icon: <FaBug /> },
    { name: "AI Resources", path: "/ai-resource", icon: <FaRobot /> },
    { name: "Tutor", path: "/tutor", icon: <FaImage /> },
    {
      name: userName ? `${userName}'s Profile` : "Profile",
      path: "/profile",
      icon: <FaUser />,
    },
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
      <div className={`navbar-center ${menuOpen ? "open" : ""}`}>
        {pages.map((page, index) => (
          <NavLink
            key={index}
            to={page.path}
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-icon">{page.icon}</span>
            <span className="nav-label">{page.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="navbar-right">
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>

        <button onClick={toggleMode} className="toggle-mode">
          {darkMode ? <FaMoon /> : <FaSun />}
        </button>

        <div className="hamburger" onClick={toggleMenu}>
          <FaBars />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
