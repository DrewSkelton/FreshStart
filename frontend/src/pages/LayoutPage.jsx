import React, { useState } from "react";
import FarmArea from "../components/FarmArea";
import '../styles/LayoutPage.css';

const LayoutPage = () => {
  const [farmDimensions, setFarmDimensions] = useState({ width: 1200, height: 800 });
  const [cropAreas, setCropAreas] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);

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
                {/* Crop form will be moved here */}
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
                <div key={crop.id} className="crop-data-item">
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
