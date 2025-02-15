import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express()
app.use(express.json())
app.use(cors())

const layoutRouter = express.Router();

/* Creates a layout object when user clicks save button */
layoutRouter.post("/create-layout", async (req, res) => {
    try {
        const { name, crop_areas, equipments, total_cost } = req.body;

        res.status(201).json({ message: "Layout saved successfully", layout: newLayout });
    } catch (error) {
        res.status(500).json({ message: "Error saving layout", error: error.message });
    }
});




export default layoutRouter; 
