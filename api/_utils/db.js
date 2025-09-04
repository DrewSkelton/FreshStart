import mongoose from "mongoose";

let isConnected = false;

export async function connectToDatabase() {
    if (isConnected) {
        return;
    }

    try {
        const connection = await mongoose.connect(
            "mongodb+srv://admin:53tx0WLftZcxANGe@farmstartcluster.qnr2s.mongodb.net/?retryWrites=true&w=majority&appName=farmStartCluster",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        
        isConnected = connection.connections[0].readyState === 1;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}
