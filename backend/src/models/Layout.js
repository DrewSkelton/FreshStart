import mongoose from "mongoose";
import CropAreaModel from "./CropArea.js";
import EquipmentItemModel from "./EquipmentItem.js";


const LayoutSchema = new mongoose.Schema({
    name: { type: String, required: true },
    crop_areas: [{ type: mongoose.Schema.Types.ObjectId, ref: "CropArea" }],  // Use ObjectId with ref
    equipments: [{ type: mongoose.Schema.Types.ObjectId, ref: "EquipmentItem" }],  // Assuming EquipmentItem is a model
    total_cost: { type: Number, default: 0.0 },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
});

const LayoutModel = mongoose.model("Layout", LayoutSchema);
export default LayoutModel; 
