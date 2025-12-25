import React from "react";
import { createRoot } from "react-dom/client";
import { Router } from "wouter";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router base="/foodchain">
      <App />
    </Router>
  </React.StrictMode>
);
