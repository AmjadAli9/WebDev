import React, { useState, useEffect } from "react";
import "./DevToolsPage.css";

export default function DevToolsPage() {
  const [sqlQuery, setSqlQuery] = useState("");
  const [envVars, setEnvVars] = useState([]);
  const [mockData, setMockData] = useState("");
  const [dataType, setDataType] = useState("emails");
  const [serverStatus, setServerStatus] = useState("All systems operational ✅");
  const [schema, setSchema] = useState({ tables: [], relationships: [] });
  const [notification, setNotification] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Notification Handler
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  };

  /* ---------------- SQL Query ---------------- */
  const runSqlQuery = () => {
    if (!sqlQuery.trim()) {
      showNotification("Please write a query before running.");
      return;
    }
    const validSyntax = /^(SELECT|INSERT|UPDATE|DELETE)/i.test(sqlQuery);
    if (!validSyntax) {
      showNotification("Invalid query syntax. Use SELECT, INSERT, UPDATE, or DELETE.");
      return;
    }
    showNotification(`Executing query: ${sqlQuery}`);
    // Simulate result (in a real app, this would hit an API)
    setTimeout(() => showNotification("Query executed successfully!"), 1000);
  };

  const clearSqlQuery = () => {
    setSqlQuery("");
    showNotification("Query cleared.");
  };

  /* ---------------- Environment Variables ---------------- */
  const addEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "" }]);
    showNotification("Added new environment variable.");
  };

  const updateEnvVar = (index, field, value) => {
    const updated = [...envVars];
    updated[index][field] = value;
    setEnvVars(updated);
  };

  const deleteEnvVar = (index) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
    showNotification("Environment variable removed.");
  };

  const copyEnvVars = () => {
    const envText = envVars.map((env) => `${env.key}=${env.value}`).join("\n");
    navigator.clipboard.writeText(envText);
    showNotification("Environment variables copied to clipboard!");
  };

  const importEnvVars = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const vars = text.split("\n").map(line => {
          const [key, value] = line.split("=");
          return { key: key || "", value: value || "" };
        }).filter(v => v.key);
        setEnvVars(vars);
        showNotification("Environment variables imported!");
      };
      reader.readAsText(file);
    }
  };

  /* ---------------- Mock Data Generator ---------------- */
  const generateMockData = (count = 5) => {
    let data;
    switch (dataType) {
      case "emails":
        data = Array.from({ length: count }, (_, i) => `user${i + 1}@example.com`).join("\n");
        break;
      case "usernames":
        data = Array.from({ length: count }, (_, i) => `User_${Math.random().toString(36).substr(2, 5)}`).join("\n");
        break;
      case "numbers":
        data = Array.from({ length: count }, () => Math.floor(Math.random() * 10000)).join("\n");
        break;
      default:
        data = "No data type selected.";
    }
    setMockData(data);
    showNotification(`Generated ${count} mock ${dataType} entries.`);
  };

  const copyMockData = () => {
    navigator.clipboard.writeText(mockData);
    showNotification("Mock data copied to clipboard!");
  };

  /* ---------------- Server Status ---------------- */
  const refreshServerStatus = () => {
    setServerStatus("Checking server status...");
    setTimeout(() => {
      const isOnline = Math.random() > 0.2;
      const status = isOnline ? "All systems operational ✅" : "Some systems are down ❌";
      setServerStatus(status);
      showNotification(`Server status updated: ${status}`);
    }, 1500);
  };

  /* ---------------- Schema Designer (Placeholder) ---------------- */
  const addTable = () => {
    setSchema(prev => ({
      ...prev,
      tables: [...prev.tables, { name: `Table_${prev.tables.length + 1}`, fields: [] }]
    }));
    showNotification("Added new table to schema.");
  };

  // Save State to LocalStorage
  useEffect(() => {
    localStorage.setItem("devToolsState", JSON.stringify({ sqlQuery, envVars, mockData, dataType, serverStatus, schema }));
  }, [sqlQuery, envVars, mockData, dataType, serverStatus, schema]);

  // Load State from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("devToolsState");
    if (saved) {
      const { sqlQuery, envVars, mockData, dataType, serverStatus, schema } = JSON.parse(saved);
      setSqlQuery(sqlQuery);
      setEnvVars(envVars);
      setMockData(mockData);
      setDataType(dataType);
      setServerStatus(serverStatus);
      setSchema(schema);
    }
  }, []);

  return (
    <div className={`devtools-page ${darkMode ? "dark" : ""}`}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
      >
        Toggle {darkMode ? "Light" : "Dark"} Mode
      </button>
      {notification && <div className="alert-popup">{notification}</div>}
      <div className="devtools-grid">
        {/* SQL Query Builder */}
        <div className="tool-card">
          <h2>SQL Query Builder</h2>
          <textarea
            placeholder="Write your SQL query here..."
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
          />
          <div className="flex gap-2">
            <button onClick={runSqlQuery}>Run Query</button>
            <button onClick={clearSqlQuery} className="bg-gray-600 hover:bg-gray-700">Clear</button>
          </div>
        </div>

        {/* Environment Variable Manager */}
        <div className="tool-card">
          <h2>Environment Variable Manager</h2>
          {envVars.map((env, index) => (
            <div key={index} className="flex gap-2 mb-2 items-center">
              <input
                placeholder="Key"
                value={env.key}
                onChange={(e) => updateEnvVar(index, "key", e.target.value)}
              />
              <input
                placeholder="Value"
                value={env.value}
                onChange={(e) => updateEnvVar(index, "value", e.target.value)}
              />
              <button onClick={() => deleteEnvVar(index)} className="danger">✕</button>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <button onClick={addEnvVar} className="bg-green-600 hover:bg-green-700">Add Variable</button>
            {envVars.length > 0 && <button onClick={copyEnvVars}>Copy All</button>}
            <label className="px-2 py-1 text-white">Import .env</label>
            <input type="file" accept=".env" onChange={importEnvVars} className="hidden" id="envFile" />
            <label htmlFor="envFile" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 cursor-pointer">Import</label>
          </div>
        </div>

        {/* Mock Data Generator */}
        <div className="tool-card">
          <h2>Mock Data Generator</h2>
          <select value={dataType} onChange={(e) => setDataType(e.target.value)} />
          <div className="flex gap-2 mb-2">
          </div>
          <div className="flex gap-2 mb-2">
            <button onClick={() => generateMockData(1)} className="bg-purple-600 hover:bg-purple-700">Generate 1</button>
            <button onClick={() => generateMockData(5)} className="bg-purple-600 hover:bg-purple-700">Generate 5</button>
            <button onClick={() => generateMockData(10)} className="bg-purple-600 hover:bg-purple-700">Generate 10</button>
            <button onClick={() => generateMockData(20)} className="bg-purple-600 hover:bg-purple-700">Generate 20</button>
            {mockData && <button onClick={copyMockData}>Copy</button>}
          </div>
          <textarea readOnly value={mockData} />
        </div>

        {/* Server Status Monitor */}
        <div className="tool-card">
          <h2>Server Status Monitor</h2>
          <p className={`server-status ${serverStatus.includes("operational") ? "online" : "offline"}`}>
            {serverStatus}
          </p>
          <button onClick={refreshServerStatus} className="warning">Refresh Status</button>
        </div>

        {/* Database Schema Designer */}
        <div className="tool-card">
          <h2>Database Schema Designer</h2>
          {schema.tables.map((table, index) => (
            <div key={index} className="mb-2">
              <input
                placeholder="Table Name"
                value={table.name}
                onChange={(e) => {
                  const updated = [...schema.tables];
                  updated[index].name = e.target.value;
                  setSchema({ ...schema, tables: updated });
                }}
              />
            </div>
          ))}
          <button onClick={addTable} className="bg-green-600 hover:bg-green-700">Add Table</button>
          <p className="text-gray-400 mt-2">Coming soon: Drag-and-drop tables and relationships.</p>
        </div>
      </div>
    </div>
  );
}