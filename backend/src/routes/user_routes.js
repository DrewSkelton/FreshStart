import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

const router = express.Router();

// Register endpoint
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
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

// Login endpoint
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
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

export default router;
