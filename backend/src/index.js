import express from "express";
import cors from "cors";
import mongoose from "mongoose";


// import routers
import layoutRouter from "./routes/layout_routes.js";
import userRouter from "./routes/user_routes.js";

// create express-app
const app = express();
app.use(express.json());
app.use(cors());

// // import environment variables in root on backend 
// import dotenv from 'dotenv';
// dotenv.config();
// console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);

// include imported routes
app.use("/layout", layoutRouter);
app.use("/", userRouter);


// TBD: create route that imports ml funcs loads data, train model, gets predictions




// connection string with  db-user=admin, db-password
mongoose.connect("mongodb+srv://admin:53tx0WLftZcxANGe@farmstartcluster.qnr2s.mongodb.net/?retryWrites=true&w=majority&appName=farmStartCluster")
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("Error connecting to MongoDB:", err));




app.listen(3001, () => console.log("Sever Started Running on 3001."));