import React, { useState, useEffect } from "react";
import FarmArea from "../components/FarmArea";
import CropForm from "../components/CropForm";
import axios from "axios";
import '../styles/LayoutPage.css';

const LayoutPage = () => {
  // Calculate initial dimensions based on viewport
  const calculateInitialDimensions = () => {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const baseWidth = Math.min(1200, vw * 0.6); // 60% of viewport width, max 1200px
    const baseHeight = baseWidth * 0.6667; // Maintain 3:2 aspect ratio
    return {
      width: Math.round(baseWidth),
      height: Math.round(baseHeight)
    };
  };

  const [farmDimensions, setFarmDimensions] = useState(calculateInitialDimensions);
  const [cropAreas, setCropAreas] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);

  // update dimensions on window resize, using use effect
  useEffect(() => {
    const handleResize = () => {
      setFarmDimensions(calculateInitialDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);




  const saveLayout = async () => {
    // Prepare the data object to send to the backend
    const layoutData = {
      dimensions: farmDimensions,
      crops: cropAreas.map((crop) => ({
        cropType: crop.cropType,
        irrigation: crop.irrigation,
        fertilizerType: crop.fertilizerType,
        fertilizerMethod: crop.fertilizerMethod,
        width: crop.width,
        height: crop.height,
        x: crop.x, // (x,y) coors
        y: crop.y
      })),
    };

    try {
      // send post request to backend API to 
      const result = await axios.post("http://localhost:3001/layout/create-layout", layoutData);
      console.log("result: " + result.data.message);

    } catch (error) {
      console.error("Error saving layout:", error.response.data);
    }
  };




  return (
    <div className="layout-wrapper">
      <div className="layout-page">
        <div className="layout-header">
          <h1>Farm Layout Planner</h1>
          <p>Design and organize your farm layout efficiently</p>
        </div>
        
        <div className="layout-content">
          <div className="crop-edit-sidebar">
            {selectedCrop ? (
              <div className="crop-edit-form">
                <h2>Edit Crop Area</h2>
                <CropForm
                  crop={selectedCrop}
                  setSelectedCrop={setSelectedCrop}
                  onCropUpdate={(updatedCrop) => {
                    setCropAreas(currentCropAreas =>
                      currentCropAreas.map(crop =>
                        crop.id === updatedCrop.id ? updatedCrop : crop
                      )
                    );
                  }}
                  onDelete={() => {
                    setCropAreas(currentCropAreas =>
                      currentCropAreas.filter(crop => crop.id !== selectedCrop.id)
                    );
                    setSelectedCrop(null);
                  }}
                />
              </div>
            ) : (
              <div className="crop-edit-placeholder">
                <h2>Crop Editor</h2>
                <p>Select a crop area to edit its details</p>
              </div>
            )}
          </div>

          <div className="layout-main">
            <div className="farm-controls">
              <div className="dimension-controls">
                <div className="input-group">
                  <label htmlFor="width">Farm Width (m)</label>
                  <input
                    id="width"
                    type="number"
                    value={farmDimensions.width}
                    onChange={(e) => setFarmDimensions({ ...farmDimensions, width: Number(e.target.value) })}
                    min="1"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="height">Farm Height (m)</label>
                  <input
                    id="height"
                    type="number"
                    value={farmDimensions.height}
                    onChange={(e) => setFarmDimensions({ ...farmDimensions, height: Number(e.target.value) })}
                    min="1"
                  />
                </div>
              </div>

              <div className="instructions">
                <h3>How to use:</h3>
                <ol>
                  <li>Set your farm dimensions</li>
                  <li>Click and drag to create crop areas</li>
                  <li>Click on a crop area to edit its details</li>
                </ol>
              </div>
            </div>

            <div className="farm-area-container">
              <FarmArea 
                farmDimensions={farmDimensions} 
                cropAreas={cropAreas} 
                setCropAreas={setCropAreas}
                selectedCrop={selectedCrop}
                setSelectedCrop={setSelectedCrop}
              />
            </div>

            <div className="save-container">
              <button 
                className="save-button"
                onClick={saveLayout}
              >
                Save Farm Layout
              </button>
            </div>
          </div>

          <div className="crop-data-sidebar">
            <h2>Crop Areas Overview</h2>
            <div className="crop-list">
              {cropAreas.map((crop) => (
                <div 
                  key={crop.id} 
                  className={`crop-data-item ${selectedCrop && selectedCrop.id === crop.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCrop(crop)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedCrop(crop);
                    }
                  }}
                >
                  <h3>{crop.cropType !== "Unknown" ? crop.cropType : "Undefined Area"}</h3>
                  <div className="crop-details">
                    <p><strong>Irrigation:</strong> {crop.irrigation}</p>
                    <p><strong>Fertilizer:</strong> {crop.fertilizerType}</p>
                    <p><strong>Method:</strong> {crop.fertilizerMethod}</p>
                    <p><strong>Size:</strong> {Math.round(crop.width * crop.height)} sq m</p>
                    <div className="yield-info">
                      <p><strong>Expected Yield:</strong></p>
                      <div className="yield-details">
                        <span className="yield-value">--</span>
                        <span className="yield-unit">kg/year</span>
                      </div>
                      {crop.cropType !== "Unknown" && (
                        <div className="yield-factors">
                          <span className="factor">
                            <span className="dot irrigation"></span>
                            Irrigation efficiency
                          </span>
                          <span className="factor">
                            <span className="dot fertilizer"></span>
                            Fertilizer impact
                          </span>
                          <span className="factor">
                            <span className="dot method"></span>
                            Method efficiency
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {cropAreas.length === 0 && (
                <p className="no-crops">No crop areas defined yet. Click and drag on the farm area to create one.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutPage;
