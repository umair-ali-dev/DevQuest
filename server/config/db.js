import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error(
                "MONGODB_URI is not configured. Check your environment variables."
            );
        }

        const connection = await mongoose.connect(mongoURI);

        console.log(
            `MongoDB Connected: ${connection.connection.host}`
        );
    } catch (error) {
        console.error(
            "MongoDB Connection Failed:",
            error.message
        );

        process.exit(1);
    }
};

export default connectDB;