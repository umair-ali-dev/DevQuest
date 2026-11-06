import mongoose from "mongoose";
import Problem from "../models/Problem.js";
import createSlug from "../utils/createSlug.js";

// Convert a database problem into a safe public response.
// Hidden test cases must never be returned to normal users.
const formatProblem = (problem) => {
    const data = problem.toObject();

    delete data.testCases;
    delete data.createdBy;

    return data;
};

// GET ALL PROBLEMS
export const getProblems = async (req, res) => {
    try {
        const {
            search = "",
            difficulty,
            tag,
            page = 1,
            limit = 10,
            sort = "newest",
        } = req.query;

        const currentPage = Math.max(1, Number(page) || 1);
        const pageSize = Math.min(50, Math.max(1, Number(limit) || 10));

        const filter = {};

        // Admins can request drafts using ?status=Draft.
        if (req.user.role === "admin" && req.query.status === "Draft") {
            filter.status = "Draft";
        } else {
            filter.status = "Published";
        }

        if (difficulty && ["Easy", "Medium", "Hard"].includes(difficulty)) {
            filter.difficulty = difficulty;
        }

        if (tag) {
            filter.tags = tag;
        }

        if (search.trim()) {
            const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filter.title = {
                $regex: safeSearch,
                $options: "i",
            };
        }

        let sortOption = { createdAt: -1 };

        if (sort === "oldest") {
            sortOption = { createdAt: 1 };
        } else if (sort === "title") {
            sortOption = { title: 1 };
        }

        const [problems, total] = await Promise.all([
            Problem.find(filter)
                .select("-testCases -createdBy")
                .sort(sortOption)
                .skip((currentPage - 1) * pageSize)
                .limit(pageSize)
                .lean(),

            Problem.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            problems,
            pagination: {
                total,
                page: currentPage,
                limit: pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        });
    } catch (error) {
        console.error("Get problems error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve problems",
        });
    }
};

// GET SINGLE PROBLEM
export const getProblemBySlug = async (req, res) => {
    try {
        const problem = await Problem.findOne({
            slug: req.params.slug,
        });

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        if (
            problem.status !== "Published" &&
            req.user.role !== "admin"
        ) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        return res.status(200).json({
            success: true,
            problem: formatProblem(problem),
        });
    } catch (error) {
        console.error("Get problem error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve problem",
        });
    }
};

// CREATE PROBLEM
export const createProblem = async (req, res) => {
    try {
        const {
            title,
            description,
            difficulty,
            tags,
            constraints,
            examples,
            starterCode,
            testCases,
            status,
        } = req.body;

        const slug = createSlug(title);

        const existingProblem = await Problem.findOne({ slug });

        if (existingProblem) {
            return res.status(409).json({
                success: false,
                message: "A problem with a similar title already exists",
            });
        }

        const problem = await Problem.create({
            title,
            slug,
            description,
            difficulty,
            tags,
            constraints,
            examples,
            starterCode,
            testCases,
            status,
            createdBy: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Problem created successfully",
            problem: formatProblem(problem),
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Problem slug already exists",
            });
        }

        console.error("Create problem error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create problem",
        });
    }
};

// UPDATE PROBLEM
export const updateProblem = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid problem ID",
            });
        }

        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        const updates = { ...req.body };

        // Regenerate the slug if the title changes.
        if (updates.title && updates.title !== problem.title) {
            const newSlug = createSlug(updates.title);

            const existingProblem = await Problem.findOne({
                slug: newSlug,
                _id: { $ne: problem._id },
            });

            if (existingProblem) {
                return res.status(409).json({
                    success: false,
                    message: "A problem with this title already exists",
                });
            }

            updates.slug = newSlug;
        }

        // Never allow an API request to change ownership.
        delete updates.createdBy;

        Object.assign(problem, updates);

        await problem.save();

        return res.status(200).json({
            success: true,
            message: "Problem updated successfully",
            problem: formatProblem(problem),
        });
    } catch (error) {
        console.error("Update problem error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update problem",
        });
    }
};

// DELETE PROBLEM
export const deleteProblem = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid problem ID",
            });
        }

        const problem = await Problem.findByIdAndDelete(req.params.id);

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Problem deleted successfully",
        });
    } catch (error) {
        console.error("Delete problem error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete problem",
        });
    }
};

// Admin-only problem detail endpoint
export const getAdminProblemById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid problem ID",
            });
        }

        const problem = await Problem.findById(id);

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        return res.status(200).json({
            success: true,
            problem,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
