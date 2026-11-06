import express from "express";

import protect from "../middleware/authMiddleware.js";
import { getUserProfile } from "../controllers/profileController.js";

const router = express.Router();

// All profile endpoints require authentication.
router.use(protect);

// GET authenticated user's complete profile.
router.get("/", getUserProfile);

export default router;
