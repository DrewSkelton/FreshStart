import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import axios from "axios";

// create app
const app = express()
app.use(express.json())
app.use(cors())
const layoutRouter = express.Router();

// import models
import LayoutModel from "../models/Layout.js";
import CropAreaModel from "../models/CropArea.js";
import WaterTaskModel from "../models/WaterTask.js";
import FertTaskModel from "../models/FertTask.js";



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


layoutRouter.get("/get-layout-tasks/:id", async (req, res) => {
    try {
        const layout = await LayoutModel.findById(req.params.id)
            .populate("water_tasks")  // Populate water tasks
            .populate("fert_tasks");  // Populate fertilizer tasks

        if (!layout) {
            return res.status(404).json({ message: "Layout not found" });
        }

        // Extract only the tasks
        const waterTasks = layout.water_tasks;
        const fertTasks = layout.fert_tasks;

        res.status(200).json({
            waterTasks,
            fertTasks
        });

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

import { OpenAI } from 'openai'; 
layoutRouter.get("/generate-schedule-tasks/:id", async (req, res) => {
    try {
        // Initialize OpenAI
        const openai = new OpenAI({
            apiKey: "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"
        });
 
        // Step 1: Fetch the layout object by its ID
        const layout = await LayoutModel.findById(req.params.id).populate('crop_areas');
        if (!layout) {
            return res.status(404).send({ message: "Layout not found" });
        }
 
        // Step 2: Compile crop area information
        const cropData = layout.crop_areas.map((cropArea) => ({
            cropName: cropArea.cropType,
            area: cropArea.width * cropArea.height,
            soilType: layout.soil_ph ? 
                `pH: ${layout.soil_ph}, NPK: ${layout.soil_npk}, OM: ${layout.soil_om}` : 
                "Soil information not available",
            waterRequirements: cropArea.irrigation,
            fertilizationNeeds: cropArea.fertilizerType,
            growthStage: cropArea.predictedYield ? 
                `Predicted yield: ${cropArea.predictedYield} units` : 
                "Growth stage info not available"
        }));
 
        // Step 3: Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-4-0125-preview",  // Updated to use GPT-4 Turbo
            messages: [{
                role: "system",
                content: "You are a precise farming task scheduler. You must generate tasks using exact schema matching and strict enum values. Never deviate from the specified formats and values."
            }, {
                role: "user",
                content: generateOpenAiPrompt({ layoutId: layout._id, crops: cropData })
            }],
            temperature: 0.1,  // Lower temperature for more consistent outputs
            max_tokens: 2000,  // Increased token limit for more detailed responses
            response_format: { type: "json_object" }  // Ensure JSON response
        });
        
        if (!completion.choices || completion.choices.length === 0) {
            throw new Error("No response from OpenAI");
        }
 
        // Parse the response with better error handling
        const tasksString = completion.choices[0].message.content.trim();
        let parsedTasks;
        
        try {
            // Remove any markdown code block indicators if present
            const cleanJson = tasksString.replace(/```json\n?|\n?```/g, '').trim();
            parsedTasks = JSON.parse(cleanJson);
            
            console.log("Cleaned JSON string:", cleanJson);
            console.log("Parsed tasks:", parsedTasks);
        } catch (error) {
            console.error("Original response:", tasksString);
            console.error("Parse error:", error);
            throw new Error(`Failed to parse OpenAI response: ${error.message}`);
        }
 
        // Validate the parsed tasks structure
        if (!parsedTasks || typeof parsedTasks !== 'object') {
            throw new Error('Invalid response structure: not an object');
        }
 
        if (!Array.isArray(parsedTasks.waterTasks) || !Array.isArray(parsedTasks.fertTasks)) {
            throw new Error('Invalid response structure: waterTasks or fertTasks is not an array');
        }
 
        // Validate each task has required fields
        const validateTask = (task, type) => {
            const requiredFields = ['title', 'date', 'startTime'];
            const missingFields = requiredFields.filter(field => !task[field]);
            
            if (missingFields.length > 0) {
                throw new Error(`${type} task missing required fields: ${missingFields.join(', ')}`);
            }
        };
 
        parsedTasks.waterTasks.forEach(task => validateTask(task, 'Water'));
        parsedTasks.fertTasks.forEach(task => validateTask(task, 'Fertilization'));
 
        // Create task models
        const waterTasks = await WaterTaskModel.create(parsedTasks.waterTasks);
        const fertTasks = await FertTaskModel.create(parsedTasks.fertTasks);
 
        // Update layout with new tasks
        layout.water_tasks.push(...waterTasks.map(task => task._id));
        layout.fert_tasks.push(...fertTasks.map(task => task._id));
        await layout.save();
 
        res.status(200).json({
            message: "Tasks generated successfully",
            waterTasks,
            fertTasks
        });
 
    } catch (error) {
        console.error("Task generation error:", error);
        
        if (error.response?.status === 401) {
            return res.status(500).json({ 
                message: "OpenAI API authentication failed. Please check API key configuration." 
            });
        }
        
        if (error.response?.status === 404) {
            return res.status(500).json({ 
                message: "OpenAI API endpoint not found. Please check API configuration." 
            });
        }
 
        if (error.message.includes('Failed to parse')) {
            return res.status(500).json({
                message: "Failed to process the generated tasks",
                error: error.message,
                details: "The AI response format was invalid"
            });
        }
 
        res.status(500).json({
            message: "Failed to generate tasks",
            error: error.message
        });
    }
 });


 const generateOpenAiPrompt = (structuredData) => {
    return `
    Given the following layout information, generate watering and fertilization tasks for each crop area using EXACTLY the schema structure specified below.
    The layout ID is ${structuredData.layoutId}, and the crops information is as follows:
    ${JSON.stringify(structuredData.crops, null, 2)}
  
    You must return ONLY a JSON object with the following structure, NO additional text, markdown or explanations:
    {
      "waterTasks": [
        {
          "title": "string",
          "description": "string",
          "date": "YYYY-MM-DD",
          "startTime": "HH:MM", 
          "endTime": "HH:MM",
          "recurrence": "MUST BE EXACTLY ONE OF THESE STRINGS: 'daily', 'weekly', 'monthly', 'none'",
          "status": "MUST BE EXACTLY ONE OF THESE STRINGS: 'pending', 'completed', 'overdue'",
          "priority": "MUST BE EXACTLY ONE OF THESE STRINGS: 'low', 'medium', 'high'",
          "relatedCrop": "string",
          "taskDetails": {
            "waterAmount": "string",
            "irrigationMethod": "string",
            "fertilizerType": "string",
            "fertilizerAmount": "string",
            "frequency": "string"
          }
        }
      ],
      "fertTasks": [
        {
          "title": "string",
          "description": "string",
          "date": "YYYY-MM-DD",
          "startTime": "HH:MM",
          "endTime": "HH:MM",
          "recurrence": "MUST BE EXACTLY ONE OF THESE STRINGS: 'daily', 'weekly', 'monthly', 'none'",
          "status": "MUST BE EXACTLY ONE OF THESE STRINGS: 'pending', 'completed', 'overdue'",
          "priority": "MUST BE EXACTLY ONE OF THESE STRINGS: 'low', 'medium', 'high'",
          "relatedCrop": "string",
          "taskDetails": {
            "fertilizerType": "string",
            "fertilizerAmount": "string",
            "applicationMethod": "MUST BE EXACTLY ONE OF THESE STRINGS: 'Spraying', 'Soil Application', 'Foliar', 'Drip'",
            "frequency": "MUST BE EXACTLY ONE OF THESE STRINGS: 'daily', 'weekly', 'monthly', 'as needed'"
          }
        }
      ]
    }
 
    IMPORTANT RULES:
    1. ALL fields must be included with non-empty values
    2. Use today's date (${new Date().toISOString().split('T')[0]}) as the starting date
    3. The structure must match EXACTLY - do not add or remove any fields
    4. Each task's fields must use the exact names shown above
    5. For enum fields, you MUST use EXACTLY one of the provided string values - no variations or alternatives
    6. Times should be in 24-hour format (HH:MM)
    7. ALL fields in taskDetails must be filled with appropriate values
    8. DO NOT use any variations of the enum values - they must match EXACTLY as shown
    9. Use the EXACT string values shown in single quotes for enum fields
    `;
};

export default layoutRouter; 
