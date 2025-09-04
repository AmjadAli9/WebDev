import React, { useState, useEffect, useRef, useCallback } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReactDOMServer from "react-dom/server";
import "./PortfolioGenerator.css";

const portfolioThemes = {
  minimalist: { background: "#f0f0f0", color: "#222", fontFamily: "'Arial', sans-serif" },
  neon: { background: "#000", color: "#0ff", fontFamily: "'Courier New', monospace" },
  professional: { background: "#fff", color: "#333", fontFamily: "'Georgia', serif" },
};

const PortfolioGenerator = () => {
  const previewRef = useRef(null);
  const [info, setInfo] = useState(() => {
    const saved = localStorage.getItem("portfolioInfo");
    const parsed = saved ? JSON.parse(saved) : {};
    return {
      name: parsed.name || "",
      tagline: parsed.tagline || "",
      bio: parsed.bio || "",
      contact: parsed.contact || { email: "", phone: "", linkedin: "", github: "" },
      skills: parsed.skills || [],
      education: parsed.education || [],
      certifications: parsed.certifications || [],
    };
  });
  const [project, setProject] = useState({ title: "", desc: "", link: "" });
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("portfolioProjects");
    return saved ? JSON.parse(saved) : [];
  });
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("portfolioTheme");
    return saved || "minimalist";
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("portfolioDark") === "true";
    return saved || false;
  });
  const [error, setError] = useState("");
  const [previewContent, setPreviewContent] = useState(null);

  // ✅ Wrap updatePreview in useCallback
  const updatePreview = useCallback(() => {
    const { name, tagline, bio, contact, skills, education, certifications } = info;
    if (!name.trim()) {
      setError("Name is required.");
      setPreviewContent(null);
      return;
    }
    setError("");
    const style = portfolioThemes[theme];
    const content = (
      <div style={style} className="preview-content">
        <h1>{name || "Your Name"}</h1>
        <h3>{tagline || "Your Tagline"}</h3>
        <p>{bio || "Your bio..."}</p>
        {contact && Object.values(contact).some((v) => v.trim()) && (
          <p>
            Contact: {Object.entries(contact)
              .filter(([, v]) => v.trim())
              .map(([key, value]) => `${key}: ${value}`)
              .join(" | ")}
          </p>
        )}
        {skills.length > 0 && (
          <div>
            <h2>Skills</h2>
            <ul>{skills.map((s, i) => <li key={i}>{s.title || s}</li>)}</ul>
          </div>
        )}
        {education.length > 0 && (
          <div>
            <h2>Education</h2>
            <ul>{education.map((e, i) => <li key={i}>{e.title || e}</li>)}</ul>
          </div>
        )}
        {certifications.length > 0 && (
          <div>
            <h2>Certifications</h2>
            <ul>{certifications.map((c, i) => <li key={i}>{c.title || c}</li>)}</ul>
          </div>
        )}
        {projects.length > 0 && (
          <div>
            <h2>Projects</h2>
            <ul>
              {projects.map((p) => (
                <li key={p.id}>
                  <strong>{p.title}</strong>: {p.desc} {p.link && <a href={p.link}>Link</a>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
    setPreviewContent(content);
  }, [info, projects, theme]);

  useEffect(() => {
    localStorage.setItem("portfolioInfo", JSON.stringify(info));
    localStorage.setItem("portfolioProjects", JSON.stringify(projects));
    localStorage.setItem("portfolioTheme", theme);
    localStorage.setItem("portfolioDark", darkMode);
    updatePreview();
  }, [info, projects, theme, darkMode, updatePreview]);

  const downloadMarkdown = () => {
    // ✅ use let instead of const, since we append with +=
    let markdown = `# ${info.name || "Your Name"} - ${info.tagline || "Your Tagline"}\n\n## Bio\n${info.bio || "Your bio..."}\n\n`;
    if (info.contact && Object.values(info.contact).some((v) => v.trim())) {
      markdown += "## Contact\n";
      Object.entries(info.contact)
        .filter(([, v]) => v.trim())
        .forEach(([key, value]) => {
          markdown += `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}\n`;
        });
      markdown += "\n";
    }
    if (info.skills.length > 0) markdown += "## Skills\n" + info.skills.map(s => `- ${s.title || s}`).join("\n") + "\n\n";
    if (info.education.length > 0) markdown += "## Education\n" + info.education.map(e => `- ${e.title || e}`).join("\n") + "\n\n";
    if (info.certifications.length > 0) markdown += "## Certifications\n" + info.certifications.map(c => `- ${c.title || c}`).join("\n") + "\n\n";
    if (projects.length > 0) {
      markdown += "## Projects\n";
      projects.forEach((p) => {
        markdown += `- **${p.title}**: ${p.desc} ${p.link ? `[Link](${p.link})` : ""}\n`;
      });
    }

    const blob = new Blob([markdown], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${info.name || "portfolio"}.md`;
    link.click();
  };

  // ... rest of your component unchanged ...
};

export default PortfolioGenerator;
