import React, { useState, useEffect } from "react";
import "./SpotTheBug.css";

// Default challenges
const DEFAULT_CHALLENGES = [
  {
    title: "Broken Button",
    description: "Fix the button click handler.",
    code: `<button onclick="alert('Clicked!')">Click Me</button>`,
    bug: "Use `onclick` as React `onClick`.",
    tags: ["react", "events"],
  },
  {
    title: "State Not Updating",
    description: "Fix the counter increment logic.",
    code: `function Counter(){
  let count = 0;
  function increment(){
    count++;
  }
  return <button onClick={increment}>Count: {count}</button>
}`,
    bug: "Use React state instead of a local variable.",
    tags: ["react", "state"],
  },
  {
    title: "Missing Key",
    description: "Fix the missing `key` warning.",
    code: `<ul>
  {[1,2,3].map(num => <li>{num}</li>)}
</ul>`,
    bug: "Add a unique `key` prop to each list item.",
    tags: ["react", "list rendering"],
  },
  {
    title: "Incorrect Prop Type",
    description: "Fix the prop type issue.",
    code: `function Greeting(props){
  return <h1>Hello, {props.name.toUpperCase()}</h1>;
} 
<Greeting name={42} />`,
    bug: "Pass a string instead of a number to `name` prop.",
    tags: ["react", "props"],
  },
  {
    title: "Infinite Loop",
    description: "Fix the infinite render loop.",
    code: `function Timer(){
  const [seconds, setSeconds] = React.useState(0);
  React.useEffect(() => {
    setSeconds(seconds + 1);
  }); 
  return <div>Seconds: {seconds}</div>;
}`,
    bug: "Add an empty dependency array to `useEffect`.",
    tags: ["react", "hooks"],
  },
  {
    title: "Incorrect Conditional Rendering",
    description: "Fix the conditional rendering logic.",
    code: `function UserStatus(props){  
  return <div>
    {props.isLoggedIn && <h1>Welcome back!</h1>}
    {!props.isLoggedIn && <h1>Please sign in.</h1>}
  </div>;
}`,
    bug: "Use a ternary operator for clearer conditional rendering.",
    tags: ["react", "conditional rendering"],
  },
  {
    title: "Form Not Controlled",
    description: "Fix the uncontrolled form input.",
    code: `function NameForm(){
  return <form>
    <input type="text" />
    <button type="submit">Submit</button>
  </form>;
}`,
    bug: "Make the input a controlled component using state.",
  },
  {
    title: "Incorrect useEffect Cleanup",
    description: "Fix the missing cleanup in useEffect.",
    code: `function WindowWidth(){
  const [width, setWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
  }, []);
  return <div>Width: {width}</div>;
}`,
    bug: "Return a cleanup function to remove the event listener.",
    tags: ["react", "hooks"],
  },
  {
    title: "CSS Class Not Applied",
    description: "Fix the incorrect className usage.",
    code: `<div class="container">
  <h1>Hello World</h1>
</div>`,
    ug: "Use `className` instead of `class` in JSX.",  
    tags: ["react", "jsx"], 
  },
  { title: "Incorrect Array State Update",
    description: "Fix the array state update logic.",
    code: `function ItemList(){}
  const [items, setItems] = React.useState([]);
  function addItem(item){
    items.push(item);
    setItems(items);
  },  return <div>
    <button onClick={() => addItem('New Item')}>Add Item</button>
    <ul>{items.map((it, idx) => <li key={idx}>{it}</li>)}</ul>
  </div>;}`,
    bug: "Use the spread operator to create a new array when updating state.",
    tags: ["react", "state"],
  },
  { title: "Incorrect Fragment Usage",
    description: "Fix the incorrect usage of React Fragments.",
    code: `function MyComponent(){}
  return <div>
    <h1>Title</h1>
    <p>Description</p>
  </div>;}`,
    bug: "Use `<>` and `</>` for fragments instead of a `<div>`.",
    tags: ["react", "fragments"],
  },
];

