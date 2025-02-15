import React, { useState } from "react";
import CropForm from "./CropForm";

const CropArea = ({ crop, setSelectedCrop }) => {
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
                border: "1px solid black",
                cursor: "pointer"
            }}
            onClick={(e) => {
                e.stopPropagation(); // Prevent farm area clicks
                setSelectedCrop(crop);
            }}
        >
            {crop.cropType}
        </button>
    );
};

export default CropArea;