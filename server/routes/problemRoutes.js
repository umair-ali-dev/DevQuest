import express from "express";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

import {
    createProblemSchema,
    updateProblemSchema,
} from "../validators/problemValidator.js";

import {
    getProblems,
    getProblemBySlug,
    createProblem,
    updateProblem,
    deleteProblem,
    getAdminProblemById
} from "../controllers/problemController.js";

const router = express.Router();

// All problem endpoints require authentication.
router.use(protect);

// Read operations: authenticated users.
router.get("/", getProblems);
router.get("/admin/:id", adminOnly, getAdminProblemById);
router.get("/:slug", getProblemBySlug);

// Write operations: administrators only.
router.post(
    "/",
    adminOnly,
    validateRequest(createProblemSchema),
    createProblem
);

router.patch(
    "/:id",
    adminOnly,
    validateRequest(updateProblemSchema),
    updateProblem
);

router.delete("/:id", adminOnly, deleteProblem);

export default router;