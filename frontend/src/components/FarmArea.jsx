import React, { useState } from "react";
import CropArea from "./CropArea";

const FarmArea = ({ farmDimensions, cropAreas, setCropAreas, selectedCrop, setSelectedCrop }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState(null);
    const [currentPos, setCurrentPos] = useState(null);
    const [hasOverlap, setHasOverlap] = useState(false);

    // Check if two rectangles overlap
    const checkOverlap = (rect1, rect2) => {
        return !(rect1.x + rect1.width <= rect2.x ||
                rect2.x + rect2.width <= rect1.x ||
                rect1.y + rect1.height <= rect2.y ||
                rect2.y + rect2.height <= rect1.y);
    };

    // Check if the current selection overlaps with any existing crop areas
    const checkForOverlaps = (selection) => {
        return cropAreas.some(crop => checkOverlap(crop, selection));
    };

    const handleMouseDown = (e) => {
        if (e.target !== e.currentTarget) return; // Only allow drawing on the main farm area
        setIsDragging(true);
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setStartPos({ x, y });
        setCurrentPos({ x, y });
        setHasOverlap(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setCurrentPos({ x, y });

        if (startPos) {
            const width = Math.abs(x - startPos.x);
            const height = Math.abs(y - startPos.y);
            const selectionRect = {
                x: Math.min(startPos.x, x),
                y: Math.min(startPos.y, y),
                width,
                height
            };
            setHasOverlap(checkForOverlaps(selectionRect));
        }
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

            // Only add if there's no overlap
            if (!checkForOverlaps(newCrop)) {
                setCropAreas([...cropAreas, newCrop]);
            }
        }
        setStartPos(null);
        setCurrentPos(null);
        setHasOverlap(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        setStartPos(null);
        setCurrentPos(null);
        setHasOverlap(false);
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
            border: `2px dashed ${hasOverlap ? '#ef4444' : '#43873b'}`,
            backgroundColor: hasOverlap ? 'rgba(239, 68, 68, 0.1)' : 'rgba(67, 135, 59, 0.1)',
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
                cursor: isDragging ? (hasOverlap ? "not-allowed" : "crosshair") : "default",
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
        </div>
    );
};

export default FarmArea;