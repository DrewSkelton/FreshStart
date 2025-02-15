import React, { useState } from "react";
import FarmArea from "../components/FarmArea";
import '../styles/LayoutPage.css';

const LayoutPage = () => {
  const [farmDimensions, setFarmDimensions] = useState({ width: 800, height: 600 });
  const [cropAreas, setCropAreas] = useState([]);

  return (
    <div className="layout-wrapper">
      <div className="layout-page">
        <div className="layout-header">
          <h1>Farm Layout Planner</h1>
          <p>Design and organize your farm layout efficiently</p>
        </div>
        
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
          />
        </div>
      </div>
    </div>
  );
};

export default LayoutPage;
