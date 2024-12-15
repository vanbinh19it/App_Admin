import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import VocabCategory from "./components/vocab.category";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Router>
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/vocabulary/:category" element={<VocabCategory />} />
          </Routes>
        </div>
      </div>
    </Router>
  </React.StrictMode>
);
