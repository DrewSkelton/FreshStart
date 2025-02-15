import React, { useState, useEffect, useRef } from "react";
import "../styles/CropForm.css";

const CropForm = ({ crop, setSelectedCrop, onCropUpdate }) => {
    const formRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [transform, setTransform] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const [formData, setFormData] = useState({
        cropType: crop.cropType || "Unknown",
        irrigation: crop.irrigation || "drip",
        fertilizerType: crop.fertilizerType || "nitrogen",
        fertilizerMethod: crop.fertilizerMethod || "broadcasting"
    });

    useEffect(() => {
        if (formRef.current) {
            const rect = formRef.current.getBoundingClientRect();
            const farmArea = formRef.current.closest('.farm-area');
            const farmRect = farmArea.getBoundingClientRect();

            // Calculate available space in different directions
            const spaceBelow = farmRect.height - (crop.y + crop.height);
            const spaceAbove = crop.y;
            const spaceRight = farmRect.width - crop.x;
            const spaceLeft = crop.x + crop.width;

            let top, left, newTransform = '';

            // Determine vertical position
            if (spaceBelow >= rect.height + 10) {
                top = crop.y + crop.height + 10;
            } else if (spaceAbove >= rect.height + 10) {
                top = crop.y - 10;
                newTransform = 'translateY(-100%)';
            } else {
                top = Math.max(10, Math.min(
                    farmRect.height - rect.height - 10,
                    crop.y + (crop.height / 2) - (rect.height / 2)
                ));
            }

            if (spaceRight >= rect.width + 10) {
                left = crop.x;
            } else if (spaceLeft >= rect.width + 10) {
                left = crop.x + crop.width - rect.width;
            } else {
                left = Math.max(10, Math.min(
                    farmRect.width - rect.width - 10,
                    crop.x + (crop.width / 2) - (rect.width / 2)
                ));
            }

            setPosition({ top, left });
            setTransform(newTransform);
        }
    }, [crop]);

    const handleMouseDown = (e) => {
        if (e.target.tagName.toLowerCase() === 'h3') {
            setIsDragging(true);
            const rect = formRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && formRef.current) {
            e.preventDefault();
            const farmArea = formRef.current.closest('.farm-area');
            const farmRect = farmArea.getBoundingClientRect();
            const formRect = formRef.current.getBoundingClientRect();

            let newLeft = e.clientX - farmRect.left - dragOffset.x;
            let newTop = e.clientY - farmRect.top - dragOffset.y;

            newLeft = Math.max(0, Math.min(newLeft, farmRect.width - formRect.width));
            newTop = Math.max(0, Math.min(newTop, farmRect.height - formRect.height));

            setPosition({
                left: newLeft,
                top: newTop
            });
            setTransform('');
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleFormClick = (e) => {
        e.stopPropagation();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        onCropUpdate({
            ...crop,
            [name]: value
        });
    };

    const handleSave = () => {
        onCropUpdate({
            ...crop,
            ...formData
        });
        setSelectedCrop(null);
    };

    return (
        <div 
            ref={formRef}
            className={`crop-form ${isDragging ? 'dragging' : ''}`}
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                transform: transform
            }}
            onClick={handleFormClick}
        >
            <h3 onMouseDown={handleMouseDown}>Edit Crop Data</h3>
            
            <div className="crop-form-field">
                <label htmlFor="cropType">Crop Type:</label>
                <select 
                    id="cropType" 
                    name="cropType" 
                    value={formData.cropType}
                    onChange={handleInputChange}
                >
                    <option value="Unknown">Select a crop type...</option>
                    <option value="Corn">Corn</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Tomatoes">Tomatoes</option>
                    <option value="Potatoes">Potatoes</option>
                    <option value="Soybeans">Soybeans</option>
                </select>
            </div>

            <div className="crop-form-field">
                <label htmlFor="irrigation">Irrigation Type:</label>
                <select 
                    id="irrigation" 
                    name="irrigation" 
                    value={formData.irrigation}
                    onChange={handleInputChange}
                >
                    <option value="drip">Drip</option>
                    <option value="sprinkler">Sprinkler</option>
                    <option value="flood">Flood</option>
                </select>
            </div>

            <div className="crop-form-field">
                <label htmlFor="fertilizerType">Fertilizer Type:</label>
                <select 
                    id="fertilizerType" 
                    name="fertilizerType" 
                    value={formData.fertilizerType}
                    onChange={handleInputChange}
                >
                    <option value="nitrogen">Nitrogen-Based</option>
                    <option value="phosphorus">Phosphorus-Based</option>
                    <option value="potassium">Potassium-Based</option>
                </select>
            </div>

            <div className="crop-form-field">
                <label htmlFor="fertilizerMethod">Fertilization Method:</label>
                <select 
                    id="fertilizerMethod" 
                    name="fertilizerMethod" 
                    value={formData.fertilizerMethod}
                    onChange={handleInputChange}
                >
                    <option value="broadcasting">Broadcasting</option>
                    <option value="fertigation">Fertigation</option>
                    <option value="side-dressing">Side-Dressing</option>
                </select>
            </div>

            <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default CropForm;