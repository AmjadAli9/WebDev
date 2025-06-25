<<<<<<< HEAD
// src/pages/ProjectIdea.jsx
import React, { useState } from "react";
import "./ProjectIdea.css";

// Extended and improved project ideas with techStack
const ideas = [
  {
    title: "AI-Based Code Reviewer",
    category: "AI",
    description: "Develop a tool that reviews your code and gives suggestions using OpenAI or a custom ML model.",
    techStack: ["React", "Node.js", "OpenAI API", "Python (optional)"]
  },
  {
    title: "Frontend Component Library",
    category: "Frontend",
    description: "Create a set of reusable UI components using React + Tailwind and publish it as an NPM package.",
    techStack: ["React", "Tailwind CSS", "Rollup", "NPM"]
  },
  {
    title: "Task Manager with Gamification",
    category: "Fullstack",
    description: "A web app that rewards users with points and badges as they complete tasks, integrated with a backend.",
    techStack: ["React", "Express.js", "MongoDB", "JWT"]
  },
  {
    title: "Online Resume Builder",
    category: "Fullstack",
    description: "Users can input data and choose from multiple templates to generate a professional PDF resume.",
    techStack: ["React", "HTML-to-PDF API", "Node.js"]
  },
  {
    title: "Quiz App with Leaderboards",
    category: "Web + DB",
    description: "A timed quiz application with live scoring, multiplayer option, and leaderboard tracking.",
    techStack: ["React", "Socket.io", "MongoDB", "Express"]
  },
  {
    title: "Weather + News Dashboard",
    category: "Frontend",
    description: "Combines OpenWeather and News API to deliver a dashboard with real-time updates and styling options.",
    techStack: ["HTML", "CSS", "JavaScript", "APIs"]
  },
  {
    title: "Web-Based Markdown Editor",
    category: "Tools",
    description: "Create a clean Markdown editor with live preview and export options.",
    techStack: ["React", "Marked.js", "Download.js"]
  },
  {
    title: "Dev Portfolio Generator",
    category: "Tools",
    description: "Takes user inputs and generates a clean, downloadable developer portfolio with sections and animations.",
    techStack: ["React", "JSX-to-HTML", "Bootstrap"]
  },
  {
    title: "2D Game using Canvas API",
    category: "Games",
    description: "Build a mini-platformer or side-scroller game using just vanilla JS and the Canvas API.",
    techStack: ["JavaScript", "Canvas API"]
  },
  {
    title: "Stock Market Tracker",
    category: "Data/API",
    description: "Track stock prices using a public API, show charts, and let users favorite certain stocks.",
    techStack: ["React", "Chart.js", "Finnhub API"]
  },
  {
    title: "Realtime Chat App",
    category: "Fullstack",
    description: "End-to-end encrypted chat with rooms, emojis, and media support.",
    techStack: ["React", "Node.js", "Socket.io", "MongoDB"]
  },
  {
    title: "AI Meme Generator",
    category: "Fun / AI",
    description: "Automatically generate memes from trending topics using GPT and meme templates.",
    techStack: ["OpenAI API", "Meme Template API", "React"]
  },
  {
    title: "Book Sharing Platform",
    category: "Web App",
    description: "A platform for users to list, borrow, and lend books to each other locally.",
    techStack: ["Next.js", "Firebase", "Tailwind CSS"]
  },
  {
    title: "Study Planner with Pomodoro",
    category: "Productivity",
    description: "Organize study sessions, track time, and use Pomodoro technique with stats.",
    techStack: ["React", "LocalStorage", "Chart.js"]
  },
  {
    title: "Movie Recommendation Engine",
    category: "ML / Entertainment",
    description: "Suggest movies based on user taste using collaborative or content-based filtering.",
    techStack: ["Python", "Scikit-Learn", "Flask", "React"]
  },
  {
    title: "AR Product Preview",
    category: "AR / eCommerce",
    description: "Preview furniture or products using Augmented Reality in the browser.",
    techStack: ["Three.js", "WebXR", "React"]
  },
  {
    title: "Virtual Internship Simulator",
    category: "EdTech",
    description: "Simulate real-world projects with tasks, deadlines, and feedback for beginners.",
    techStack: ["React", "Node.js", "MongoDB", "Socket.io"]
  },
  {
    title: "Voice-Controlled Todo List",
    category: "AI",
    description: "Integrate speech recognition to manage todos using voice commands.",
    techStack: ["Web Speech API", "React", "Redux"]
  },
  {
    title: "Code Snippet Organizer",
    category: "Tools",
    description: "Users can save, tag, and search code snippets with language/category filters.",
    techStack: ["React", "Express.js", "PostgreSQL"]
  },
  {
    title: "Resume Scanner for ATS",
    category: "HR / Tools",
    description: "Scan resumes and score them based on how well they match a given job description.",
    techStack: ["Python", "NLP", "Streamlit or Flask"]
  }
];

