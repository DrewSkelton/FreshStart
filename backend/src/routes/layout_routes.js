import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// create app
const app = express()
app.use(express.json())
app.use(cors())
const layoutRouter = express.Router();

// import models
import LayoutModel from "../models/Layout.js";


/* Creates a layout object when user clicks save button 

Example data recived with request:
Connected to MongoDB
layout-dimensions: {
  "width": 640,
  "height": 426
}
crop-areas: [
  {
    "cropType": "Corn",
    "irrigation": "drip",
    "fertilizerType": "nitrogen",
    "fertilizerMethod": "broadcasting",
    "width": 324,
    "height": 189
  }
]
Toal farm area is in meters, while crop area area is in square meters. 
*/
layoutRouter.post("/create-layout", async (req, res) => {
    try {

        const { dimensions, crops } = req.body;
        console.log("layout-dimensions: " + JSON.stringify(dimensions, null, 2));
        console.log("crop-areas: " + JSON.stringify(crops, null, 2));

        const new_layout = new Lay

        res.status(201).json({ message: "Layout saved successfully" }); //  layout: newLayout 
    } catch (error) {
        res.status(500).json({ message: "Error saving layout", error: error.message });
    }
});




export default layoutRouter; 
