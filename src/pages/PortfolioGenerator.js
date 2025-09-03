import React, { useState, useEffect, useRef } from "react";
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

  useEffect(() => {
    localStorage.setItem("portfolioInfo", JSON.stringify(info));
    localStorage.setItem("portfolioProjects", JSON.stringify(projects));
    localStorage.setItem("portfolioTheme", theme);
    localStorage.setItem("portfolioDark", darkMode);
    updatePreview();
  }, [info, projects, theme, darkMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({
      ...prev,
      contact: { ...prev.contact, [name]: value },
    }));
  };

  const handleArrayChange = (e, section, index, field) => {
    const newArray = [...info[section]];
    newArray[index][field] = e.target.value;
    setInfo((prev) => ({ ...prev, [section]: newArray }));
  };

  const addEntry = (section) => {
    setInfo((prev) => ({
      ...prev,
      [section]: [...prev[section], { title: "", desc: "", link: "" }],
    }));
  };

  const removeEntry = (section, index) => {
    const newArray = info[section].filter((_, i) => i !== index);
    setInfo((prev) => ({ ...prev, [section]: newArray }));
  };

  const handleAddProject = () => {
    if (!project.title.trim()) {
      setError("Project title is required.");
      return;
    }
    setProjects([...projects, { ...project, id: Date.now() }]);
    setProject({ title: "", desc: "", link: "" });
    setError("");
  };

  const editProject = (id, updatedProject) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, ...updatedProject } : p)));
  };

  const deleteProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const moveProject = (id, direction) => {
    const index = projects.findIndex((p) => p.id === id);
    if ((direction === "up" && index > 0) || (direction === "down" && index < projects.length - 1)) {
      const newProjects = [...projects];
      const temp = newProjects[index];
      newProjects[index] = newProjects[index + (direction === "up" ? -1 : 1)];
      newProjects[index + (direction === "up" ? -1 : 1)] = temp;
      setProjects(newProjects);
    }
  };

  const updatePreview = () => {
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
              .map(([key, value]) => `${key}: ${value}`).join(" | ")}
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
  };

  const downloadHTML = () => {
    const html = `
      <!DOCTYPE html><html><head><meta charset="utf-8"><title>${info.name || "Portfolio"}</title></head><body style="font-family:${portfolioThemes[theme].fontFamily};background:${portfolioThemes[theme].background};color:${portfolioThemes[theme].color};padding:20px;">
      ${ReactDOMServer.renderToString(previewContent || <div>No preview available</div>)}
      </body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${info.name || "portfolio"}.html`;
    link.click();
  };

  const downloadPDF = async () => {
    const input = previewRef.current;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    } catch (err) {
      console.error("Error generating PDF:", err);
      // Fallback: Text-based PDF
      const lines = ReactDOMServer.renderToString(previewContent || <div>No preview available</div>).split("\n");
      let yOffset = 10;
      lines.forEach((line) => {
        if (yOffset > 280) {
          doc.addPage();
          yOffset = 10;
        }
        doc.text(line, 10, yOffset);
        yOffset += 10;
      });
    }

    doc.save(`${info.name || "portfolio"}.pdf`);
  };

  const downloadMarkdown = () => {
    const markdown = `# ${info.name || "Your Name"} - ${info.tagline || "Your Tagline"}\n\n## Bio\n${info.bio || "Your bio..."}\n\n`;
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

  return (
    <div className={`portfolio-gen ${darkMode ? "dark" : ""}`}>
      <div className="controls">
        <select value={theme} onChange={(e) => setTheme(e.target.value)} aria-label="Theme">
          {Object.keys(portfolioThemes).map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
        <button onClick={() => setDarkMode(!darkMode)} aria-label="Toggle Dark Mode">
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
      <div className="builder-container">
        <div className="input-form">
          <h2>Portfolio Details <span className="tip">(Tip: Fill required fields marked with *)</span></h2>
          {error && <p className="error">{error}</p>}
          <div className="form-grid">
            {["name", "tagline", "bio"].map((field) => (
              <div key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}{field === "name" ? " *" : ""}</label>
                <input
                  value={info[field]}
                  onChange={(e) => handleChange(e)}
                  name={field}
                  placeholder={`Enter ${field}...`}
                  aria-label={field}
                  required={field === "name"}
                />
              </div>
            ))}
            <div className="contact-section">
              <h3>Contact Info</h3>
              {["email", "phone", "linkedin", "github"].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={info.contact[field]}
                  onChange={handleContactChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  aria-label={field}
                />
              ))}
            </div>
            {["skills", "education", "certifications"].map((section) => (
              <div key={section}>
                <h3>{section.charAt(0).toUpperCase() + section.slice(1)}</h3>
                {info[section].map((item, index) => (
                  <div key={index} className="array-entry">
                    <input
                      value={item.title || ""}
                      onChange={(e) => handleArrayChange(e, section, index, "title")}
                      placeholder={`Enter ${section} item...`}
                    />
                    <button onClick={() => removeEntry(section, index)} type="button">Remove</button>
                  </div>
                ))}
                <button onClick={() => addEntry(section)} type="button">Add {section}</button>
              </div>
            ))}
            <div>
              <h3>Projects</h3>
              {projects.map((p) => (
                <div key={p.id} className="project-entry">
                  <input
                    value={p.title}
                    onChange={(e) => editProject(p.id, { title: e.target.value })}
                    placeholder="Title"
                  />
                  <input
                    value={p.desc}
                    onChange={(e) => editProject(p.id, { desc: e.target.value })}
                    placeholder="Description"
                  />
                  <input
                    value={p.link}
                    onChange={(e) => editProject(p.id, { link: e.target.value })}
                    placeholder="Link"
                  />
                  <button onClick={() => deleteProject(p.id)} type="button">Delete</button>
                  <div>
                    <button onClick={() => moveProject(p.id, "up")} type="button">↑</button>
                    <button onClick={() => moveProject(p.id, "down")} type="button">↓</button>
                  </div>
                </div>
              ))}
              <div>
                <input
                  value={project.title}
                  onChange={(e) => setProject({ ...project, title: e.target.value })}
                  placeholder="Title"
                />
                <input
                  value={project.desc}
                  onChange={(e) => setProject({ ...project, desc: e.target.value })}
                  placeholder="Description"
                />
                <input
                  value={project.link}
                  onChange={(e) => setProject({ ...project, link: e.target.value })}
                  placeholder="Link"
                />
                <button type="button" onClick={handleAddProject}>Add Project</button>
              </div>
            </div>
          </div>
          <div className="download-buttons">
            <button onClick={downloadHTML} aria-label="Download HTML">📥 Download HTML</button>
            <button onClick={downloadPDF} aria-label="Download PDF">📥 Download PDF</button>
            <button onClick={downloadMarkdown} aria-label="Download Markdown">📥 Download Markdown</button>
          </div>
        </div>
        <div className="live-preview" ref={previewRef}>
          {previewContent}
        </div>
      </div>
    </div>
  );
};

export default PortfolioGenerator;