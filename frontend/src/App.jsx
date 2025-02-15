import { useState } from 'react'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LayoutPage from "./pages/LayoutPage";


function App() {

  return (
    <Router>

      <div>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />

          <Route path="/layout-planning" element={<LayoutPage />} />

          <Route path="/register" element={<h1>Register</h1>} />
          <Route path="/login" element={<h1>Login</h1>} />
          

        </Routes>
      </div>
    </Router>
  )
}

export default App;
