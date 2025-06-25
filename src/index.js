// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom"; // ✅ Only here

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
<<<<<<< HEAD
    <BrowserRouter> 
=======
    <BrowserRouter> {/* ✅ Only ONE Router here */}
>>>>>>> 9b2d469fd6f28892b7277d47845433741d5b49ba
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
