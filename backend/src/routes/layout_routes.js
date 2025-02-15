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
layout-name: Farm1
layout-dimensions: {
  "width": 640,
  "height": 426
}
crop-areas: [
  {
    "cropType": "Corn",
    "width": 520,
    "height": 130,
    "x": 52.8515625,
    "y": 216.5390625
  },
  {
    "cropType": "Tomatoes",
    "irrigation": "sprinkler",
    "fertilizerType": "nitrogen",
    "fertilizerMethod": "broadcasting",
    "width": 235,
    "height": 66,
    "x": 191.8515625,
    "y": 45.5390625
  }
]
Toal farm area is in meters, while crop area area is in square meters. 
*/
layoutRouter.post("/create-layout", async (req, res) => {
    try {

        const { name, dimensions, crops } = req.body;
        console.log("layout-name: " + name);
        console.log("layout-dimensions: " + JSON.stringify(dimensions, null, 2));
        console.log("crop-areas: " + JSON.stringify(crops, null, 2));

        const new_layout = new LayoutModel({});

        res.status(201).json({ message: "Layout saved successfully" }); //  layout: newLayout 
    } catch (error) {
        res.status(500).json({ message: "Error saving layout", error: error.message });
    }
});




export default layoutRouter; 
