import mongoose from "mongoose";
import config from "./config.js";

export const connectDB = async () =>{
    try {
        await mongoose.connect(config.MONGO_URI as string);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("🔴 MongoDB connection error:", error instanceof Error ? error.message : error);
        process.exit(1);
    }
}