const getRandomIdea = (prevTitle) => {
  let idea;
  do {
    idea = ideas[Math.floor(Math.random() * ideas.length)];
  } while (idea.title === prevTitle);
  return idea;
};

function ProjectIdea() {
  const [idea, setIdea] = useState(getRandomIdea(""));

  const handleGenerate = () => {
    setIdea(getRandomIdea(idea.title));
  };

  return (
    <div className="project-idea-page">
      <section className="project-idea-hero">
        <h1>💡 Random Project Idea Generator</h1>
        <p>Get unique and professional project ideas across multiple domains.</p>
      </section>

      <div className="idea-box">
        <h2>{idea.title}</h2>
        <p><strong>Category:</strong> {idea.category}</p>
        <p className="description">{idea.description}</p>
        <p><strong>Suggested Tech Stack:</strong></p>
        <ul className="tech-stack">
          {idea.techStack.map((tech, idx) => (
            <li key={idx}>🔹 {tech}</li>
          ))}
        </ul>
        <button onClick={handleGenerate}>🔁 Generate New Idea</button>
      </div>
    </div>
  );
}

export default ProjectIdea;
=======
// src/pages/ProjectIdea.jsx
import React, { useState } from "react";
import "./ProjectIdea.css";

// Extended and improved project ideas with techStack
const ideas = [
  {
    title: "AI-Based Code Reviewer",
    category: "AI",
    description: "Develop a tool that reviews your code and gives suggestions using OpenAI or a custom ML model.",
    techStack: ["React", "Node.js", "OpenAI API", "Python (optional)"]
  },
  {
    title: "Frontend Component Library",
    category: "Frontend",
    description: "Create a set of reusable UI components using React + Tailwind and publish it as an NPM package.",
    techStack: ["React", "Tailwind CSS", "Rollup", "NPM"]
  },
  {
    title: "Task Manager with Gamification",
    category: "Fullstack",
    description: "A web app that rewards users with points and badges as they complete tasks, integrated with a backend.",
    techStack: ["React", "Express.js", "MongoDB", "JWT"]
  },
  {
    title: "Online Resume Builder",
    category: "Fullstack",
    description: "Users can input data and choose from multiple templates to generate a professional PDF resume.",
    techStack: ["React", "HTML-to-PDF API", "Node.js"]
  },
  {
    title: "Quiz App with Leaderboards",
    category: "Web + DB",
    description: "A timed quiz application with live scoring, multiplayer option, and leaderboard tracking.",
    techStack: ["React", "Socket.io", "MongoDB", "Express"]
  },
  {
    title: "Weather + News Dashboard",
    category: "Frontend",
    description: "Combines OpenWeather and News API to deliver a dashboard with real-time updates and styling options.",
    techStack: ["HTML", "CSS", "JavaScript", "APIs"]
  },
  {
    title: "Web-Based Markdown Editor",
    category: "Tools",
    description: "Create a clean Markdown editor with live preview and export options.",
    techStack: ["React", "Marked.js", "Download.js"]
  },
  {
    title: "Dev Portfolio Generator",
    category: "Tools",
    description: "Takes user inputs and generates a clean, downloadable developer portfolio with sections and animations.",
    techStack: ["React", "JSX-to-HTML", "Bootstrap"]
  },
  {
    title: "2D Game using Canvas API",
    category: "Games",
    description: "Build a mini-platformer or side-scroller game using just vanilla JS and the Canvas API.",
    techStack: ["JavaScript", "Canvas API"]
  },
  {
    title: "Stock Market Tracker",
    category: "Data/API",
    description: "Track stock prices using a public API, show charts, and let users favorite certain stocks.",
    techStack: ["React", "Chart.js", "Finnhub API"]
  },
  {
    title: "Realtime Chat App",
    category: "Fullstack",
    description: "End-to-end encrypted chat with rooms, emojis, and media support.",
    techStack: ["React", "Node.js", "Socket.io", "MongoDB"]
  },
  {
    title: "AI Meme Generator",
    category: "Fun / AI",
    description: "Automatically generate memes from trending topics using GPT and meme templates.",
    techStack: ["OpenAI API", "Meme Template API", "React"]
  },
  {
    title: "Book Sharing Platform",
    category: "Web App",
    description: "A platform for users to list, borrow, and lend books to each other locally.",
    techStack: ["Next.js", "Firebase", "Tailwind CSS"]
  },
  {
    title: "Study Planner with Pomodoro",
    category: "Productivity",
    description: "Organize study sessions, track time, and use Pomodoro technique with stats.",
    techStack: ["React", "LocalStorage", "Chart.js"]
  },
  {
    title: "Movie Recommendation Engine",
    category: "ML / Entertainment",
    description: "Suggest movies based on user taste using collaborative or content-based filtering.",
    techStack: ["Python", "Scikit-Learn", "Flask", "React"]
  },
  {
    title: "AR Product Preview",
    category: "AR / eCommerce",
    description: "Preview furniture or products using Augmented Reality in the browser.",
    techStack: ["Three.js", "WebXR", "React"]
  },
  {
    title: "Virtual Internship Simulator",
    category: "EdTech",
    description: "Simulate real-world projects with tasks, deadlines, and feedback for beginners.",
    techStack: ["React", "Node.js", "MongoDB", "Socket.io"]
  },
  {
    title: "Voice-Controlled Todo List",
    category: "AI",
    description: "Integrate speech recognition to manage todos using voice commands.",
    techStack: ["Web Speech API", "React", "Redux"]
  },
  {
    title: "Code Snippet Organizer",
    category: "Tools",
    description: "Users can save, tag, and search code snippets with language/category filters.",
    techStack: ["React", "Express.js", "PostgreSQL"]
  },
  {
    title: "Resume Scanner for ATS",
    category: "HR / Tools",
    description: "Scan resumes and score them based on how well they match a given job description.",
    techStack: ["Python", "NLP", "Streamlit or Flask"]
  }
];

const getRandomIdea = (prevTitle) => {
  let idea;
  do {
    idea = ideas[Math.floor(Math.random() * ideas.length)];
  } while (idea.title === prevTitle);
  return idea;
};

function ProjectIdea() {
  const [idea, setIdea] = useState(getRandomIdea(""));

  const handleGenerate = () => {
    setIdea(getRandomIdea(idea.title));
  };

  return (
    <div className="project-idea-page">
      <section className="project-idea-hero">
        <h1>💡 Random Project Idea Generator</h1>
        <p>Get unique and professional project ideas across multiple domains.</p>
      </section>

      <div className="idea-box">
        <h2>{idea.title}</h2>
        <p><strong>Category:</strong> {idea.category}</p>
        <p className="description">{idea.description}</p>
        <p><strong>Suggested Tech Stack:</strong></p>
        <ul className="tech-stack">
          {idea.techStack.map((tech, idx) => (
            <li key={idx}>🔹 {tech}</li>
          ))}
        </ul>
        <button onClick={handleGenerate}>🔁 Generate New Idea</button>
      </div>
    </div>
  );
}

export default ProjectIdea;
>>>>>>> 9b2d469fd6f28892b7277d47845433741d5b49ba
