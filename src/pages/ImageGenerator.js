import React, { useState } from "react";
import "./Home.css";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImageUrl(null);

    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt: prompt,
          size: "512x512",
        }),
      });

      const data = await response.json();

      if (data.data && data.data[0].url) {
        setImageUrl(data.data[0].url);
      } else {
        throw new Error("No image generated.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <header className="hero">
        <div className="hero-overlay">
          <h1>🖼 AI Image Generator</h1>
          <p>Type your idea and generate an AI-powered image instantly!</p>
          <div className="hero-buttons">
            <input
              type="text"
              placeholder="e.g., futuristic coding workspace"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                width: "70%",
                marginBottom: "12px",
              }}
            />
            <button onClick={generateImage} disabled={loading}>
              {loading ? "Generating..." : "Generate Image"}
            </button>
          </div>
        </div>
      </header>

      <section className="feature-grid">
        <h2>🎨 Generated Image</h2>
        {loading && <p>⏳ Creating your image...</p>}
        {imageUrl && (
          <div className="cards">
            <img
              src={imageUrl}
              alt="Generated"
              style={{
                borderRadius: "12px",
                maxWidth: "512px",
                width: "100%",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
              }}
            />
            <a href={imageUrl} download>
              <button style={{ marginTop: "12px" }}>Download Image</button>
            </a>
          </div>
        )}
      </section>

      <footer>
        <p>© 2025 WebDevHub | AI-powered image generation</p>
      </footer>
    </div>
  );
};

export default ImageGenerator;
