import React, { useState, useEffect } from "react";
import FarmArea from "../components/FarmArea";
import CropForm from "../components/CropForm";
import axios from "axios";
import '../styles/LayoutPage.css';
import { useNavigate } from 'react-router-dom';

const LayoutPage = () => {
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const navigate = useNavigate();

  // calculate initial dimensions based on viewport
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

  const [soilPH, setSoilPH] = useState(1);
  const [soilNPK, setSoilNPK] = useState(1);
  const [soilOM, setSoilOM] = useState(1);

  // update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      setFarmDimensions(calculateInitialDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const resetLayout = () => {
    if (window.confirm("Are you sure you want to reset the layout? All unsaved changes will be lost.")) {
      setName("");
      setCropAreas([]);
      setSelectedCrop(null);
      setSoilPH(1);
      setSoilNPK(1);
      setSoilOM(1);
      setFarmDimensions(calculateInitialDimensions());
    }
  };

  const validateLayout = () => {
    if (!name.trim()) {
      setSaveError("Please enter a name for your layout");
      return false;
    }
    if (cropAreas.length === 0) {
      setSaveError("Please add at least one crop area");
      return false;
    }
    return true;
  };

  const saveLayout = async () => {
    setSaveError("");
    if (!validateLayout()) return;

    setIsSaving(true);
    const layoutData = {
      name: name,
      dimensions: farmDimensions,
      soil_ph: soilPH,
      soil_npk: soilNPK,
      soil_om: soilOM,
      crops: cropAreas.map((crop) => ({
        cropType: crop.cropType,
        irrigation: crop.irrigation,
        fertilizerType: crop.fertilizerType,
        fertilizerMethod: crop.fertilizerMethod,
        width: crop.width,
        height: crop.height,
        x: crop.x,
        y: crop.y,
        density: crop.density,
        predictedYield: crop.predictedYield
      })),
    };

    try {
      const result = await axios.post("http://localhost:3001/layout/create-layout", layoutData);
      console.log("Layout saved:", result.data.message);
      navigate("/layout-dashboard");
    } catch (error) {
      console.error("Error saving layout:", error);
      setSaveError("Failed to save layout. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const predictYield = async () => {
    console.log("before");
    console.log("2. cropAreas:", cropAreas);
    const layoutData = {
      name: name,
      dimensions: farmDimensions,
      soil_ph: soilPH,
      soil_npk: soilNPK,
      soil_om: soilOM,
      crops: cropAreas.map((crop) => ({
        cropType: crop.cropType,
        irrigation: crop.irrigation,
        fertilizerType: crop.fertilizerType,
        fertilizerMethod: crop.fertilizerMethod,
        width: crop.width,
        height: crop.height,
        x: crop.x,
        y: crop.y,
        density: crop.density,
        id: crop.id,
        yieldPrediction: crop.yieldPrediction
      })),
    };
    console.log("after");

    const response = await axios.post("http://localhost:3001/layout/get-prediction", layoutData);
    const predictedYields = response.data.predictedYields;
    console.log("response-predict: ", response.data);
    // Update the crop areas with predicted yields
    console.log("before1");
    setCropAreas(currentCropAreas =>
      currentCropAreas.map(crop => {
        const predictedYield = predictedYields.find(yieldData => yieldData.cropId === crop.id);
        return predictedYield ? { ...crop, predictedYield: predictedYield.value } : crop;
      })
    );
    console.log("after1");

    // compute total yield for the layout (example: sum of predicted yields)
    const totalYield = cropAreas.reduce((sum, crop) => sum + (crop.predictedYield || 0), 0);
    console.log("Total Yield for Layout:", totalYield);
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
                  <label htmlFor="name">Layout Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter layout name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

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

                <div className="soil-controls">
                  <div className="input-group">
                    <label htmlFor="soilPH">Soil pH Level</label>
                    <input
                      id="soilPH"
                      type="number"
                      value={soilPH}
                      onChange={(e) => setSoilPH(Number(e.target.value))}
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="soilNPK">Soil NPK Level</label>
                    <input
                      id="soilNPK"
                      type="number"
                      value={soilNPK}
                      onChange={(e) => setSoilNPK(Number(e.target.value))}
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="soilOM">Soil Organic Matter %</label>
                    <input
                      id="soilOM"
                      type="number"
                      value={soilOM}
                      onChange={(e) => setSoilOM(Number(e.target.value))}
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>

              <div className="instructions">
                <h3>How to use:</h3>
                <ol>
                  <li>Enter a name for your layout</li>
                  <li>Set your farm dimensions</li>
                  <li>Click and drag to create crop areas</li>
                  <li>Click on a crop area to edit its details</li>
                  <li>Save your layout when finished</li>
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

            <div className="layout-actions">
              {saveError && <div className="error-message">{saveError}</div>}
              <div className="action-buttons">
                <button 
                  className="reset-button"
                  onClick={resetLayout}
                  type="button"
                >
                  Reset Layout
                </button>
                <button 
                  className="save-button"
                  onClick={saveLayout}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Layout"}
                </button>
              </div>
            </div>
          </div>

          <div className="crop-data-sidebar">
            <h2>Crop Areas Overview</h2>
            <div className="crop-list">
              {cropAreas.length > 0 ? (
                cropAreas.map((crop) => (
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
                      <p><strong>Density:</strong> {crop.density} plants/m^2</p>
                      <div className="yield-info">
                        <p><strong>Expected Yield:</strong></p>
                        <div className="yield-details">
                          <span className="yield-value">{crop.predictedYield !== undefined ? crop.predictedYield : '--'}</span>
                          <span className="yield-unit"> kg/m2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-crops-message">
                  No crop areas added yet. Click and drag on the farm area to create one.
                </div>         
              )}
              <button onClick={predictYield} >Predict Yield for crop areas</button>
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