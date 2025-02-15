const mongoose = require("mongoose");

const CropAreaSchema = new mongoose.Schema({
    cropType: { type: String, required: true },
    area: { type: Number, required: true },  // need to compute
    width: { type: Number, required: true },  // width/height
    height: { type: Number, required: true }, 
    x: { type: Number, required: true },  // (x,y) in total farm layout
    y: { type: Number, required: true },  // Y position in the layout
    irrigation: { type: String, required: true },
    fertilizerType: { type: String, required: true },
    fertilizerMethod: { type: String, required: true }
});

module.exports = CropAreaSchema;