const LS_LEADER = "stb_leaderboard_v1";
const LS_PROGRESS = "stb_progress_v1";

// LocalStorage helpers
const saveLeaderboard = (data) =>
  localStorage.setItem(LS_LEADER, JSON.stringify(data));
const loadLeaderboard = () =>
  JSON.parse(localStorage.getItem(LS_LEADER) || "[]");
const saveProgress = (data) =>
  localStorage.setItem(LS_PROGRESS, JSON.stringify(data));
const loadProgress = () =>
  JSON.parse(localStorage.getItem(LS_PROGRESS) || "{}");

export default function SpotTheBug() {
  const [challenges] = useState(DEFAULT_CHALLENGES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState(loadLeaderboard());
  const [username, setUsername] = useState("");
  const [progress, setProgress] = useState(loadProgress());

  const currentChallenge = challenges[currentIndex];

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const handleSubmit = () => {
    if (!currentChallenge) return;
    const normalized = answer.toLowerCase();
    const correct = currentChallenge.bug.toLowerCase();
    if (normalized.includes(correct.split(" ")[0])) {
      setFeedback("✅ Correct! Bug spotted.");
      setScore((prev) => prev + 10);
      setProgress({ ...progress, [currentIndex]: true });
    } else {
      setFeedback("❌ Not quite. Try again!");
    }
  };

  const handleSaveScore = () => {
    if (!username.trim()) return;
    const updated = [...leaderboard, { name: username, score }];
    const sorted = updated.sort((a, b) => b.score - a.score).slice(0, 10);
    setLeaderboard(sorted);
    saveLeaderboard(sorted);
  };

  const handleNext = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswer("");
      setFeedback("");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setAnswer("");
      setFeedback("");
    }
  };

  return (
    <div className="spot-page">
      {/* Header */}
      <div className="spot-header">
        <h1>Spot The Bug</h1>
        <div className="spot-meta">
          <span>Score: <strong>{score}</strong></span>
          <span>
            Challenge {currentIndex + 1}/{challenges.length}
          </span>
        </div>
      </div>

      <div className="spot-main">
        {/* Left Panel: Main Game */}
        <div className="left">
          {currentChallenge ? (
            <div className="card">
              <div className="meta-row">
                {currentChallenge.tags.map((tag, i) => (
                  <span key={i} className="pill">{tag}</span>
                ))}
              </div>
              <h2>{currentChallenge.title}</h2>
              <p className="muted">{currentChallenge.description}</p>

              <label className="label">Code Snippet</label>
              <pre className="code-block">{currentChallenge.code}</pre>

              <div className="answer-area">
                <div className="answer-mode">
                  <span className="muted">Describe the bug fix:</span>
                </div>
                <textarea
                  placeholder="Explain your fix..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                ></textarea>
                <button onClick={handleSubmit}>Submit</button>
              </div>

              {feedback && <div className="feedback">{feedback}</div>}

              <div className="nav-buttons">
                <button onClick={handlePrev} disabled={currentIndex === 0}>
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === challenges.length - 1}
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <p className="muted">No challenge found.</p>
          )}
        </div>

        {/* Right Panel: Leaderboard and Progress */}
        <div className="right">
          <div className="card leaderboard">
            <h3>Leaderboard</h3>
            <ol>
              {leaderboard.map((item, index) => (
                <li key={index}>
                  {item.name} — {item.score}
                </li>
              ))}
            </ol>
            <div className="save-score">
              <input
                placeholder="Enter name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button onClick={handleSaveScore}>Save</button>
            </div>
          </div>

          <div className="card about">
            <h3>Progress</h3>
            <div className="tags">
              {challenges.map((_, idx) => (
                <span
                  key={idx}
                  className="chip"
                  style={{
                    opacity: progress[idx] ? 1 : 0.3,
                  }}
                >
                  Challenge {idx + 1}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
