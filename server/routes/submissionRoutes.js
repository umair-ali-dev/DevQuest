import express from "express";
import rateLimit from "express-rate-limit";

import protect from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

import { createSubmissionSchema } from "../validators/submissionValidator.js";
import { createSubmission, getSubmissionById, getMySubmissions } from "../controllers/submissionController.js";

const router = express.Router();

const submissionLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many submissions. Please try again in a minute.",
  },
});

// All submission endpoints require authentication.
router.use(protect);

// Create and evaluate a submission.
router.post(
  "/",
  submissionLimiter,
  validateRequest(createSubmissionSchema),
  createSubmission
);

// Retrieve the authenticated user's submission history.
// Keep this route before /:id.
router.get("/my", getMySubmissions);

// Retrieve a specific submission.
router.get("/:id", getSubmissionById);

export default router;
