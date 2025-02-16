import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LayoutPage from "./pages/LayoutPage";
import EquipmentPage from "./pages/EquipmentPage";
import './App.css';
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/layout-planning" element={<LayoutPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/layout-dashboard" element={<DashboardPage />} />
          <Route path="/register" element={<h1>Register</h1>} />
          <Route path="/login" element={<h1>Login</h1>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
