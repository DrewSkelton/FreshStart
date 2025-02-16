import React, { useState } from "react";
import "../styles/CropForm.css";

const CropForm = ({ crop, setSelectedCrop, onCropUpdate, onDelete }) => {
    const [formData, setFormData] = useState({
        cropType: crop.cropType || "Unknown",
        irrigation: crop.irrigation || "drip",
        fertilizerType: crop.fertilizerType || "nitrogen",
        fertilizerMethod: crop.fertilizerMethod || "broadcasting"
    });

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
        <div className="crop-form-content">
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

            <div className="crop-form-actions">
                <button className="crop-form-button" onClick={handleSave}>Save Changes</button>
                <button className="crop-form-button delete" onClick={onDelete}>Delete Crop Area</button>
            </div>
        </div>
    );
};

export default CropForm;