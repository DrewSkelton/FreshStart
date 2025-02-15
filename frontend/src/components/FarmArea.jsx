import React, { useState } from "react";
import CropArea from "./CropArea";
import CropForm from "./CropForm";

const FarmArea = ({ farmDimensions, cropAreas, setCropAreas }) => {
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState(null);
    const [currentPos, setCurrentPos] = useState(null);

    const handleMouseDown = (e) => {
        if (e.target !== e.currentTarget) return; // Only allow drawing on the main farm area
        setIsDragging(true);
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setStartPos({ x, y });
        setCurrentPos({ x, y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setCurrentPos({ x, y });
    };

    const handleMouseUp = (e) => {
        if (!isDragging) return;
        setIsDragging(false);

        const rect = e.currentTarget.getBoundingClientRect();
        const endPos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

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
                color: "rgba(144, 238, 144, 0.6)" // semi-transparent light green
            };
            setCropAreas([...cropAreas, newCrop]);
        }
        setStartPos(null);
        setCurrentPos(null);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        setStartPos(null);
        setCurrentPos(null);
    };

    // Calculate selection box dimensions
    const getSelectionBox = () => {
        if (!isDragging || !startPos || !currentPos) return null;

        const width = Math.abs(currentPos.x - startPos.x);
        const height = Math.abs(currentPos.y - startPos.y);
        const left = Math.min(startPos.x, currentPos.x);
        const top = Math.min(startPos.y, currentPos.y);

        return {
            position: "absolute",
            left: `${left}px`,
            top: `${top}px`,
            width: `${width}px`,
            height: `${height}px`,
            border: "2px dashed #43873b",
            backgroundColor: "rgba(67, 135, 59, 0.1)",
            pointerEvents: "none"
        };
    };

    const handleCropUpdate = (updatedCrop) => {
        setCropAreas(currentCropAreas => 
            currentCropAreas.map(crop => 
                crop.id === updatedCrop.id ? updatedCrop : crop
            )
        );
    };

    return (
        <div
            className="farm-area"
            style={{
                position: "relative",
                width: `${farmDimensions.width}px`,
                height: `${farmDimensions.height}px`,
                border: "1px solid #43873b40",
                borderRadius: "4px",
                backgroundColor: "#2a272e",
                cursor: isDragging ? "crosshair" : "default",
                overflow: "hidden"
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            {/* Grid lines for better visualization */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "linear-gradient(#43873b20 1px, transparent 1px), linear-gradient(90deg, #43873b20 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                    opacity: 0.5,
                    pointerEvents: "none"
                }}
            />

            {cropAreas.map((crop) => (
                <CropArea
                    key={crop.id}
                    crop={crop}
                    setSelectedCrop={setSelectedCrop}
                    isSelected={selectedCrop && selectedCrop.id === crop.id}
                />
            ))}
            
            {/* Selection box while dragging */}
            {isDragging && startPos && currentPos && (
                <div style={getSelectionBox()} />
            )}

            {selectedCrop && (
                <CropForm 
                    crop={selectedCrop} 
                    setSelectedCrop={setSelectedCrop}
                    onCropUpdate={handleCropUpdate}
                />
            )}
        </div>
    );
};

export default FarmArea;