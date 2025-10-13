import React, { useState } from "react";
import "./Tutor.css";

const Tutor = () => {
  const [paragraph, setParagraph] = useState("");
  const [summary, setSummary] = useState("");
  const [takeaways, setTakeaways] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [tone, setTone] = useState("");
  const [entities, setEntities] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [chat, setChat] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  

  // --- Deep Text Analysis ---
  const analyzeText = (text) => {
    // Sentence splitting
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const summary = sentences.slice(0, 3).join(" ").trim();

    // Keyword frequency
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const freq = {};
    words.forEach((w) => (freq[w] = (freq[w] || 0) + 1));
    const topConcepts = Object.keys(freq)
      .sort((a, b) => freq[b] - freq[a])
      .slice(0, 5);

    // Tone detection (basic)
    let tone = "Informative";
    if (text.includes("!")) tone = "Emotional";
    else if (/should|must|recommend/.test(text)) tone = "Persuasive";

    // Entity detection (simple proper nouns)
    const entityMatches = text.match(/\b[A-Z][a-z]+/g) || [];
    const uniqueEntities = [...new Set(entityMatches)];

    // Formal/Informal detection
    const style = /gonna|lol|cool|awesome|btw/.test(text) ? "Informal" : "Formal";

    const takeaways = [
      `Main topic: ${topConcepts[0] || "General"}`,
      `Tone: ${tone} | Style: ${style}`,
      `Focuses on: ${topConcepts.slice(1, 3).join(", ")}`,
    ];

    setSummary(summary);
    setConcepts(topConcepts);
    setTone(tone);
    setEntities(uniqueEntities);
    setTakeaways(takeaways);
  };

  // --- Adaptive Quiz Generator ---
  const generateQuiz = () => {
    if (!paragraph.trim()) return alert("Please enter a paragraph first!");
    analyzeText(paragraph);

    // Adaptive difficulty based on text length
    const difficulty = paragraph.length < 150 ? "Easy" : paragraph.length < 300 ? "Medium" : "Hard";

    const baseQuestions = [
      {
        question: "What is the main topic of this paragraph?",
        options: ["Science", "Technology", "Education", "General"],
        answer: concepts[0] || "General",
      },
      {
        question: "What is the tone of this paragraph?",
        options: ["Informative", "Persuasive", "Emotional"],
        answer: tone,
      },
      {
        question: `Which word best represents a key concept? (${difficulty})`,
        options: concepts.slice(0, 4),
        answer: concepts[0],
      },
      {
        question: "How would you describe the writing style?",
        options: ["Formal", "Informal"],
        answer: /gonna|lol|cool|awesome|btw/.test(paragraph) ? "Informal" : "Formal",
      },
      {
        question: "Which entities are mentioned in the paragraph?",
        options: entities.length > 0 ? entities.slice(0, 4) : ["None"],
        answer: entities[0] || "None",
      },
      {
        question: "What is a key takeaway from the paragraph?",
        options: takeaways,
        answer: takeaways[0] || "Main topic",
      },
      {
        question: "What is the purpose of this paragraph?",
        options: ["To inform", "To persuade", "To entertain"],
        answer: "To inform",
      },
      {
        question: "What type of sentences are predominantly used?",
        options: ["Simple", "Compound", "Complex"],
        answer: "Simple",
      },
      {
        question: "What is the best summary of the paragraph?",
        options: [summary, "A brief overview", "An in-depth analysis", "A personal opinion"],
        answer: summary,
      },
    ];

    setQuiz(baseQuestions);
    setAnswers({});
    setScore(null);
    setFeedback("");
  };

  const handleSelect = (qIndex, opt) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: opt }));
  };

  const checkAnswers = () => {
    let correct = 0;
    quiz.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    setScore(correct);

    const feedbackMsg =
      correct === quiz.length
        ? "Perfect! You understood everything clearly. 🌟"
        : correct >= quiz.length / 2
        ? "Good! Fair understanding — review minor details. 👍"
        : "Needs improvement. Try rereading key concepts. 💪";
    setFeedback(feedbackMsg);
  };

  // --- AI Feedback Chat ---
  const handleChat = () => {
    if (!userQuery.trim()) return;
    let response = "I'm not sure yet. Try rephrasing your question.";
    const query = userQuery.toLowerCase();

    if (query.includes("why")) response = "Because the paragraph’s tone or structure implies reasoning.";
    else if (query.includes("explain"))
      response = `Focuses on ${concepts[0] || "a general topic"}, tone: ${tone}, entities: ${entities.join(", ") || "None"}.`;
    else if (query.includes("main idea")) response = `Summary: ${summary.slice(0, 100)}...`;
    else if (query.includes("how")) response = "Look for connections between key concepts and entities.";

    setChat((prev) => [...prev, { sender: "user", text: userQuery }, { sender: "ai", text: response }]);
    setUserQuery("");
  };

  return (
    <div className="tutor-container">
      <h1 className="title">🤖 Advanced AI Tutor</h1>
      <p className="subtitle">Paragraph understanding, Summarization, Concept extraction, Adaptive quizzes</p>

      <textarea
        className="input-box"
        value={paragraph}
        onChange={(e) => setParagraph(e.target.value)}
        placeholder="Paste or type your paragraph here..."
      ></textarea>

      <button className="btn-generate" onClick={generateQuiz}>
        Analyze & Generate Quiz 🚀
      </button>

      {summary && (
        <div className="summary-section">
          <h2>📘 Summary</h2>
          <p>{summary}</p>

          <h3>🧩 3 Key Takeaways</h3>
          <ul>{takeaways.map((t, i) => <li key={i}>{t}</li>)}</ul>

          <h3>🔑 5 Key Concepts</h3>
          <div className="concepts">{concepts.map((c, i) => <span key={i} className="concept-tag">{c}</span>)}</div>

          <h3>🏷 Entities Detected</h3>
          <div className="concepts">{entities.map((e, i) => <span key={i} className="concept-tag">{e}</span>)}</div>
        </div>
      )}

      {quiz.length > 0 && (
        <div className="quiz-section">
          <h2>📝 Adaptive Quiz</h2>
          {quiz.map((q, index) => (
            <div key={index} className="quiz-card">
              <p>{index + 1}. {q.question}</p>
              <div className="options">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`option-btn ${answers[index] === opt ? (answers[index] === q.answer ? "correct" : "incorrect") : ""}`}
                    onClick={() => handleSelect(index, opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button className="btn-check" onClick={checkAnswers}>✅ Check Answers</button>
          {score !== null && (
            <div className="result-box">
              <h3>🎯 Score: {score}/{quiz.length}</h3>
              <p>{feedback}</p>
            </div>
          )}
        </div>
      )}

      {score !== null && (
        <div className="chat-section">
          <h2>💬 Ask the AI Tutor</h2>
          <div className="chat-box">
            {chat.map((msg, i) => (
              <p key={i} className={msg.sender === "ai" ? "ai-msg" : "user-msg"}>{msg.sender === "ai" ? "🤖 " : "🧑 "} {msg.text}</p>
            ))}
          </div>
          <div className="chat-input">
            <input
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Ask: Why was my answer wrong?"
            />
            <button onClick={handleChat}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutor;
