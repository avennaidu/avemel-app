import "./storage.js"; // installs window.storage (must load before App)
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Persistent login session for the deployed app (survives app restart).
// The Claude preview has no window.authStore, so it just keeps session in memory.
window.authStore = {
  get: () => { try { return localStorage.getItem("avemel-session"); } catch { return null; } },
  set: (v) => { try { localStorage.setItem("avemel-session", v); } catch {} },
};

createRoot(document.getElementById("root")).render(<App />);
