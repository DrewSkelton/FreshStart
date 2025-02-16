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

const { prepareData, createModel, trainModel, loadModel, predict, main, prepareDataSingleExample } = modelFunctions;


/* Creates a layout object when user clicks save button 

Example data recived with request:
create-layout-request-data: {
  "name": "G2",
  "dimensions": {
    "width": 728,
    "height": 485
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
      "width": 282,
      "height": 156,
      "x": 218,
      "y": 96.35415649414062,
      "density": "0.3",
      "predictedYield": 2.5806121826171875
    },
    {
      "cropType": "Tomatoes",
      "irrigation": "sprinkler",
      "fertilizerType": "nitrogen",
      "fertilizerMethod": "broadcasting",
      "width": 591,
      "height": 184,
      "x": 69,
      "y": 265.6875,
      "density": "0.9",
      "predictedYield": 2.4535138607025146
    },
    {
      "cropType": "Potatoes",
      "irrigation": "drip",
      "fertilizerType": "nitrogen",
      "fertilizerMethod": "broadcasting",
      "width": 48,
      "height": 63,
      "x": 607,
      "y": 83.6875,
      "density": "0.01",
      "predictedYield": 2.841752052307129
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
        console.log("create-layout-request-data: " + JSON.stringify(req.body, null, 2));
        // TBD: calculate total area
        let total_area = 0;
        let total_yield = 0;
        const cropAreaIds = [];
        for (const cropAreaData of crops) {
            // destructure cropAreaData to extract fields like cropType, area, width, height, etc.
            const { cropType, width, height, x, y, irrigation, fertilizerType, fertilizerMethod, density, predictedYield} = cropAreaData;
            let cur_area = width * height;  // compute area of current crop area
            total_area += cur_area; // update area of layout-total-area
            total_yield += predictedYield;

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
                density,
                predictedYield
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
            soil_om:soil_om,
            total_yield:total_yield
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
run via postman: http://localhost:3001/layout/get-prediction
Data:
get-prediction-request-data: {
  "dimensions": {
    "width": 794,
    "height": 529
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
      "width": 247,
      "height": 154,
      "x": 228.2708282470703,
      "y": 159.02083587646484,
      "density": 0
    }
  ]
}
*/
layoutRouter.post("/get-prediction/", async (req, res) => {
    
        const  crops  = req.body.crops;
        console.log("get-prediction-request-data: " + JSON.stringify(req.body, null, 2))
        
    
        // // Load the model (train and save if necessary)
        const model = await loadModel();
    
        const predictedYields = [];
        console.log("crops  loop", crops);
        for (let crop of crops) {
            // Encode the single crop example
            let exampleInput = [
                crop.cropType, 
                crop.width * crop.height,  // Calculate crop area (width * height)
                req.body.soil_ph, 
                req.body.soil_npk,  
                req.body.soil_om,  
                crop.irrigation, 
                crop.fertilizerType, 
                crop.fertilizerMethod,
                crop.density  
              ];
            console.log("exampleInput before**::", exampleInput);
            exampleInput = exampleInput.map(item => {
                // Check if the item is a string and capitalize the first letter
                if (typeof item === 'string') {
                    return item.charAt(0).toUpperCase() + item.slice(1);
                }
                return item; // Return the item as is if it's not a string
            });
            console.log("exampleInput:", exampleInput);


            let encodedExampleInput = await prepareDataSingleExample([exampleInput]);
            encodedExampleInput = encodedExampleInput.X_tensor.arraySync()[0];
            console.log("encodedExampleInput:",encodedExampleInput);

            // use model to predict
            const predictedYield = await predict(model, encodedExampleInput);
            console.log("crop iDDDD: ", crop.id);
            predictedYields.push({ cropId: crop.id, value: predictedYield });
            console.log("predictedYield: ", predictedYield);
        }

        // Send the predictions back to the frontend in response
        console.log("before sent response");
        res.status(200).json({ predictedYields });
        console.log(" after sent response");

    // console.error("Error predicting crop yield:", error.message);
    // res.status(500).json({ message: "Error with prediction", error: error.message });
    
});


export default layoutRouter; 
