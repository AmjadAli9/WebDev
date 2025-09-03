import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Community.css";

const ProjectCard = React.memo(({ project, onDelete }) => (
  <div className="project-card">
    <h3>{project.title}</h3>
    <p>{project.description}</p>
    <button onClick={onDelete} className="delete-btn">🗑️ Delete</button>
  </div>
));

const DiscussionPost = React.memo(({ discussion, onAddComment, onDelete }) => (
  <div className="forum-post">
    <h3>{discussion.question}</h3>
    {discussion.comments.map((comment, i) => (
      <p key={i} className="comment">💡 {comment}</p>
    ))}
    <input
      type="text"
      placeholder="✍️ Add a comment..."
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target.value.trim()) {
          onAddComment(e.target.value);
          e.target.value = "";
        }
      }}
    />
    <button onClick={onDelete} className="delete-btn">🗑️ Delete</button>
  </div>
));

const CommunityPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("projects");
    return saved ? JSON.parse(saved) : [
      { title: "Portfolio Website", description: "🎨 A stunning portfolio made with React and TailwindCSS!" },
      { title: "E-Commerce Store", description: "🛒 An online store with product filters, cart, and payment integration." },
    ];
  });
  const [discussions, setDiscussions] = useState(() => {
    const saved = localStorage.getItem("discussions");
    return saved ? JSON.parse(saved) : [
      { question: "What’s the best way to learn Redux?", comments: ["📘 Try the official docs!", "🎥 I found a great YouTube playlist."] },
      { question: "Looking for collaborators on a React project", comments: ["🙋‍♂️ Count me in!", "💡 What’s the project idea?"] },
    ];
  });
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [newDiscussion, setNewDiscussion] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
    localStorage.setItem("discussions", JSON.stringify(discussions));
  }, [projects, discussions]);

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.description.trim()) {
      setError("Please fill in both title and description.");
      return;
    }
    setProjects([...projects, { ...newProject, id: Date.now() }]);
    setNewProject({ title: "", description: "" });
    setError("");
  };

  const handleDiscussionSubmit = (e) => {
    e.preventDefault();
    if (!newDiscussion.trim()) {
      setError("Please enter a discussion topic.");
      return;
    }
    setDiscussions([...discussions, { question: newDiscussion, comments: [], id: Date.now() }]);
    setNewDiscussion("");
    setError("");
  };

  const addComment = (index, comment) => {
    if (comment.trim()) {
      const updatedDiscussions = [...discussions];
      updatedDiscussions[index].comments.push(comment);
      setDiscussions(updatedDiscussions);
    }
  };

  const deleteProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const deleteDiscussion = (id) => {
    setDiscussions(discussions.filter((d) => d.id !== id));
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredDiscussions = discussions.filter((discussion) =>
    discussion.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discussion.comments.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="community-page">
      <div className="community-container">
        {/* 🔍 Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search projects or discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 🌟 Inspiration Wall */}
        <section className="inspiration-wall" aria-label="Inspiration Wall">
          <h2>🌟 Inspiration Wall</h2>
          <p>Fuel your creativity — read success stories, find project ideas, and stay motivated.</p>
          <div className="inspiration-content">
            <div className="story-card">
              <h3>🚀 From Zero to Web Dev Hero</h3>
              <p>Meet Aisha — she started learning web development six months ago and now builds amazing real-world projects.</p>
            </div>
            <div className="idea-card">
              <h3>💡 Project Idea: Task Tracker App</h3>
              <p>Build a sleek and efficient task management app using React and Firebase. Ready for the challenge?</p>
            </div>
          </div>
        </section>

        {/* 💻 Project Showcase */}
        <section className="project-showcase" aria-label="Project Showcase">
          <h2>💻 Project Showcase</h2>
          <p>Check out community creations or share your own masterpiece!</p>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleProjectSubmit} className="project-form">
            <input
              type="text"
              placeholder="🎉 Give your project an awesome title..."
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              aria-label="Project title"
            />
            <textarea
              placeholder="📝 Describe what makes your project unique..."
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              aria-label="Project description"
            />
            <button type="submit" aria-label="Share project">🚀 Share Project</button>
          </form>
          <div className="projects">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={() => deleteProject(project.id)}
              />
            ))}
          </div>
        </section>

        {/* 📚 Learning Resources */}
        <section className="learning-resources" aria-label="Learning Resources">
          <h2>📚 Learning Resources</h2>
          <ul>
            <li><a href="https://reactjs.org/" target="_blank" rel="noreferrer">🔥 Official React Docs</a></li>
            <li><a href="https://javascript.info/" target="_blank" rel="noreferrer">🚀 The Modern JavaScript Tutorial</a></li>
          </ul>
        </section>

        {/* 🗣️ Discussion & Collaboration */}
        <section className="discussion" aria-label="Discussion Forum">
          <h2>🗣️ Discussion & Collaboration</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleDiscussionSubmit} className="discussion-form">
            <input
              type="text"
              placeholder="💬 Got a question or an idea? Start a discussion..."
              value={newDiscussion}
              onChange={(e) => setNewDiscussion(e.target.value)}
              aria-label="Discussion topic"
            />
            <button type="submit" aria-label="Post discussion">📢 Post Discussion</button>
          </form>
          {filteredDiscussions.map((discussion, index) => (
            <DiscussionPost
              key={discussion.id}
              discussion={discussion}
              onAddComment={(comment) => addComment(index, comment)}
              onDelete={() => deleteDiscussion(discussion.id)}
            />
          ))}
        </section>

        {/* ⚡ Challenge of the Week */}
        <section className="challenge" aria-label="Challenge of the Week">
          <h2>⚡ Challenge of the Week</h2>
          <div className="challenge-card">
            <h3>🌐 Build a Weather App</h3>
            <p>Fetch real-time weather data using an API and display it beautifully. Can you make it shine?</p>
            <button onClick={() => navigate("/codepad")} className="start-challenge-btn">🚀 Start Challenge</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CommunityPage;