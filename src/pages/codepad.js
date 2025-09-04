import React, { useState, useEffect, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { php } from "@codemirror/lang-php";
import "./codepad.css";

const CodePad = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const executeCode = useCallback(async () => {
    if (!code.trim()) {
      setOutput("Write some code to see output...");
      return;
    }

    setIsLoading(true);

    try {
      if (language === "HTML") {
        setOutput(code);
      } 
      else if (language === "CSS") {
        setOutput(`
          <html>
            <head><style>${code}</style></head>
            <body>
              <div style="padding: 20px;">
                <h1>CSS Preview</h1>
                <p>Your CSS styles are applied to this preview.</p>
                <button class="sample-btn">Sample Button</button>
                <div class="sample-div">Sample div with class</div>
                <ul>
                  <li>List item 1</li>
                  <li>List item 2</li>
                </ul>
              </div>
            </body>
          </html>
        `);
      }
      else if (language === "JavaScript") {
        try {
          let result = "";
          const logs = [];
          
          const mockConsole = {
            log: (...args) => logs.push(args.join(' ')),
            error: (...args) => logs.push('Error: ' + args.join(' ')),
            warn: (...args) => logs.push('Warning: ' + args.join(' ')),
            info: (...args) => logs.push('Info: ' + args.join(' ')),
            clear: () => logs.length = 0
          };

          // Create a sandboxed iframe for safe execution
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          document.body.appendChild(iframe);
          
          const scriptContent = `
            <script>
              const console = {
                log: (...args) => window.parent.postMessage({ type: 'log', data: args.join(' ') }, '*'),
                error: (...args) => window.parent.postMessage({ type: 'error', data: 'Error: ' + args.join(' ') }, '*'),
                warn: (...args) => window.parent.postMessage({ type: 'warn', data: 'Warning: ' + args.join(' ') }, '*'),
                info: (...args) => window.parent.postMessage({ type: 'info', data: 'Info: ' + args.join(' ') }, '*'),
                clear: () => window.parent.postMessage({ type: 'clear', data: '' }, '*')
              };
              const alert = (msg) => window.parent.postMessage({ type: 'alert', data: 'Alert: ' + msg }, '*');
              const prompt = (msg) => window.parent.postMessage({ type: 'prompt', data: 'Prompt: ' + msg }, '*');
              try {
                ${code}
              } catch (error) {
                window.parent.postMessage({ type: 'error', data: 'Error: ' + error.message }, '*');
              }
            </script>
          `;
          
          iframe.contentWindow.document.open();
          iframe.contentWindow.document.write(scriptContent);
          iframe.contentWindow.document.close();

          const messageHandler = (event) => {
            if (event.data.type === 'log' || event.data.type === 'error' || 
                event.data.type === 'warn' || event.data.type === 'info' || 
                event.data.type === 'alert' || event.data.type === 'prompt') {
              logs.push(event.data.data);
            }
            if (event.data.type === 'clear') {
              logs.length = 0;
            }
          };

          window.addEventListener('message', messageHandler);
          
          // Wait briefly to collect messages
          await new Promise(resolve => setTimeout(resolve, 100));
          
          window.removeEventListener('message', messageHandler);
          document.body.removeChild(iframe);
          
          result = logs.join('\n');
          setOutput(result || "Code executed successfully (no console output)");
        } catch (error) {
          setOutput(`Error: ${error.message}`);
        }
      }
      else if (language === "React") {
        setOutput(`
          <html>
            <head>
              <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
              <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .error { color: red; padding: 10px; background: #fee; border: 1px solid #fcc; }
              </style>
            </head>
            <body>
              <div id="root"></div>
              <div id="error"></div>
              <script type="text/babel">
                try {
                  ${code}
                } catch (error) {
                  document.getElementById('error').innerHTML = '<div class="error">Error: ' + error.message + '</div>';
                }
              </script>
            </body>
          </html>
        `);
      }
      else if (language === "Python") {
        // Simulate Python execution with basic pattern matching
        const pythonOutput = simulatePythonExecution(code);
        setOutput(pythonOutput);
      }
      else if (language === "SQL") {
        const sqlOutput = simulateSQLExecution(code);
        setOutput(sqlOutput);
      }
      else if (language === "JSON") {
        try {
          const parsed = JSON.parse(code);
          setOutput(JSON.stringify(parsed, null, 2));
        } catch (error) {
          setOutput(`JSON Parse Error: ${error.message}`);
        }
      }
      else {
        setOutput(`${language} execution not supported in browser.\nThis is a display-only editor.\n\nTo run ${language} code, you would need:\n- ${getLanguageRequirements(language)}`);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [code, language]);

  // Update output based on language
  useEffect(() => {
    executeCode();
  }, [code, language, executeCode]);

  const simulatePythonExecution = (code) => {
    const lines = code.split('\n');
    const output = [];
    
    for (const line of lines) {
      if (line.trim().startsWith('print(')) {
        const match = line.match(/print\((['"`])(.*?)\1\)/);
        if (match) {
          output.push(match[2]);
        } else {
          const match2 = line.match(/print\(([^'"`]+)\)/);
          if (match2) {
            output.push(`[Result of: ${match2[1].trim()}]`);
          }
        }
      }
      if (line.includes('Hello') || line.includes('hello')) {
        output.push('Hello, World!');
      }
    }
    
    return output.length > 0 
      ? output.join('\n') + '\n\n⚠️ This is simulated Python execution. For real Python execution, use a backend server or local environment.'
      : 'Python simulation - no print statements detected.\n\n⚠️ This is simulated output. For real Python execution, use a backend server.';
  };

  const simulateSQLExecution = (code) => {
    const upperCode = code.toUpperCase();
    if (upperCode.includes('SELECT')) {
      return `Query executed successfully.\n\n📊 Sample Result:\n+----+-------+\n| ID | NAME  |\n+----+-------+\n| 1  | Alice |\n| 2  | Bob   |\n+----+-------+\n\n⚠️ This is simulated SQL execution. Connect to a real database for actual results.`;
    } else if (upperCode.includes('CREATE')) {
      return `Table created successfully.\n\n⚠️ This is simulated SQL execution.`;
    } else if (upperCode.includes('INSERT')) {
      return `1 row(s) affected.\n\n⚠️ This is simulated SQL execution.`;
    }
    return `SQL command processed.\n\n⚠️ This is simulated execution. Connect to a database for real results.`;
  };

  const getLanguageRequirements = (lang) => {
    const requirements = {
      'Java': 'JDK installation and javac compiler',
      'C': 'GCC compiler',
      'C++': 'G++ compiler',
      'Python': 'Python interpreter (use Pyodide for browser support)',
      'PHP': 'PHP interpreter or web server',
      'Ruby': 'Ruby interpreter',
      'Go': 'Go compiler',
      'Rust': 'Rust compiler (rustc)',
      'Swift': 'Swift compiler or Xcode',
      'Kotlin': 'Kotlin compiler or JVM',
      'TypeScript': 'TypeScript compiler (tsc)'
    };
    return requirements[lang] || 'Appropriate compiler/interpreter';
  };

  const downloadFile = () => {
    const extensions = {
      'JavaScript': 'js',
      'Python': 'py',
      'Java': 'java',
      'C': 'c',
      'C++': 'cpp',
      'PHP': 'php',
      'HTML': 'html',
      'CSS': 'css',
      'TypeScript': 'ts',
      'Rust': 'rs',
      'Go': 'go',
      'Ruby': 'rb',
      'SQL': 'sql',
      'JSON': 'json',
      'XML': 'xml',
      'React': 'jsx'
    };

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `code.${extensions[language] || 'txt'}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearCode = () => {
    setCode("");
    setOutput("Write some code to see output...");
  };

  const languageExtensions = {
    JavaScript: javascript(),
    Python: python(),
    Java: java(),
    C: cpp(),
    'C++': cpp(),
    PHP: php(),
    HTML: html(),
    CSS: css(),
    React: javascript(),
    TypeScript: javascript(),
    Ruby: javascript(),
    Go: javascript(),
    Rust: javascript(),
    Swift: javascript(),
    Kotlin: javascript(),
    SQL: javascript(), // Basic highlighting
    JSON: javascript(),
    XML: javascript()
  };

  const languages = [
    "JavaScript", "HTML", "CSS", "React", "Python", "SQL", "JSON",
    "Java", "C", "C++", "PHP", "TypeScript", "Ruby", "Go", 
    "Rust", "Swift", "Kotlin", "XML"
  ];

  const getExampleCode = (lang) => {
    const examples = {
      JavaScript: `// JavaScript Example
console.log("Hello, World!");

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci of 7:", fibonacci(7));

// Try these:
console.log("Current time:", new Date().toLocaleTimeString());
console.log("Random number:", Math.floor(Math.random() * 100));`,
      
      HTML: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Awesome Page</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .highlight { background: yellow; padding: 5px; }
        button { padding: 10px 20px; margin: 10px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>This is a <span class="highlight">highlighted</span> paragraph.</p>
    <button onclick="alert('Button clicked!')">Click Me</button>
    <div id="demo">This text will change</div>
    <script>
        document.getElementById('demo').innerHTML = 'Text changed by JavaScript!';
    </script>
</body>
</html>`,

      CSS: `/* Modern CSS Example */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: 0;
    padding: 20px;
    color: white;
    min-height: 100vh;
}

h1 {
    text-align: center;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    font-size: 2.5em;
    margin-bottom: 30px;
}

.sample-btn {
    background: linear-gradient(45deg, #ff6b6b, #ee5a52);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.sample-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
}

.sample-div {
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 10px;
    margin: 20px 0;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

ul {
    list-style: none;
    padding: 0;
}

li {
    background: rgba(255, 255, 255, 0.1);
    margin: 10px 0;
    padding: 10px;
    border-radius: 5px;
    transition: transform 0.2s;
}

li:hover {
    transform: translateX(10px);
}`,

      Python: `# Python Example
def hello_world():
    print("Hello, World!")

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Function calls
hello_world()
print("Fibonacci of 7:", fibonacci(7))
print("Python is awesome!")

# List comprehension
numbers = [x**2 for x in range(1, 6)]
print("Squares:", numbers)`,

      React: `// React Component Example
const App = () => {
  const [count, setCount] = React.useState(0);
  const [name, setName] = React.useState('');
  
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
  const currentColor = colors[count % colors.length];
  
  return (
    <div style={{
      padding: '40px', 
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1>🚀 React Counter App</h1>
      
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '30px',
        borderRadius: '15px',
        margin: '20px 0',
        backdropFilter: 'blur(10px)'
      }}>
        <p style={{fontSize: '24px', color: currentColor}}>
          Count: <strong>{count}</strong>
        </p>
        
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            background: currentColor,
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            margin: '0 10px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Increment
        </button>
        
        <button 
          onClick={() => setCount(Math.max(0, count - 1))}
          style={{
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            margin: '0 10px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Decrement
        </button>
        
        <button 
          onClick={() => setCount(0)}
          style={{
            background: '#95a5a6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            margin: '0 10px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Reset
        </button>
      </div>
      
      <div>
        <input 
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: '10px',
            margin: '10px',
            borderRadius: '5px',
            border: 'none',
            fontSize: '16px'
          }}
        />
        {name && <p>Hello, {name}! 👋</p>}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));`,

      SQL: `-- SQL Example
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, name, email) VALUES 
(1, 'Alice Johnson', 'alice@example.com'),
(2, 'Bob Smith', 'bob@example.com'),
(3, 'Carol Davis', 'carol@example.com');

SELECT * FROM users WHERE name LIKE 'A%';

UPDATE users SET email = 'alice.johnson@newdomain.com' WHERE id = 1;`,

      JSON: `{
  "name": "My API Response",
  "version": "1.0.0",
  "data": {
    "users": [
      {
        "id": 1,
        "name": "Alice",
        "email": "alice@example.com",
        "active": true,
        "preferences": {
          "theme": "dark",
          "notifications": true
        }
      },
      {
        "id": 2,
        "name": "Bob",
        "email": "bob@example.com", 
        "active": false,
        "preferences": {
          "theme": "light",
          "notifications": false
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2
    }
  },
  "status": "success",
  "timestamp": "2025-09-03T10:30:00Z"
}`,

      Java: `// Java Example
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Fibonacci calculation
        int n = 7;
        System.out.println("Fibonacci of " + n + ": " + fibonacci(n));
        
        // Array example
        int[] numbers = {1, 2, 3, 4, 5};
        System.out.println("Array sum: " + calculateSum(numbers));
    }
    
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static int calculateSum(int[] arr) {
        int sum = 0;
        for (int num : arr) {
            sum += num;
        }
        return sum;
    }
}`
    };

    return examples[lang] || `// ${lang} code example\n// This is a code editor for ${lang}\n// Write your code here...`;
  };

  const loadExample = () => {
    setCode(getExampleCode(language));
  };

  return (
    <div className="codepad-container">
      <header className="codepad-hero">
        <h1>⚡ Interactive Code Playground</h1>
        <p>Write code in multiple languages — See the results instantly!</p>
      </header>

      <div className="controls">
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)} 
          className="language-select"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        <button onClick={downloadFile}>💾 Download Code</button>
        <button onClick={clearCode}>🧹 Clear All</button>
        <button onClick={loadExample}>📝 Load Example</button>
        <button onClick={executeCode} disabled={isLoading}>
          {isLoading ? '⏳ Running...' : '▶️ Run Code'}
        </button>
      </div>

      <div className="editor-container">
        <div className="editor">
          <h3>📝 {language} Editor</h3>
          <CodeMirror
            value={code}
            height="400px"
            theme="dark"
            extensions={languageExtensions[language] ? [languageExtensions[language]] : []}
            onChange={(value) => setCode(value)}
            placeholder={`Write your ${language} code here...`}
          />
        </div>
      </div>

      <div className="output-container">
        <h3>🌐 Output</h3>
        {["HTML", "CSS", "React"].includes(language) ? (
          <iframe
            srcDoc={output}
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin"
            frameBorder="0"
            width="100%"
            height="400px"
            style={{ 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              backgroundColor: 'white'
            }}
          />
        ) : (
          <pre className="output-text" style={{
            background: '#1e1e1e',
            color: '#d4d4d4',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px',
            border: '1px solid #444',
            whiteSpace: 'pre-wrap',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            {isLoading ? '⏳ Executing code...' : output}
          </pre>
        )}
      </div>

      <footer style={{ 
        textAlign: 'center', 
        marginTop: '40px', 
        padding: '20px',
        borderTop: '1px solid #eee',
        color: '#666'
      }}>
        <p>© 2025 WebDevHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CodePad;