import React from 'react';
import '../styles/LoadingScreen.css';

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

export default LoadingScreen; 