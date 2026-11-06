import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import executeRoutes from "./routes/executeRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();

// Trust proxy configuration will be set according to the hosting provider
// when deployment infrastructure is selected.

// Security middleware
app.use(helmet());

// Allowed frontend origins.
// Multiple origins can be separated by commas in CLIENT_URL.
const allowedOrigins = (
    process.env.CLIENT_URL || "http://localhost:5173"
)
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

// CORS configuration
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests without an Origin header (e.g. server-to-server
            // requests and health checks).
            if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ""))) {
                return callback(null, true);
            }

            return callback(null, false);
        },
        credentials: true,
    })
);

// Parse incoming JSON
app.use(express.json({ limit: "1mb" }));

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Parse cookies
app.use(cookieParser());

// API routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/execute", executeRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/profile", profileRoutes);

// Welcome route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to DevQuest API 🚀",
    });
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found",
    });
});

export default app;
