import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
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
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Start loading immediately when location changes
    setLoading(true);

    // Ensure loading screen shows for at least 800ms to prevent flash
    const minLoadingTime = 800;
    const startTime = Date.now();

    // Delay the content display
    const timer = setTimeout(() => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [location]);

  return (
    <BaseLayout>
      <div className="app-container">
        {loading ? (
          <LoadingScreen />
        ) : (
          <div className="content-container">
            <BackButton />
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/layout-planning" element={<LayoutPage />} />
              <Route path="/equipment" element={<EquipmentPage />} />
              <Route path="/layout-dashboard" element={<DashboardPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/crop" element={<CropPage />} />
            </Routes>
          </div>
        )}
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
