import { useState } from 'react'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LayoutPage from "./pages/LayoutPage";
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';


function App() {

  return (
    <Router>

      <div>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />

          <Route path="/layout-planning" element={<LayoutPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          

        </Routes>
      </div>
    </Router>
  )
}

export default App;
