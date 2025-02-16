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

// import ml funcs
import modelFunctions from '../ml_funcs/train_model.js';

const { prepareData, createModel, trainModel, loadModel, predict, main } = modelFunctions;


/* Creates a layout object when user clicks save button 

Example data recived with request:
create-layout-request-data: {
  "name": "Farm 5",
  "dimensions": {
    "width": 713,
    "height": 476
  },
  "soil_ph": 1,
  "soil_npk": 1,
  "soil_om": 1,
  "crops": [
    {
      "cropType": "Corn",
      "irrigation": "drip",
      "fertilizerType": "nitrogen",
      "fertilizerMethod": "broadcasting",
      "width": 201,
      "height": 109,
      "x": 199.7734375,
      "y": 57.515625,
      "density": "12"
    },
    {
      "cropType": "Wheat",
      "irrigation": "drip",
      "fertilizerType": "nitrogen",
      "fertilizerMethod": "broadcasting",
      "width": 135,
      "height": 279,
      "x": 491.7734375,
      "y": 75.515625,
      "density": "14"
    }
  ]
}
Total farm area is in meters, while crop area area is in square meters. 
*/
layoutRouter.post("/create-layout", async (req, res) => {
    try {
        const { name, dimensions, soil_ph,soil_npk, soil_om,  crops } = req.body;
        console.log("layout-name: " + name);
        console.log("layout-dimensions: " + JSON.stringify(dimensions, null, 2));
        console.log("crop-areas: " + JSON.stringify(crops, null, 2));
        console.log("create-layout-request-data: " + JSON.stringify(req.body, null, 2))

        let total_area = 0;
        const cropAreaIds = [];
        for (const cropAreaData of crops) {
            // destructure cropAreaData to extract fields like cropType, area, width, height, etc.
            const { cropType, width, height, x, y, irrigation, fertilizerType, fertilizerMethod, density } = cropAreaData;
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
                fertilizerMethod, 
                density
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
            height: dimensions.height,
            soil_ph:soil_ph,
            soil_npk:soil_npk,
            soil_om:soil_om
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


/* trains and saves a model, after loading in data 
run via postman http://localhost:3001/layout/train-save-model to create model
*/
layoutRouter.post("/train-save-model/", async (req, res) => {
    try {
        
        const { X_tensor, Y_tensor } = await prepareData(); // clean data
        // train & save model
        await trainModel(X_tensor, Y_tensor);  

        // test model 
        const exampleInput = [1, 100, 6.5, 40, 3.5, 0, 0, 0, 200]; // Example input
        const model = await loadModel();
        await predict(model, exampleInput);

        res.status(200).json({message:"success train save model"});
    } catch (error) {
        res.status(500).json({ message: "error train & saving model", error: error.message });
    }
});

/* generates predictionby laoding in saved model, given a row of input data
run via postman: 
*/
layoutRouter.post("/train-save-model/", async (req, res) => {
    try {
        
        const { X_tensor, Y_tensor } = await prepareData(); // clean data
        // train & save model
        // await trainModel(X_tensor, Y_tensor);  

        // test model 
        const exampleInput = [1, 100, 6.5, 40, 3.5, 0, 0, 0, 200]; // Example input
        const model = await loadModel();
        predicted_crop_yield = await predict(model, exampleInput);

        res.status(200).json({message:"success train save model"});
    } catch (error) {
        res.status(500).json({ message: "error model predictions", error: error.message });
    }
});
export default layoutRouter; 
