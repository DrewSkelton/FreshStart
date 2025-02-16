import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BackButton = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Don't show the back button on the dashboard
    if (location.pathname === '/layout-dashboard') {
        return null;
    }

    return (
        <button 
            className="back-button"
            onClick={() => navigate('/layout-dashboard')}
            title="Back to Dashboard"
        >
            ←
        </button>
    );
};

export default BackButton; 