import React, { useState } from "react";

const CropForm = ({ crop, setSelectedCrop }) => {
    const handleFormClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div 
            className="crop-form"
            style={{
                position: "absolute",
                top: crop.y + crop.height + 10,
                left: crop.x,
                backgroundColor: "white",
                padding: "10px",
                border: "1px solid black",
                zIndex: 10
            }}
            onClick={handleFormClick}
        >
            <h3>Edit Crop Data:</h3>
            <label>Crop Type:</label>
            <select name="cropType" value={crop.cropType}>
                <option value="corn">Corn</option>
                <option value="wheat">Wheat</option>
                <option value="tomatoes">Tomatoes</option>
            </select>

            <label>Irrigation Type:</label>
            <select name="irrigation" value={crop.irrigation} >
                <option value="drip">Drip</option>
                <option value="sprinkler">Sprinkler</option>
                <option value="flood">Flood</option>
            </select>

            <label>Fertilizer Type:</label>
            <select name="fertilizerType" value={crop.fertilizerType}>
                <option value="nitrogen">Nitrogen-Based</option>
                <option value="phosphorus">Phosphorus-Based</option>
                <option value="potassium">Potassium-Based</option>
            </select>

            <label>Fertilization Method:</label>
            <select name="fertilizerMethod" value={crop.fertilizerMethod} >
                <option value="broadcasting">Broadcasting</option>
                <option value="fertigation">Fertigation</option>
                <option value="side-dressing">Side-Dressing</option>
            </select>

            <button onClick={() => setSelectedCrop(null)}>Save</button>
        </div>
    );
};

export default CropForm;