import express from "express";

import protect from "../middleware/authMiddleware.js";
import { getDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

// All dashboard data requires authentication.
router.use(protect);

// Get authenticated user's dashboard statistics.
router.get("/", getDashboardStats);

export default router;