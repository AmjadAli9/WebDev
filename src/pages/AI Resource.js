import React, { useState } from "react";
import "./Home.css";

const ResourceRecommender = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);

  const handleSearch = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResources([]);

    try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

const handleSearch = async () => {
  if (!topic.trim()) return;
  setLoading(true);
  setResources([]);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant for beginners." },
          { role: "user", content: `Suggest beginner-friendly resources to learn ${topic}` },
        ],
      }),
    });

    const data = await response.json();
    const suggestions = data.choices[0].message.content
      .split("\n")
      .filter((line) => line.trim() !== "");

    setResources(
      suggestions.map((text, index) => ({
        title: `Resource ${index + 1}`,
        link: "#",
        description: text,
      }))
    );
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

      const mockResults = [
        {
          title: `${topic} - FreeCodeCamp Guide`,
          link: `https://www.freecodecamp.org/news/tag/${topic.replace(
            /\s+/g,
            "-"
          )}/`,
          description: `Step-by-step tutorials and examples to master ${topic}.`,
        },
        {
          title: `${topic} Crash Course`,
          link: `https://www.youtube.com/results?search_query=${topic}+crash+course`,
          description: `Watch beginner-friendly videos to quickly understand ${topic}.`,
        },
        {
          title: `${topic} Documentation`,
          link: `https://developer.mozilla.org/en-US/search?q=${topic}`,
          description: `Official documentation and references for ${topic}.`,
        },
      ];

      // Simulate network delay
      setTimeout(() => {
        setResources(mockResults);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-overlay">
          <h1>🔍 AI Resource Recommender</h1>
          <p>
            Enter a topic and get curated learning resources, instantly
            generated for you!
          </p>
          <div className="hero-buttons">
            <input
              type="text"
              placeholder="e.g., React basics, CSS animations"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                width: "70%",
                marginBottom: "12px",
              }}
            />
            <button onClick={handleSearch}>Get Resources</button>
          </div>
        </div>
      </header>

      {/* Resource Results */}
      <section className="feature-grid">
        <h2>📚 Suggested Resources</h2>
        {loading && <p>⏳ Fetching the best resources...</p>}
        {!loading && resources.length === 0 && (
          <p>Type a topic and click "Get Resources" to see suggestions.</p>
        )}
        <div className="cards">
          {resources.map((res, index) => (
            <a
              key={index}
              href={res.link}
              className="card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3>{res.title}</h3>
              <p>{res.description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2025 WebDevHub | AI-powered learning recommendations</p>
      </footer>
    </div>
  );
};

export default ResourceRecommender;
