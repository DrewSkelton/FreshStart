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
            
            const { username, email, password } = req.body;

            // Check if user already exists
            const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                return res.status(400).json({ message: "Username or email already exists" });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword
            });

            // Save user
            await newUser.save();

            // Create token
            const token = jwt.sign({ id: newUser._id }, "secret");

            res.status(201).json({ token, userID: newUser._id });
        } catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({ message: "Error during registration" });
        }
    });
}
