import mongoose from "mongoose";


const EquipmentItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cost: { type: Number, required: true } // Cost of the equipment
});

const EquipmentItemModel = mongoose.model("EquipmentItem", EquipmentItemSchema);

export default EquipmentItemModel; 
