<<<<<<< HEAD
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMode = () => setDarkMode(!darkMode);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className={`edu-navbar ${darkMode ? "dark" : "light"}`}>
      <div className="navbar-left">
        <NavLink to="/" className="logo">
          <i className="fas fa-graduation-cap"></i> WebDev<span>Hub</span>
        </NavLink>
      </div>

      <div className={`navbar-center ${menuOpen ? "open" : ""}`}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/codepad">CodePad</NavLink>
        <NavLink to="/tutorial">Learn</NavLink>
        <NavLink to="/resources">Resources</NavLink>
        <NavLink to="/interview-prep">Prep</NavLink>
        <NavLink to="/community">Community</NavLink>
        <NavLink to="/devchallenges">Challenges</NavLink>
        <NavLink to="/project-idea">Project Ideas</NavLink>

      </div>

      <div className="navbar-right">
        <div className="search-box">
          <input type="text" placeholder="Search" />
          <i className="fas fa-search"></i>
        </div>
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
=======
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMode = () => setDarkMode(!darkMode);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className={`edu-navbar ${darkMode ? "dark" : "light"}`}>
      <div className="navbar-left">
        <NavLink to="/" className="logo">
          <i className="fas fa-graduation-cap"></i> WebDev<span>Hub</span>
        </NavLink>
      </div>

      <div className={`navbar-center ${menuOpen ? "open" : ""}`}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/codepad">CodePad</NavLink>
        <NavLink to="/tutorial">Learn</NavLink>
        <NavLink to="/resources">Resources</NavLink>
        <NavLink to="/interview-prep">Prep</NavLink>
        <NavLink to="/community">Community</NavLink>
        <NavLink to="/devchallenges">Challenges</NavLink>
        <NavLink to="/project-idea">Project Ideas</NavLink>

      </div>

      <div className="navbar-right">
        <div className="search-box">
          <input type="text" placeholder="Search" />
          <i className="fas fa-search"></i>
        </div>
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
>>>>>>> 9b2d469fd6f28892b7277d47845433741d5b49ba
