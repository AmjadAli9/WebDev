// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom"; // ✅ No BrowserRouter here
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import CodePad from "./pages/codepad";
import Tutorial from "./pages/Tutorial";
import Resources from "./pages/Resources";
import InterviewPrep from "./pages/InterviewPrep";
import Community from "./pages/Community";
import DevChallenges from "./pages/DevChallenges";
import ProjectIdea from "./pages/ProjectIdea"; 
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/codepad" element={<CodePad />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/interview-prep" element={<InterviewPrep />} />
        <Route path="/community" element={<Community />} />
        <Route path="/devchallenges" element={<DevChallenges />} />
        <Route path="/project-idea" element={<ProjectIdea />} />             

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
