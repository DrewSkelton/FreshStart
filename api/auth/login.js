import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../_shared/db.js";
import { handleCors } from "../_shared/cors.js";
import UserModel from "../_shared/models/User.js";

export default async function handler(req, res) {
    return handleCors(req, res, async (req, res) => {
        if (req.method !== 'POST') {
            return res.status(405).json({ message: 'Method not allowed' });
        }

        try {
            await connectToDatabase();
            
            const { email, password } = req.body;

            // Find user
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "User doesn't exist" });
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: "Username or password is incorrect" });
            }

            // Create token
            const token = jwt.sign({ id: user._id }, "secret");

            res.json({ token, userID: user._id });
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ message: "Error during login" });
        }
    });
}
