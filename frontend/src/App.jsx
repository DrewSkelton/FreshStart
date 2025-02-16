import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CalendarPage from './pages/CalendarPage';
import CropPage from './pages/CropPage';
import LayoutPage from "./pages/LayoutPage";
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import EquipmentPage from "./pages/EquipmentPage";
import DashboardPage from "./pages/DashboardPage";
import BackButton from './components/BackButton';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

function BaseLayout({ children }) {
  return (
    <div className="base-layout">
      <div className="base-background">
        <div className="background-overlay" />
      </div>
      <div className="base-content">
        {children}
      </div>
    </div>
  );
}

function AppContent() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300); // Reduced time for smoother transitions

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <BaseLayout>
      <div className="app-container">
        {loading && <LoadingScreen />}
        <BackButton />
        <Routes>
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
    </BaseLayout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
