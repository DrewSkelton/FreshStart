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
import CropAreaModel from "../models/CropArea.js";


/* Creates a layout object when user clicks save button 

Example data recived with request:
layout-dimensions: {
  "width": 640,
  "height": 426
}
crop-areas: [
  {
    "cropType": "Corn",
    "irrigation": "sprinkler",
    "fertilizerType": "phosphorus",
    "fertilizerMethod": "side-dressing",
    "width": 520,
    "height": 130,
    "x": 52.8515625,
    "y": 216.5390625
  },
  {
    "cropType": "Tomatoes",
    "irrigation": "sprinkler",
    "fertilizerType": "phosphorus",
    "fertilizerMethod": "fertigation",
    "width": 235,
    "height": 66,
    "x": 191.8515625,
    "y": 45.5390625
  }
]
Total farm area is in meters, while crop area area is in square meters. 
*/
layoutRouter.post("/create-layout", async (req, res) => {
    try {
        const { name, dimensions, crops } = req.body;
        console.log("layout-name: " + name);
        console.log("layout-dimensions: " + JSON.stringify(dimensions, null, 2));
        console.log("crop-areas: " + JSON.stringify(crops, null, 2));

        let total_area = 0;
        const cropAreaIds = [];
        for (const cropAreaData of crops) {
            // destructure cropAreaData to extract fields like cropType, area, width, height, etc.
            const { cropType, width, height, x, y, irrigation, fertilizerType, fertilizerMethod } = cropAreaData;
            let cur_area = width * height;  // compute area of current crop area
            total_area += cur_area; // update area of layout-total-area

            // create and save each crop area
            const newCropArea = new CropAreaModel({
                cropType,
                area: cur_area,  // use calculated area here
                width,
                height,
                x,
                y,
                irrigation,
                fertilizerType,
                fertilizerMethod
            });

            // save the crop area and store its ID in the cropAreaIds array
            const savedCropArea = await newCropArea.save();
            cropAreaIds.push(savedCropArea._id);
        }

        // step 2: Create Layout object and add the crop area IDs to the `crop_areas` field
        let total_cost = 0;
        const layout = new LayoutModel({
            name,
            crop_areas: cropAreaIds,  // Use the crop area IDs created above
            total_cost,
            total_area,
            width: dimensions.width,
            height: dimensions.height
        });

        // step 3: Save the layout object to the database
        const savedLayout = await layout.save();

        res.status(201).json({ message: "Layout saved successfully" }); //  layout: savedLayout 
    } catch (error) {
        res.status(500).json({ message: "Error saving layout", error: error.message });
    }
});


/* 
gets all of the layout objects
*/
layoutRouter.get("/get-layouts", async (req, res) => {
    try {
        const layouts = await LayoutModel.find().populate("crop_areas"); // Populate crop areas
        res.status(200).json(layouts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching layouts", error: error.message });
    }
});


/* gets a single layout object */
layoutRouter.get("/get-layout/:id", async (req, res) => {
    try {
        const layout = await LayoutModel.findById(req.params.id).populate("crop_areas"); // Populate crop areas
        if (!layout) {
            return res.status(404).json({ message: "Layout not found" });
        }
        res.status(200).json(layout);
    } catch (error) {
        res.status(500).json({ message: "Error fetching layout", error: error.message });
    }
});

export default layoutRouter; 
