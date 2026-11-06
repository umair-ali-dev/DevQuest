import dotenv from "dotenv";
import path from "path";
import { existsSync } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load local environment variables when running on your own machine.
// Production hosting providers supply environment variables directly.
const envPath = path.resolve(__dirname, ".env");

if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
}

const startServer = async () => {
    try {
        // Import application modules after environment loading.
        const { default: app } = await import("./app.js");
        const { default: connectDB } = await import("./config/db.js");

        const PORT = process.env.PORT || 5000;

        await connectDB();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`DevQuest server running on port ${PORT}`);
            console.log(`API health endpoint: /api/health`);
            console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
