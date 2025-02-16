import React from "react";

// Add crop color mapping
export const getCropColor = (cropType) => {
  const colors = {
    'Corn': 'rgba(255, 190, 0, 0.6)',    // Golden yellow
    'Wheat': 'rgba(255, 220, 115, 0.6)',  // Light wheat
    'Tomatoes': 'rgba(220, 38, 38, 0.6)', // Red
    'Potatoes': 'rgba(165, 93, 53, 0.6)', // Brown
    'Soybeans': 'rgba(132, 204, 22, 0.6)', // Green
    'Unknown': 'rgba(144, 238, 144, 0.6)'  // Light green (default)
  };
  return colors[cropType] || colors['Unknown'];
};

const CropArea = ({ crop, setSelectedCrop, isSelected }) => {
    return (
        <button
            className="crop-area"
            style={{
                position: "absolute",
                left: crop.x,
                top: crop.y,
                width: crop.width,
                height: crop.height,
                backgroundColor: getCropColor(crop.cropType),
                border: isSelected ? "3px solid #43873b" : "1px solid #43873b40",
                boxShadow: isSelected ? "0 0 0 3px rgba(67, 135, 59, 0.4)" : "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "0.9rem",
                fontWeight: "500",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                transition: "all 0.2s ease",
                outline: "none",
                padding: 0
            }}
            onClick={(e) => {
                e.stopPropagation(); // Prevent farm area clicks
                setSelectedCrop(crop);
            }}
        >
            {crop.cropType !== "Unknown" ? crop.cropType : "Click to edit"}
        </button>
    );
};

export default CropArea;