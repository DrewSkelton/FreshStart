import { connectToDatabase } from "../_shared/db.js";
import { handleCors } from "../_shared/cors.js";
import LayoutModel from "../_shared/models/Layout.js";

export default async function handler(req, res) {
    return handleCors(req, res, async (req, res) => {
        if (req.method !== 'GET') {
            return res.status(405).json({ message: 'Method not allowed' });
        }

        try {
            await connectToDatabase();
            
            const { id } = req.query;
            const layout = await LayoutModel.findById(id).populate("crop_areas");
            
            if (!layout) {
                return res.status(404).json({ message: "Layout not found" });
            }
            
            res.status(200).json(layout);
        } catch (error) {
            console.error("Error fetching layout:", error);
            res.status(500).json({ message: "Error fetching layout", error: error.message });
        }
    });
}
