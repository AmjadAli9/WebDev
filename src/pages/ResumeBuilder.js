import React, { useState, useEffect, useCallback } from "react";
import jsPDF from "jspdf";
import "./ResumePortfolio.css";

const ResumeBuilder = () => {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("resumeData");
    return saved
      ? JSON.parse(saved)
      : {
          name: "",
          role: "",
          summary: "",
          contact: { email: "", phone: "", linkedin: "", github: "" },
          skills: "",
          education: "",
          certifications: "",
          languages: "",
          experiences: [{ title: "", company: "", duration: "", description: "" }],
          projects: [{ title: "", description: "", link: "" }],
          template: "text",
        };
  });
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  const generatePreview = useCallback(() => {
    const {
      name,
      role,
      summary,
      contact,
      skills,
      education,
      certifications,
      languages,
      experiences,
      projects,
      template,
    } = formData;

    if (!name.trim() || !role.trim()) {
      setError("Name and Role are required.");
      setPreview("");
      return;
    }
    setError("");

    let content = template === "markdown" ? `# ${name} - ${role}\n\n` : `${name} - ${role}\n\n`;

    if (summary.trim()) content += `${template === "markdown" ? "## Summary\n" : "Summary:\n"}${summary}\n\n`;
    if (Object.values(contact).some((v) => v.trim())) {
      content += `${template === "markdown" ? "## Contact\n" : "Contact:\n"}`;
      Object.entries(contact)
        .filter(([, v]) => v.trim())
        .forEach(([key, value]) => {
          content += `${template === "markdown" ? `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}\n` : `${key}: ${value}\n`}`;
        });
      content += "\n";
    }
    if (skills.trim()) content += `${template === "markdown" ? "## Skills\n" : "Skills:\n"}${skills.split(",").map(s => s.trim()).join(", ")}\n\n`;
    if (education.trim()) content += `${template === "markdown" ? "## Education\n" : "Education:\n"}${education}\n\n`;
    if (certifications.trim()) content += `${template === "markdown" ? "## Certifications\n" : "Certifications:\n"}${certifications}\n\n`;
    if (languages.trim()) content += `${template === "markdown" ? "## Languages\n" : "Languages:\n"}${languages}\n\n`;
    if (experiences.some((exp) => exp.title.trim())) {
      content += `${template === "markdown" ? "## Experience\n" : "Experience:\n"}`;
      experiences.forEach((exp) => {
        if (exp.title.trim()) {
          content += `${template === "markdown" ? `- **${exp.title}** at ${exp.company} (${exp.duration})\n  ${exp.description}\n` : `${exp.title} at ${exp.company} (${exp.duration})\n${exp.description}\n`}`;
        }
      });
      content += "\n";
    }
    if (projects.some((proj) => proj.title.trim())) {
      content += `${template === "markdown" ? "## Projects\n" : "Projects:\n"}`;
      projects.forEach((proj) => {
        if (proj.title.trim()) {
          content += `${template === "markdown" ? `- **${proj.title}**: ${proj.description} [Link](${proj.link})\n` : `${proj.title}: ${proj.description} (Link: ${proj.link})\n`}`;
        }
      });
    }

    setPreview(content);
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(formData));
    generatePreview();
  }, [formData, generatePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [name]: value },
    }));
  };

  const handleArrayChange = (e, section, index, field) => {
    const newArray = [...formData[section]];
    newArray[index][field] = e.target.value;
    setFormData((prev) => ({ ...prev, [section]: newArray }));
  };

  const addEntry = (section) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], { title: "", company: "", duration: "", description: "", link: "" }],
    }));
  };

  const removeEntry = (section, index) => {
    const newArray = formData[section].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [section]: newArray }));
  };

  const downloadResume = () => {
    const blob = new Blob([preview], { type: `text/${formData.template};charset=utf-8` });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.name}_Resume.${formData.template}`;
    link.click();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    const lines = preview.split("\n");
    let yOffset = 10;
    lines.forEach((line, index) => {
      if (yOffset > 280) {
        doc.addPage();
        yOffset = 10;
      }
      doc.text(line, 10, yOffset);
      yOffset += 10;
    });
    doc.save(`${formData.name}_Resume.pdf`);
  };

  // Ensure preview updates on initial load
  useEffect(() => {
    generatePreview();
  }, [generatePreview]);

  return (
    <div className="resume-page">
      <header className="hero">
        <div className="hero-overlay">
          <h1>📝 Build Your Tech Resume</h1>
          <p>Create a professional, developer-focused resume in minutes.</p>
        </div>
      </header>

      <section className="resume-builder">
        <div className="form-container">
          <h2>Enter Your Details <span className="tip">(Tip: Fill all required fields marked with *)</span></h2>
          {error && <p className="error">{error}</p>}
          <div className="form-grid">
            <input
              name="name"
              placeholder="Full Name *"
              value={formData.name}
              onChange={handleChange}
              aria-label="Full Name"
              required
            />
            <input
              name="role"
              placeholder="Your Role (e.g., Frontend Developer) *"
              value={formData.role}
              onChange={handleChange}
              aria-label="Role"
              required
            />
            <textarea
              name="summary"
              placeholder="Professional Summary (e.g., Passionate developer with 3+ years in React)"
              value={formData.summary}
              onChange={handleChange}
              aria-label="Summary"
            />
            <div className="contact-section">
              <h3>Contact Info</h3>
              <input name="email" placeholder="Email" value={formData.contact.email} onChange={handleContactChange} />
              <input name="phone" placeholder="Phone" value={formData.contact.phone} onChange={handleContactChange} />
              <input name="linkedin" placeholder="LinkedIn URL" value={formData.contact.linkedin} onChange={handleContactChange} />
              <input name="github" placeholder="GitHub URL" value={formData.contact.github} onChange={handleContactChange} />
            </div>
            <textarea
              name="skills"
              placeholder="Skills (e.g., JavaScript, React, Node.js)"
              value={formData.skills}
              onChange={handleChange}
              aria-label="Skills"
            />
            <textarea
              name="education"
              placeholder="Education (e.g., B.Sc. Computer Science, 2020)"
              value={formData.education}
              onChange={handleChange}
              aria-label="Education"
            />
            <textarea
              name="certifications"
              placeholder="Certifications (e.g., AWS Certified Developer)"
              value={formData.certifications}
              onChange={handleChange}
              aria-label="Certifications"
            />
            <textarea
              name="languages"
              placeholder="Languages (e.g., English, Spanish)"
              value={formData.languages}
              onChange={handleChange}
              aria-label="Languages"
            />
            {formData.experiences.map((exp, index) => (
              <div key={index} className="experience-entry">
                <input
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) => handleArrayChange(e, "experiences", index, "title")}
                />
                <input
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => handleArrayChange(e, "experiences", index, "company")}
                />
                <input
                  placeholder="Duration (e.g., Jan 2023 - Present)"
                  value={exp.duration}
                  onChange={(e) => handleArrayChange(e, "experiences", index, "duration")}
                />
                <textarea
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) => handleArrayChange(e, "experiences", index, "description")}
                />
                <button onClick={() => removeEntry("experiences", index)} type="button">Remove</button>
              </div>
            ))}
            <button onClick={() => addEntry("experiences")} type="button">Add Experience</button>
            {formData.projects.map((proj, index) => (
              <div key={index} className="project-entry">
                <input
                  placeholder="Project Title"
                  value={proj.title}
                  onChange={(e) => handleArrayChange(e, "projects", index, "title")}
                />
                <textarea
                  placeholder="Description"
                  value={proj.description}
                  onChange={(e) => handleArrayChange(e, "projects", index, "description")}
                />
                <input
                  placeholder="Project Link"
                  value={proj.link}
                  onChange={(e) => handleArrayChange(e, "projects", index, "link")}
                />
                <button onClick={() => removeEntry("projects", index)} type="button">Remove</button>
              </div>
            ))}
            <button onClick={() => addEntry("projects")} type="button">Add Project</button>
            <select
              name="template"
              value={formData.template}
              onChange={handleChange}
              aria-label="Template"
            >
              <option value="text">Plain Text</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>
          <div className="download-buttons">
            <button onClick={downloadResume} aria-label="Download Resume">📥 Download {formData.template === "text" ? "Text" : "Markdown"}</button>
            <button onClick={downloadPDF} aria-label="Download PDF">📥 Download PDF</button>
          </div>
        </div>
        <div className="preview-container">
          <h2>Live Preview</h2>
          <pre className="resume-preview">{preview}</pre>
        </div>
      </section>
    </div>
  );
};

export default ResumeBuilder;