import mongoose from "mongoose";
import { MONGO_URI } from "./env.config.js";


export const connDB = async () => {
    try {

        await mongoose.connect(MONGO_URI);

        console.log("Successfully Connected to DB");

    } catch (e) {
        console.log("Failed to connect to DB: ", e.message);
        process.exit(1);
    }
}