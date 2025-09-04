import { connectToDatabase } from "../_utils/db.js";
import { handleCors } from "../_utils/cors.js";
import LayoutModel from "../_utils/models/Layout.js";

export default async function handler(req, res) {
    return handleCors(req, res, async (req, res) => {
        if (req.method !== 'GET') {
            return res.status(405).json({ message: 'Method not allowed' });
        }

        try {
            await connectToDatabase();
            
            const layouts = await LayoutModel.find().populate("crop_areas");
            res.status(200).json(layouts);
        } catch (error) {
            console.error("Error fetching layouts:", error);
            res.status(500).json({ message: "Error fetching layouts", error: error.message });
        }
    });
}
