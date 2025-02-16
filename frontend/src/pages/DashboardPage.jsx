import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/DashboardPage.css"; 

const DashboardPage = () => {
    const [layouts, setLayouts] = useState([]);
    const [selectedLayoutId, setSelectedLayoutId] = useState(null);
    const [selectedLayout, setSelectedLayout] = useState(null);

    // Fetch layouts when the component mounts
    useEffect(() => {
        axios.get("http://localhost:3001/layout/get-layouts")
            .then(response => setLayouts(response.data))
            .catch(error => console.error("Error fetching layouts:", error));
    }, []);

    // Fetch the selected layout when selectedLayoutId changes
    useEffect(() => {
        if (selectedLayoutId) {
            axios.get(`http://localhost:3001/layout/get-layout/${selectedLayoutId}`)
                .then(response => setSelectedLayout(response.data))
                .catch(error => console.error("Error fetching layout:", error));
        }
    }, [selectedLayoutId]);

    return (
        <div className="layout-page">
            {/* Sidebar for Layout List */}
            <div className="layout-list">
                {layouts.map(layout => (
                    <div 
                        key={layout._id} 
                        className={`layout-card ${selectedLayoutId === layout._id ? "selected" : ""}`}
                        onClick={() => setSelectedLayoutId(layout._id)}
                    >
                        <h3>{layout.name}</h3>
                        <p>Width: {layout.width} | Height: {layout.height}</p>
                    </div>
                ))}
            </div>

            {/* View Layout Panel */}
            <div className="layout-view">
                {selectedLayout ? (
                    <div className="layout-canvas" style={{ width: selectedLayout.width, height: selectedLayout.height }}>
                        {selectedLayout.crop_areas.map(crop => (
                            <div
                                key={crop._id}
                                className="crop-area"
                                style={{
                                    width: crop.width,
                                    height: crop.height,
                                    position: "absolute",
                                    left: crop.x,
                                    top: crop.y,
                                    border: "1px solid black",
                                }}
                            >
                                <p>{crop.cropType}</p>
                                <p>{crop.area} sq. units</p>
                                <p>Fertilizer: {crop.fertilizerType}</p>
                                <p>Irrigation: {crop.irrigation}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Select a layout to view its details</p>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
