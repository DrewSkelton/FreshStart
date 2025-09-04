import { connectToDatabase } from "../_utils/db.js";
import { handleCors } from "../_utils/cors.js";
import modelFunctions from '../_utils/ml_funcs/train_model.js';

const { prepareDataSingleExample, loadModel, predict } = modelFunctions;

export default async function handler(req, res) {
    return handleCors(req, res, async (req, res) => {
        if (req.method !== 'POST') {
            return res.status(405).json({ message: 'Method not allowed' });
        }

        try {
            await connectToDatabase();
            
            const crops = req.body.crops;
            console.log("get-prediction-request-data: " + JSON.stringify(req.body, null, 2));

            // Load the model (train and save if necessary)
            const model = await loadModel();

            const predictedYields = [];
            console.log("crops loop", crops);
            
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
                console.log("encodedExampleInput:", encodedExampleInput);

                // use model to predict
                const predictedYield = await predict(model, encodedExampleInput);
                console.log("crop iDDDD: ", crop.id);
                predictedYields.push({ cropId: crop.id, value: predictedYield });
                console.log("predictedYield: ", predictedYield);
            }

            // Send the predictions back to the frontend in response
            console.log("before sent response");
            res.status(200).json({ predictedYields });
            console.log("after sent response");

        } catch (error) {
            console.error("Error predicting crop yield:", error.message);
            res.status(500).json({ message: "Error with prediction", error: error.message });
        }
    });
}
