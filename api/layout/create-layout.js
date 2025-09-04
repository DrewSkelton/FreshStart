import { connectToDatabase } from "../_shared/db.js";
import { handleCors } from "../_shared/cors.js";
import LayoutModel from "../_shared/models/Layout.js";
import CropAreaModel from "../_shared/models/CropArea.js";

export default async function handler(req, res) {
    return handleCors(req, res, async (req, res) => {
        if (req.method !== 'POST') {
            return res.status(405).json({ message: 'Method not allowed' });
        }

        try {
            await connectToDatabase();
            
            const { name, dimensions, soil_ph, soil_npk, soil_om, crops } = req.body;
            console.log("create-layout-request-data: " + JSON.stringify(req.body, null, 2));

            // Create and save crop areas
            const cropAreaIds = [];
            for (const crop of crops) {
                const newCropArea = new CropAreaModel({
                    cropType: crop.cropType,
                    irrigation: crop.irrigation,
                    fertilizerType: crop.fertilizerType,
                    fertilizerMethod: crop.fertilizerMethod,
                    width: crop.width,
                    height: crop.height,
                    x: crop.x,
                    y: crop.y,
                    density: crop.density,
                    predictedYield: crop.predictedYield
                });
                
                const savedCropArea = await newCropArea.save();
                cropAreaIds.push(savedCropArea._id);
            }

            // Create and save layout with references to crop areas
            const newLayout = new LayoutModel({
                name: name,
                dimensions: dimensions,
                soil_ph: soil_ph,
                soil_npk: soil_npk,
                soil_om: soil_om,
                crop_areas: cropAreaIds
            });

            const savedLayout = await newLayout.save();
            res.status(201).json({ message: "Layout created successfully", layoutId: savedLayout._id });
        } catch (error) {
            console.error("Error creating layout:", error);
            res.status(500).json({ message: "Error creating layout", error: error.message });
        }
    });
}
