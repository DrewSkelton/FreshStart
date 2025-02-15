import React from "react";

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
                backgroundColor: crop.color,
                border: isSelected ? "3px solid #43873b" : "1px solid #43873b40",
                boxShadow: isSelected ? "0 0 0 3px rgba(67, 135, 59, 0.4)" : "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "0.9rem",
                fontWeight: "500",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
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