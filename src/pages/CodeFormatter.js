import React, { useEffect, useState, useRef } from "react";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import parserTypescript from "prettier/parser-typescript";
import parserHtml from "prettier/parser-html";
import parserPostcss from "prettier/parser-postcss";
import parserMarkdown from "prettier/parser-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy as lightStyle, tomorrow as darkStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import { encode as base64Encode, decode as base64Decode } from "html-entities";
import "./CodeFormatter.css";

const PRETTIER_PLUGINS = [parserBabel, parserTypescript, parserHtml, parserPostcss, parserMarkdown];

const DEFAULT_CODE = {
  javascript: `// JavaScript example
function greet(name) {
  return "Hello, " + name + "!";
}
console.log(greet("Dev Helper Hub"));`,

  typescript: `// TypeScript example
type User = { id: number; name: string };
const user: User = { id: 1, name: "Alice" };
console.log(user);`,

  html: `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Demo</title></head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>`,

  css: `/* CSS example */
:root {
  --accent: #ff004c;
}
body {
  font-family: system-ui, sans-serif;
  color: #fff;
  background: linear-gradient(135deg, #0b0b0b, #121212);
}`,

  json: `{
  "name": "dev-helper-hub",
  "version": "1.0.0",
  "dependencies": {}
}`,

  markdown: `# Hello Dev Helper Hub

Write **Markdown** and format it with Prettier.
`
};

const PARSER_MAP = {
  javascript: { parser: "babel", plugin: parserBabel },
  typescript: { parser: "typescript", plugin: parserTypescript },
  html: { parser: "html", plugin: parserHtml },
  css: { parser: "css", plugin: parserPostcss },
  json: { parser: "json", plugin: parserBabel }, // parser-babel supports JSON
  markdown: { parser: "markdown", plugin: parserMarkdown }
};

