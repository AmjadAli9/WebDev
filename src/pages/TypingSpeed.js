import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "./TypingSpeed.css";

/**
 * TypingCodePractice
 * WebDev Hub-themed typing trainer
 */

const DEFAULT_SNIPPETS = [
  // WebDev Hub–style random lines and paragraphs
  `Always remember: clean code is better than clever code.`,
  `Optimize your React components to avoid unnecessary re-renders.`,
  `Use semantic HTML for better accessibility and SEO support.`,
  `Backend APIs should always return proper status codes for clarity.`,
  `Version control is your best friend — commit often, commit small.`,
  `Responsive design isn't optional — test your site on mobile first.`,
  `const apiEndpoint = process.env.API_URL || "https://devhub.example.com";`,
  `Error handling is just as important as feature development.`,
  `Remember: CSS Grid for layout, Flexbox for alignment.`,
  `Dark mode is cool, but make sure contrast ratios are accessible.`,
  `Unit tests help prevent regressions; integration tests ensure flows.`,
  `Avoid global variables unless you really know what you're doing.`,
  `document.querySelector("#root").scrollIntoView({ behavior: "smooth" });`,
  `Performance tip: Debounce or throttle heavy events like resize or scroll.`,
  `In Git, use feature branches and descriptive commit messages.`,
  `Security tip: Never expose secrets or tokens in client-side code.`,
  `Use environment variables to manage keys and sensitive configuration.`,
  `Refactor often — code maintenance is a long-term investment.`,
  `Consistency in naming and formatting improves team productivity.`,
  `Remember to handle edge cases: empty arrays, null values, and 404s.`,
  `const fetchData = async () => { try { const res = await fetch(url); return await res.json(); } catch (e) { console.error(e); } };`,
  `A good README is the first step to a successful open-source project.`,
  `Use CSS variables for theming and easier maintenance.`,
  `Accessibility matters: use ARIA roles and labels where appropriate.`,
  `Optimize images and assets to improve load times and performance.`,
  `const debounce = (func, delay) => { let timeout; return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => func(...args), delay); }; };`,
  `Remember: "Premature optimization is the root of all evil." — Donald Knuth`,
  `Use descriptive alt text for images to improve accessibility.`,
];

function symbolsify(base) {
  const insert = ['=>', '===', '!==', '&&', '||', '::', '++', '--', '/* */', '<!-- -->', '< />', '{}', '[]', '()', ';', ':'];
  let s = base;
  for (let i = 0; i < 6; i++) {
    const idx = Math.floor(Math.random() * s.length);
    const piece = insert[Math.floor(Math.random() * insert.length)];
    s = s.slice(0, idx) + piece + s.slice(idx);
  }
  return s;
}

function getRandomSnippet(mode) {
  if (mode === "symbols") {
    const base = DEFAULT_SNIPPETS[Math.floor(Math.random() * DEFAULT_SNIPPETS.length)];
    return symbolsify(base);
  }
  if (mode === "code") {
    return DEFAULT_SNIPPETS[Math.floor(Math.random() * DEFAULT_SNIPPETS.length)];
  }
  // Random longer paragraph for "random" mode
  const randomSnippets = [];
  for (let i = 0; i < 3; i++) {
    randomSnippets.push(DEFAULT_SNIPPETS[Math.floor(Math.random() * DEFAULT_SNIPPETS.length)]);
  }
  return randomSnippets.join(" ");
}

