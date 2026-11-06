import express from "express";

import protect from "../middleware/authMiddleware.js";
import { getLeaderboard } from "../controllers/leaderboardController.js";

const router = express.Router();

// Only authenticated users can access the leaderboard.
router.use(protect);

router.get("/", getLeaderboard);

export default router;
