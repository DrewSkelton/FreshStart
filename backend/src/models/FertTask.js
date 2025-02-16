import mongoose from "mongoose";

const FertTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  startTime: { type: String, required: true }, // Format: HH:MM
  endTime: { type: String },
  recurrence: { type: String, enum: ["daily", "weekly", "monthly", "none"], default: "none", required:false },
  status: { type: String, enum: ["pending", "completed", "overdue"], default: "pending" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  relatedCrop: { type: String },
  taskDetails: {
    // Removed waterAmount, irrigationMethod to make it fertilizer-specific
    fertilizerType: { type: String, required: true },
    fertilizerAmount: { type: String, required: true },
    applicationMethod: { type: String, enum: ["Spraying", "Soil Application", "Foliar", "Drip"], required: true },
    frequency: { type: String, enum: ["daily", "weekly", "monthly", "as needed"], default: "weekly", required:false }
  }
});


const FertTaskModel = mongoose.model("FertTask", FertTaskSchema);
export default FertTaskModel; 
