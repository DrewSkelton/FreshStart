import mongoose from "mongoose";
import CropAreaModel from "./CropArea.js";
import EquipmentItemModel from "./EquipmentItem.js";
import WaterTaskModel from "./WaterTask.js";
import FertTaskModel from "./FertTask.js";



const LayoutSchema = new mongoose.Schema({
    name: { type: String, required: true }, // need to get name textbox
    crop_areas: [{ type: mongoose.Schema.Types.ObjectId, ref: "CropArea" }],  // Use ObjectId with ref
    equipments: [{ type: mongoose.Schema.Types.ObjectId, ref: "EquipmentItem" }],  // Assuming EquipmentItem is a model
    total_cost: { type: Number, default: 0.0 },
    total_area: { type: Number, default: 0.0 },
    width: { type: Number, required: true },
    height: { type: Number, required: true },

    soil_ph: { type: Number, required: false },
    soil_npk: { type: Number, required: false },
    soil_om: { type: Number, required: false },

    total_yield: { type: Number, default: 0.0, required: false },

    water_tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "WaterTask", required:false}],
    fert_tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "FertTask", required:false}]

   
});

const LayoutModel = mongoose.model("Layout", LayoutSchema);
export default LayoutModel; 
