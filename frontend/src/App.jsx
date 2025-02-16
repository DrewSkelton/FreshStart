import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CalendarPage from './pages/CalendarPage';
import CropPage from './pages/CropPage';
import LayoutPage from "./pages/LayoutPage";
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import EquipmentPage from "./pages/EquipmentPage";
import './App.css';
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>f
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/layout-planning" element={<LayoutPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/layout-dashboard" element={<DashboardPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/crop" element={<CropPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
