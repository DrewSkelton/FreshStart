import express from "express";
import cors from "cors";
import mongoose from "mongoose";


// import routers
import layoutRouter from "./routes/layout_routes.js";

// create express-app
const app = express();
app.use(express.json());
app.use(cors());


// include imported routes
app.use("/layout", layoutRouter);



// connection string with  db-user=admin, db-password
mongoose.connect("mongodb+srv://admin:53tx0WLftZcxANGe@farmstartcluster.qnr2s.mongodb.net/?retryWrites=true&w=majority&appName=farmStartCluster")
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("Error connecting to MongoDB:", err));




app.listen(3001, () => console.log("Sever Started Running on 3001."));