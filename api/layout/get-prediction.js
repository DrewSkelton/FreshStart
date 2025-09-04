import { connectToDatabase } from "../_utils/db.js";
import { handleCors } from "../_utils/cors.js";

// Check if we're in production/Vercel environment
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

// Lightweight prediction function for production
function getLightweightPrediction(crop) {
    const baseYields = {
        'Corn': 2.5,
        'Tomatoes': 2.2, 
        'Potatoes': 2.8,
        'Wheat': 2.1,
        'Rice': 1.9
    };
    
    let yield = baseYields[crop.cropType] || 2.0;
    
    // Apply modifiers based on farming practices
    if (crop.irrigation === 'drip') yield *= 1.1;
    else if (crop.irrigation === 'sprinkler') yield *= 1.05;
    
    if (crop.fertilizerType === 'nitrogen') yield *= 1.08;
    else if (crop.fertilizerType === 'phosphorus') yield *= 1.06;
    
    const density = parseFloat(crop.density) || 0.5;
    yield *= (1 + density * 0.5);
    
    return yield;
}

// ML functions will be loaded dynamically when needed

export default async function handler(req, res) {
    return handleCors(req, res, async (req, res) => {
        if (req.method !== 'POST') {
            return res.status(405).json({ message: 'Method not allowed' });
        }

        try {
            await connectToDatabase();
            
            const crops = req.body.crops;
            console.log("get-prediction-request-data: " + JSON.stringify(req.body, null, 2));

            const predictedYields = [];
            console.log("crops loop", crops);
            console.log("Using production mode:", isProduction);
            
            for (let crop of crops) {
                let predictedYield;
                
                if (isProduction) {
                    // Use lightweight prediction in production
                    predictedYield = getLightweightPrediction(crop);
                    console.log("Using lightweight prediction (production mode)");
                } else {
                    // Try to use ML model in development
                    try {
                        const module = await import('./_ml-deps/ml_funcs/train_model.js');
                        const { prepareDataSingleExample, loadModel, predict } = module.default;
                        const model = await loadModel();
                        
                        let exampleInput = [
                            crop.cropType,
                            crop.width * crop.height,
                            req.body.soil_ph,
                            req.body.soil_npk,
                            req.body.soil_om,
                            crop.irrigation,
                            crop.fertilizerType,
                            crop.fertilizerMethod,
                            crop.density
                        ];
                        
                        exampleInput = exampleInput.map(item => {
                            if (typeof item === 'string') {
                                return item.charAt(0).toUpperCase() + item.slice(1);
                            }
                            return item;
                        });
                        
                        const encodedInput = await prepareDataSingleExample([exampleInput]);
                        predictedYield = await predict(model, encodedInput.X_tensor.arraySync()[0]);
                        console.log("Using ML model prediction");
                    } catch (error) {
                        console.log("ML prediction failed, falling back to lightweight:", error.message);
                        predictedYield = getLightweightPrediction(crop);
                    }
                }
                
                console.log("crop ID: ", crop.id);
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