export default function CodeFormatter() {
  // core states
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(() => {
    try {
      const saved = localStorage.getItem("ch_code");
      if (saved) return saved;
    } catch {}
    return DEFAULT_CODE.javascript;
  });
  const [formatted, setFormatted] = useState("");
  const [autoFormat, setAutoFormat] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("dark"); // dark or light
  const [showPreview, setShowPreview] = useState(true);

  // Prettier settings state
  const [settings, setSettings] = useState(() => {
    const def = {
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: true,
      trailingComma: "es5",
      bracketSpacing: true,
      arrowParens: "always",
      proseWrap: "preserve",
      endOfLine: "lf"
    };
    try {
      const saved = localStorage.getItem("ch_settings");
      if (saved) return JSON.parse(saved);
    } catch {}
    return def;
  });

  // history for undo/redo
  const [history, setHistory] = useState(() => {
    try {
      const h = JSON.parse(localStorage.getItem("ch_history") || "[]");
      return Array.isArray(h) ? h : [];
    } catch {
      return [];
    }
  });
  const [historyIndex, setHistoryIndex] = useState(history.length - 1);

  const codeRef = useRef(null);
  const autoFormatTimer = useRef(null);

  // Save code and settings to localStorage
  useEffect(() => {
    localStorage.setItem("ch_code", code);
  }, [code]);

  useEffect(() => {
    localStorage.setItem("ch_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("ch_history", JSON.stringify(history));
  }, [history]);

  // push to history when code changes (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      const nextHistory = history.slice(0, historyIndex + 1);
      nextHistory.push({ code, language, settings: { ...settings } });
      setHistory(nextHistory);
      setHistoryIndex(nextHistory.length - 1);
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  // perform format
  const runFormat = (src = code, lang = language, opts = settings) => {
    setError("");
    try {
      const map = PARSER_MAP[lang];
      if (!map) throw new Error(`No parser for language: ${lang}`);

      // Prettier options
      const options = {
        parser: map.parser,
        plugins: PRETTIER_PLUGINS,
        printWidth: Number(opts.printWidth || 80),
        tabWidth: Number(opts.tabWidth || 2),
        useTabs: !!opts.useTabs,
        semi: !!opts.semi,
        singleQuote: !!opts.singleQuote,
        trailingComma: opts.trailingComma || "es5",
        bracketSpacing: !!opts.bracketSpacing,
        arrowParens: opts.arrowParens || "always",
        proseWrap: opts.proseWrap || "preserve",
        endOfLine: opts.endOfLine || "lf"
      };

      // Special-case: JSON needs to be valid or Prettier will throw
      if (lang === "json") {
        // try to parse/beautify via JSON.parse+stringify first to normalize
        // If invalid JSON, fallback to Prettier which will show error
        try {
          const parsed = JSON.parse(src);
          src = JSON.stringify(parsed, null, options.tabWidth);
        } catch (e) {
          // let Prettier handle error
        }
      }

      const out = prettier.format(src, options);
      setFormatted(out);
      return out;
    } catch (e) {
      setError(e.message || String(e));
      return null;
    }
  };

  // initial format on mount or when language changes
  useEffect(() => {
    const out = runFormat(code, language, settings);
    if (out) setFormatted(out);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // auto-format while typing (debounced)
  useEffect(() => {
    if (!autoFormat) return;
    if (autoFormatTimer.current) clearTimeout(autoFormatTimer.current);
    autoFormatTimer.current = setTimeout(() => {
      runFormat(code, language, settings);
    }, 700);
    return () => clearTimeout(autoFormatTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, autoFormat, settings, language]);

  // handlers
  const handleFormatClick = () => {
    const out = runFormat(code, language, settings);
    if (out) {
      setCode(out); // update editor with formatted code
      setFormatted(out);
      pushHistory(out);
    }
  };

  const pushHistory = (newCode) => {
    const next = history.slice(0, historyIndex + 1);
    next.push({ code: newCode, language, settings: { ...settings } });
    setHistory(next);
    setHistoryIndex(next.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const idx = historyIndex - 1;
    const item = history[idx];
    if (item) {
      setHistoryIndex(idx);
      setLanguage(item.language || language);
      setCode(item.code);
      setSettings(item.settings || settings);
    }
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const idx = historyIndex + 1;
    const item = history[idx];
    if (item) {
      setHistoryIndex(idx);
      setLanguage(item.language || language);
      setCode(item.code);
      setSettings(item.settings || settings);
    }
  };

  const handleCopy = async (which = "formatted") => {
    try {
      const text = which === "formatted" ? formatted || code : code;
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (e) {
      setError("Copy failed: " + (e.message || e));
    }
  };

  const handleDownload = (which = "formatted") => {
    try {
      const data = which === "formatted" ? formatted || code : code;
      const ext = language === "javascript" ? ".js" : language === "typescript" ? ".ts" : language === "html" ? ".html" : language === "css" ? ".css" : language === "json" ? ".json" : ".txt";
      const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `code${ext}`;
      link.click();
    } catch (e) {
      setError("Download failed: " + (e.message || e));
    }
  };

  const handleShareLink = () => {
    try {
      const payload = {
        code,
        language,
        settings
      };
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      const url = `${window.location.origin}${window.location.pathname}?cf=${encoded}`;
      navigator.clipboard.writeText(url);
      alert("Share link copied to clipboard!");
    } catch (e) {
      setError("Share failed: " + (e.message || e));
    }
  };

  // parse ?cf= query param on load to import shared code
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cf = params.get("cf");
    if (cf) {
      try {
        const decoded = decodeURIComponent(escape(atob(cf)));
        const obj = JSON.parse(decoded);
        if (obj.code) setCode(obj.code);
        if (obj.language) setLanguage(obj.language);
        if (obj.settings) setSettings(obj.settings);
        // after load, format
        setTimeout(() => runFormat(obj.code || "", obj.language || language, obj.settings || settings), 100);
      } catch (e) {
        setError("Failed to load shared code: " + e.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // small helpers to update settings
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`code-formatter ${theme === "dark" ? "dark" : "light"}`}>
      <div className="cf-toolbar">
        <div className="cf-left">
          <select value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="json">JSON</option>
            <option value="markdown">Markdown</option>
          </select>

          <button onClick={handleFormatClick}>Format</button>
          <button onClick={() => handleCopy("formatted")}>Copy formatted</button>
          <button onClick={() => handleDownload("formatted")}>Download</button>
          <button onClick={handleShareLink}>Share link</button>
        </div>

        <div className="cf-right">
          <label className="small">
            Auto
            <input type="checkbox" checked={autoFormat} onChange={e => setAutoFormat(e.target.checked)} />
          </label>

          <label className="small">
            Theme
            <select value={theme} onChange={e => setTheme(e.target.value)}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>

          <button onClick={handleUndo} title="Undo">↶</button>
          <button onClick={handleRedo} title="Redo">↷</button>
          <button onClick={() => { setShowPreview(!showPreview); }}>{showPreview ? "Hide Preview" : "Show Preview"}</button>
        </div>
      </div>

      <div className="cf-settings">
        <div className="settings-grid">
          <label>Print Width
            <input type="number" value={settings.printWidth} onChange={e => updateSetting("printWidth", Number(e.target.value))} />
          </label>
          <label>Tab Width
            <input type="number" value={settings.tabWidth} onChange={e => updateSetting("tabWidth", Number(e.target.value))} />
          </label>
          <label>Use Tabs
            <input type="checkbox" checked={settings.useTabs} onChange={e => updateSetting("useTabs", e.target.checked)} />
          </label>
          <label>Semi
            <input type="checkbox" checked={settings.semi} onChange={e => updateSetting("semi", e.target.checked)} />
          </label>
          <label>Single Quote
            <input type="checkbox" checked={settings.singleQuote} onChange={e => updateSetting("singleQuote", e.target.checked)} />
          </label>
          <label>Trailing Comma
            <select value={settings.trailingComma} onChange={e => updateSetting("trailingComma", e.target.value)}>
              <option value="none">none</option>
              <option value="es5">es5</option>
              <option value="all">all</option>
            </select>
          </label>
          <label>Bracket Spacing
            <input type="checkbox" checked={settings.bracketSpacing} onChange={e => updateSetting("bracketSpacing", e.target.checked)} />
          </label>
          <label>Arrow Parens
            <select value={settings.arrowParens} onChange={e => updateSetting("arrowParens", e.target.value)}>
              <option value="always">always</option>
              <option value="avoid">avoid</option>
            </select>
          </label>
        </div>
      </div>

      <div className="cf-workspace">
        <div className="editor-pane">
          <textarea
            ref={codeRef}
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="// write your code here"
            className="cf-textarea"
          />
        </div>

        {showPreview && (
          <div className="preview-pane">
            <div className="preview-header">
              <button onClick={() => setFormatted(runFormat(code, language, settings) || formatted)}>Preview Format</button>
              <button onClick={() => handleCopy("formatted")}>Copy Preview</button>
            </div>

            <div className="preview-body">
              {error && <div className="cf-error">Error: {error}</div>}
              <SyntaxHighlighter
                language={language === "json" ? "json" : language}
                style={theme === "dark" ? darkStyle : lightStyle}
                showLineNumbers
                wrapLongLines
              >
                {formatted || code}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </div>

      <div className="cf-footer">
        <small>Powered by Prettier — supports common frontend formats. Save is automatic (local).</small>
      </div>
    </div>
  );
}
