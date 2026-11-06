import express from "express";
import rateLimit from "express-rate-limit";

import protect from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

import { executeCodeSchema } from "../validators/executeValidator.js";
import { runCode } from "../controllers/executeController.js";

const router = express.Router();

const executeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many code execution requests. Please try again in a minute.",
  },
});

// All execution requests require authentication.
router.use(protect);

router.post(
  "/run",
  executeLimiter,
  validateRequest(executeCodeSchema),
  runCode
);

export default router;