function formatTime(s) {
  const mm = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function TypingCodePractice() {
  const [mode, setMode] = useState("code");
  const [duration, setDuration] = useState(60);
  const [text, setText] = useState(() => getRandomSnippet("code"));
  const [typed, setTyped] = useState([]);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [errors, setErrors] = useState(0);
  const [themeDark, setThemeDark] = useState(true);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tcp_history") || "[]");
    } catch {
      return [];
    }
  });

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const resetSession = useCallback(() => {
    clearTimeout(timerRef.current);
    setText(getRandomSnippet(mode));
    setTyped([]);
    setStarted(false);
    setTimeLeft(duration);
    setErrors(0);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 10);
  }, [mode, duration]);

  const finishSession = useCallback(() => {
    setStarted(false);
    clearTimeout(timerRef.current);
    const newEntry = {
      date: new Date().toISOString(),
      wpm,
      cpm,
      accuracy,
      errors,
      duration
    };
    const next = [newEntry, ...history].slice(0, 20);
    setHistory(next);
    localStorage.setItem("tcp_history", JSON.stringify(next));
  }, [history, wpm, cpm, accuracy, errors, duration]);

  useEffect(() => {
    resetSession();
  }, [mode, duration, resetSession]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!started) return;
    if (timeLeft <= 0) {
      finishSession();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [started, timeLeft, finishSession]);

  const totalTyped = typed.length;
  const correctCount = typed.reduce((acc, t, i) => acc + (t === text[i] ? 1 : 0), 0);
  const elapsed = duration - timeLeft;
  const cpm = elapsed > 0 ? Math.round((correctCount / elapsed) * 60) : 0;
  const wpm = Math.round(cpm / 5);
  const accuracy = totalTyped > 0 ? Math.round((correctCount / totalTyped) * 100) : 100;

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  function handleKey(e) {
    if (!started) setStarted(true);
    if (e.ctrlKey || e.metaKey) return;
    if (e.key === "Backspace") {
      e.preventDefault();
      if (typed.length > 0) {
        setTyped(prev => prev.slice(0, -1));
        setTyped(prev => prev.slice(0, -1));
      }
      return;
    }
    let char = e.key;
    if (char === "Enter") char = "\n";
    if (char === "Tab") {
      e.preventDefault();
      char = "\t";
    }
    if (char.length !== 1) return;

    setTyped(prev => [...prev, char]);

    const expected = text[typed.length];
    if (char !== expected) {
      setErrors(n => n + 1);
    }

    if (typed.length + 1 >= text.length) {
      const nextText = getRandomSnippet(mode);
      setTimeout(() => {
        setText(nextText);
        setTyped([]);
      }, 40);
    }
  }

  function handlePaste(e) {
    e.preventDefault();
  }

  function handleNextSnippet() {
    setText(getRandomSnippet(mode));
    setTyped([]);
  }

  function handleExportResults() {
    const data = {
      date: new Date().toISOString(),
      duration,
      wpm,
      cpm,
      accuracy,
      errors,
      mode
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `typing_result_${Date.now()}.json`;
    a.click();
  }

  const chars = useMemo(() => {
    return text.split("").map((ch, i) => {
      const typedChar = typed[i];
      let status = "untyped";
      if (typedChar !== undefined) {
        status = typedChar === ch ? "correct" : "wrong";
      }
      if (i === typed.length) status = "current";
      return { ch, status, i };
    });
  }, [text, typed]);

  return (
    <div className={`tcp-shell ${themeDark ? "tcp-dark" : "tcp-light"}`}>
      <div className="tcp-top">
        <h1>Typing Speed — WebDev Hub Edition</h1>
        <div className="tcp-controls">
          <div className="ctrl-group">
            <label>Mode</label>
            <select value={mode} onChange={e => setMode(e.target.value)}>
              <option value="code">Code & Tips</option>
              <option value="symbols">Symbols-focused</option>
              <option value="random">Random Paragraph</option>
            </select>
          </div>

          <div className="ctrl-group">
            <label>Time</label>
            <select value={duration} onChange={e => setDuration(Number(e.target.value))}>
              <option value={15}>15s</option>
              <option value={30}>30s</option>
              <option value={60}>60s</option>
              <option value={120}>120s</option>
            </select>
          </div>

          <div className="ctrl-group">
            <label>Theme</label>
            <button className="theme-toggle" onClick={() => setThemeDark(d => !d)}>
              {themeDark ? "Dark" : "Light"}
            </button>
          </div>

          <div className="ctrl-group">
            <button className="tcp-btn" onClick={resetSession}>Restart</button>
            <button className="tcp-btn ghost" onClick={handleNextSnippet}>Next snippet</button>
          </div>
        </div>
      </div>

      <div className="tcp-main">
        <div className="typing-area" onClick={() => inputRef.current && inputRef.current.focus()}>
          <div className="typing-text" aria-hidden>
            {chars.map(c => (
              <span key={c.i} className={`char ${c.status}`}>
                {c.ch === "\n" ? <span className="nl">↩</span> : c.ch === "\t" ? <span className="nl">⇥</span> : c.ch}
              </span>
            ))}
          </div>
          <textarea
            ref={inputRef}
            className="hidden-input"
            onKeyDown={handleKey}
            onPaste={handlePaste}
            autoFocus
            aria-label="Typing input"
          />
        </div>

        <aside className="tcp-stats">
          <div className="stat"><div className="label">Time</div><div className="value">{formatTime(timeLeft)}</div></div>
          <div className="stat"><div className="label">WPM</div><div className="value">{wpm}</div></div>
          <div className="stat"><div className="label">CPM</div><div className="value">{cpm}</div></div>
          <div className="stat"><div className="label">Accuracy</div><div className="value">{accuracy}%</div></div>
          <div className="stat"><div className="label">Errors</div><div className="value error">{errors}</div></div>

          <div className="progress-wrap">
            <div className="progress" style={{ width: `${Math.min(100, (elapsed / duration) * 100)}%` }} />
          </div>

          <div className="history">
            <h4>History</h4>
            {history.length === 0 && <small>No runs yet</small>}
            <ul>
              {history.map((h, idx) => (
                <li key={idx}>
                  <strong>{h.wpm} WPM</strong> — {h.accuracy}% • {h.duration}s
                  <div className="ts">{new Date(h.date).toLocaleString()}</div>
                </li>
              ))}
            </ul>
            <div className="history-actions">
              <button onClick={() => { localStorage.removeItem("tcp_history"); setHistory([]); }}>Clear</button>
              <button onClick={handleExportResults}>Export</button>
            </div>
          </div>
        </aside>
      </div>

      <footer className="tcp-footer">
        <small>Typing practice with random WebDev Hub–related phrases, tips, and coding snippets.</small>
      </footer>
    </div>
  );
}