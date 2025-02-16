import mongoose from "mongoose";

const WaterTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  startTime: { type: String, required: true }, // Format: HH:MM
  endTime: { type: String },
  recurrence: { type: String, enum: ["daily", "weekly", "monthly", "none"], default: "none" },
  status: { type: String, enum: ["pending", "completed", "overdue"], default: "pending" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  relatedCrop: { type: String },
  taskDetails: {
    waterAmount: { type: String },
    irrigationMethod: { type: String },
    fertilizerType: { type: String },
    fertilizerAmount: { type: String },
    frequency: { type: String }
  }
});


const WaterTaskModel = mongoose.model("WaterTask", WaterTaskSchema);
export default WaterTaskModel; 
