import React, { useState } from "react";
import CropArea from "../components/CropArea";
import CropForm from "../components/CropForm";


const FarmArea = ({ farmDimensions }) => {
    const [cropAreas, setCropAreas] = useState([]);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState(null);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    };

    const handleMouseUp = (e) => {
        if (!isDragging) return;
        setIsDragging(false);

        const endPos = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };

        // Calculate dimensions
        const width = Math.abs(endPos.x - startPos.x);
        const height = Math.abs(endPos.y - startPos.y);

        if (width > 10 && height > 10) {
            const newCrop = {
                id: Date.now(),
                x: Math.min(startPos.x, endPos.x),
                y: Math.min(startPos.y, endPos.y),
                width,
                height,
                cropType: "Unknown",
                color: "lightgreen"
            };
            setCropAreas([...cropAreas, newCrop]);
        }
    };

    return (
        <div
            className="farm-area"
            style={{
                position: "relative",
                width: farmDimensions.width,
                height: farmDimensions.height,
                border: "2px solid black",
                backgroundColor: "#f5f5f5"
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            {cropAreas.map((crop) => (
                console.log("crop: " + JSON.stringify(crop)),
                <CropArea
                    key={crop.id}
                    crop={crop}
                    setSelectedCrop={setSelectedCrop}
                />
                
            ))}
            
            {selectedCrop && <CropForm crop={selectedCrop} setSelectedCrop={setSelectedCrop} />}
        </div>
    );
};

export default FarmArea;