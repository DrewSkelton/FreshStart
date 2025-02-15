const mongoose = require("mongoose");

const LayoutSchema = new mongoose.Schema({
    name: { type: String, required: true },
    crop_areas: { type: [CropAreaSchema], default: [] },
    equipments: { type: [EquipmentItemSchema], default: [] },
    total_cost: { type: Number, default: 0.0 },
    
});

const Layout = mongoose.model("Layout", LayoutSchema);
module.exports = Layout;