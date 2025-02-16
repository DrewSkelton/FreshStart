import { useState, useEffect } from 'react'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LayoutPage from "./pages/LayoutPage";
import EquipmentPage from "./pages/EquipmentPage";
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <Router>
      <div className="app-container">
        <div className="theme-toggle-container">
          <button 
            className="theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/layout-planning" element={<LayoutPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/register" element={<h1>Register</h1>} />
          <Route path="/login" element={<h1>Login</h1>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
