import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Loading from "./pages/Loading";
import Profile from "./pages/Profile";
import CodePad from "./pages/codepad";
import Tutorial from "./pages/Tutorial";
import Resources from "./pages/Resources";
import InterviewPrep from "./pages/InterviewPrep";
import Community from "./pages/Community";
import DevChallenges from "./pages/DevChallenges";
import ProjectIdea from "./pages/ProjectIdea";
import ResumeBuilder from "./pages/ResumeBuilder";
import DevToolsPage from "./pages/DevToolsPage";
import DesignToolsPage from "./pages/DesignToolsPage";
import TypingSpeed from "./pages/TypingSpeed";
import SpotTheBug from "./pages/SpotTheBug";
import Tutor from "./pages/Tutor";
import ResourceRecommender from "./pages/AI Resource";
import "./App.css";
import { ProtectedRoute } from "./utils/auth";

function App() {
  const withNavbar = (Component) => (
    <>
      <Navbar />
      <Component />
    </>
  );

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Loading />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={<ProtectedRoute>{withNavbar(Home)}</ProtectedRoute>}
      />
      <Route
        path="/profile"
        element={<ProtectedRoute>{withNavbar(Profile)}</ProtectedRoute>}
      />
      <Route
        path="/codepad"
        element={<ProtectedRoute>{withNavbar(CodePad)}</ProtectedRoute>}
      />
      <Route
        path="/tutorial"
        element={<ProtectedRoute>{withNavbar(Tutorial)}</ProtectedRoute>}
      />
      <Route
        path="/resources"
        element={<ProtectedRoute>{withNavbar(Resources)}</ProtectedRoute>}
      />
      <Route
        path="/interview-prep"
        element={<ProtectedRoute>{withNavbar(InterviewPrep)}</ProtectedRoute>}
      />
      <Route
        path="/community"
        element={<ProtectedRoute>{withNavbar(Community)}</ProtectedRoute>}
      />
      <Route
        path="/devchallenges"
        element={<ProtectedRoute>{withNavbar(DevChallenges)}</ProtectedRoute>}
      />
      <Route
        path="/project-idea"
        element={<ProtectedRoute>{withNavbar(ProjectIdea)}</ProtectedRoute>}
      />
      <Route
        path="/resume-builder"
        element={<ProtectedRoute>{withNavbar(ResumeBuilder)}</ProtectedRoute>}
      />
      <Route
        path="/devtoolspage"
        element={<ProtectedRoute>{withNavbar(DevToolsPage)}</ProtectedRoute>}
      />
      <Route
        path="/designtoolspage"
        element={<ProtectedRoute>{withNavbar(DesignToolsPage)}</ProtectedRoute>}
      />
      <Route
        path="/typingspeed"
        element={<ProtectedRoute>{withNavbar(TypingSpeed)}</ProtectedRoute>}
      />
      <Route
        path="/spotthebug"
        element={<ProtectedRoute>{withNavbar(SpotTheBug)}</ProtectedRoute>}
      />
      <Route
        path="/ai-resource"
        element={
          <ProtectedRoute>{withNavbar(ResourceRecommender)}</ProtectedRoute>
        }
      />
      <Route
        path="/tutor"
        element={<ProtectedRoute>{withNavbar(Tutor)}</ProtectedRoute>}
      />

      {/* Fallback */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;
