// src/pages/Resources.js
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "./Resources.css";

const Resources = () => {
  const [search, setSearch] = useState("");
  const [filteredResources, setFilteredResources] = useState([]);
  const [randomTip, setRandomTip] = useState("");
  const [resourceOfTheDay, setResourceOfTheDay] = useState({});

  const resources = useMemo(
    () => [
      {
        category: "Tutorials",
        items: [
          {
            title: "HTML and CSS in Depth (Meta)",
            link: "https://www.coursera.org/learn/html-and-css-in-depth?specialization=meta-front-end-developer",
            rating: 5,
          },
          {
            title: "JavaScript Programming (Meta)",
            link: "https://www.coursera.org/learn/programming-with-javascript?specialization=meta-front-end-developer",
            rating: 4.8,
          },
          {
            title: "Learn HTML (freeCodeCamp)",
            link: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
            rating: 4.9,
          },
          {
            title: "JavaScript Tutorial (MDN)",
            link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
            rating: 5,
          },
          {
            title: "React for Beginners (freeCodeCamp)",
            link: "https://www.freecodecamp.org/learn/react/",
            rating: 4.8,
          },
        ],
      },
      {
        category: "Tools",
        items: [
          { title: "VS Code", link: "https://code.visualstudio.com/", rating: 5 },
          { title: "GitHub", link: "https://github.com/", rating: 5 },
          { title: "Postman", link: "https://www.postman.com/", rating: 4.9 },
          { title: "Figma", link: "https://www.figma.com/", rating: 4.8 },
          { title: "CodeSandbox", link: "https://codesandbox.io/", rating: 4.7 },
          { title: "CanIUse", link: "https://caniuse.com/", rating: 4.9 },
          { title: "Lighthouse", link: "https://developer.chrome.com/docs/lighthouse/overview/", rating: 4.8 },
        ],
      },
      {
        category: "Handwritten Notes",
        items: [
          {
            title: "HTML Notes (PDF)",
            link: "https://drive.google.com/file/d/1BpV99BPGRtjEPFe2AH8Wh7gCum1kpA8J/view",
            rating: 5,
          },
          {
            title: "CSS Notes (PDF)",
            link: "https://drive.google.com/file/d/19t4lraBrBz685AD-cEiPMrbyiDffQqdE/view",
            rating: 4.9,
          },
          {
            title: "JavaScript Cheat Sheet",
            link: "https://drive.google.com/file/d/1Ty8PrMnXzo61-QRXtWdMW3FH4guRo6Gv/view",
            rating: 4.8,
          },
          {
            title: "HTML Handwritten Notes (CoderStar)",
            link: "https://coderstar.in/free-html-handwritten-notes/",
            rating: 4.7,
          },
          {
            title: "Web Development Notes (tutorialsduniya)",
            link: "https://www.tutorialsduniya.com/notes/web-designing-and-web-development-notes/",
            rating: 4.8,
          },
          {
            title: "JavaScript Handwritten Notes (CodeWithHarry)",
            link: "https://www.codewithharry.com/notes/",
            rating: 4.9,
          },
          {
            title: "CSS Handwritten Notes (CodeWithHarry)",
            link: "https://www.codewithharry.com/notes/css-handwritten-notes/",
            rating: 4.8,
          },
          {
            title: "React Handwritten Notes (CodeWithHarry)",
            link: "https://www.codewithharry.com/notes/react-handwritten-notes/",
            rating: 4.9,
          },
          {
            title: "Git and GitHub Handwritten Notes (CodeWithHarry)",
            link: "https://www.codewithharry.com/notes/git-and-github-handwritten-notes/",
            rating: 4.8,
          },
          {
            title: "Web Development Handwritten Notes (CodeWithHarry)",
            link: "https://www.codewithharry.com/notes/web-development-handwritten-notes/",
            rating: 4.9,
          },
          {
            title: "Web Development Notes (TutorialsPoint)",
            link: "https://www.tutorialspoint.com/web_development/web_development_notes.pdf",
            rating: 4.7,
          },
          {
            title: "Web Development Notes (GeeksforGeeks)",
            link: "https://www.geeksforgeeks.org/web-development-notes/",
            rating: 4.8,
          },
          {
            title: "Web Development Notes (W3Schools)",
            link: "https://www.w3schools.com/whatis/whatis_webdev.asp",
            rating: 4.7,
          },
          {
            title: "Web Development Notes (TutorialsTeacher)",
            link: "https://www.tutorialsteacher.com/webdevelopment/web-development-notes",
            rating: 4.8,
          },
          {
            title: "Web Development Notes (Studytonight)",
            link: "https://www.studytonight.com/web-development/web-development-notes.php",
            rating: 4.9,
          },
        ],
      },
      {
        category: "Cheatsheets",
        items: [
          {
            title: "HTML Cheat Sheet (MDN)",
            link: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Cheatsheet",
            rating: 5,
          },
          {
            title: "CSS Cheat Sheet (Codecademy)",
            link: "https://www.codecademy.com/learn/learn-css/modules/learn-css-cheatsheet/cheatsheet",
            rating: 4.9,
          },
          {
            title: "JavaScript Cheat Sheet (Zero To Mastery)",
            link: "https://zerotomastery.io/cheatsheets/javascript-cheatsheet/",
            rating: 4.8,
          },
          {
            title: "React Cheat Sheet (Zero To Mastery)",
            link: "https://zerotomastery.io/cheatsheets/react-cheatsheet/",
            rating: 4.8,
          },
          {
            title: "Git Cheat Sheet (GitSheet)",
            link: "https://gitsheet.wtf/",
            rating: 4.9,
          },
          {
            title: "Flexbox Cheat Sheet (CSS-Tricks)",
            link: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
            rating: 5,
          },
          {
            title: "CSS Grid Cheat Sheet (CSS-Tricks)",
            link: "https://css-tricks.com/snippets/css/complete-guide-grid/",
            rating: 4.9,
          },
          {
            title: "Web Development Cheat Sheet (DevHints)",
            link: "https://devhints.io/",
            rating: 4.8,
          },
        ],
      },
    ],
    []
  );

  const tips = useMemo(
    () => [
      "🚀 Consistency beats perfection in web development.",
      "💡 Learn Git and GitHub — it’s essential for collaboration.",
      "🎨 Figma is great for UI/UX design before coding!",
      "📜 Keep handwritten notes; they improve retention.",
      "🔍 Use MDN for reliable web dev documentation.",
      "⚡ Optimize images to boost website performance.",
      "📚 Build projects to solidify your coding skills.",
      "🛠️ Master DevTools for debugging like a pro.",
      "🌐 Explore CSS Grid for advanced layouts."
      ,
    ],
    []
  );

  useEffect(() => {
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
    const allItems = resources.flatMap((section) => section.items);
    setResourceOfTheDay(allItems[Math.floor(Math.random() * allItems.length)]);
    setFilteredResources(resources);
  }, [resources, tips]);

  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={index}>{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="resources-container">
      {/* Hero Section */}
      <header className="resources-hero">
        <h1>WebDevHub Resources</h1>
        <p>Your ultimate toolbox for web development success!</p>
      </header>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search resources..."
        value={search}
        onChange={(e) => {
          const query = e.target.value.toLowerCase();
          setSearch(query);
          if (query) {
            const filtered = resources.map((section) => ({
              ...section,
              items: section.items.filter((item) =>
                item.title.toLowerCase().includes(query)
              ),
            })).filter((section) => section.items.length > 0);
            setFilteredResources(filtered);
          } else {
            setFilteredResources(resources);
          }
        }}
        className="search-bar"
      />
      {search && (
        <button onClick={() => { setSearch(""); setFilteredResources(resources); }}>
          ❌ Clear Search
        </button>
      )}

      {/* Tip of the Day */}
      <div className="tip-box">💡 Dev Tip: {randomTip}</div>

      {/* Resource of the Day */}
      <div className="resource-of-the-day">
        🌟 Resource of the Day:{" "}
        <a href={resourceOfTheDay.link} target="_blank" rel="noopener noreferrer">
          {resourceOfTheDay.title}
        </a>
      </div>

      {/* Resources List */}
      {filteredResources.map((section, index) => (
        <section key={index} className="resources-section">
          <h2>{section.category}</h2>
          <div className="resource-cards">
            {section.items.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-card"
              >
                <span>{highlightText(item.title, search)}</span>
                <span>⭐ {item.rating}</span>
                <button onClick={() => navigator.clipboard.writeText(item.link)}>
                  🔗 Copy Link
                </button>
              </a>
            ))}
          </div>
        </section>
      ))}

      {/* Footer */}
      <footer>
        <p>© 2025 WebDevHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Resources;