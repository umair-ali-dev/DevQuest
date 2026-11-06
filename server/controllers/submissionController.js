import mongoose from "mongoose";

import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";

import {
  evaluateSubmission,
} from "../services/submissionEvaluationService.js";

export const createSubmission = async (req, res) => {
  let submission;

  try {
    const { problemId, language, sourceCode } = req.body;

    // Validate the problem ID.
    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid problem ID.",
      });
    }

    // Retrieve the published problem and its test cases.
    // Test cases are only accessed by the backend.
    const problem = await Problem.findOne({
      _id: problemId,
      status: "Published",
    }).select("_id title testCases");

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Published problem not found.",
      });
    }

    if (!problem.testCases || problem.testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: "This problem does not have any test cases.",
      });
    }

    if (problem.testCases.length > 20) {
      return res.status(400).json({
        success: false,
        message: "This problem exceeds the maximum of 20 test cases.",
      });
    }

    // Create the submission before evaluation.
    submission = await Submission.create({
      user: req.user._id,
      problem: problem._id,
      language,
      sourceCode,
      verdict: "Pending",
      passedTestCases: 0,
      totalTestCases: problem.testCases.length,
    });

    // Evaluate submitted code against backend test cases.
    let evaluation;

    try {
      evaluation = await evaluateSubmission({
        sourceCode,
        language,
        testCases: problem.testCases,
      });
    } catch (evaluationError) {
      console.error(
        "Submission evaluation error:",
        evaluationError
      );

      // Preserve the submission if Judge0 fails.
      submission.verdict = "Internal Error";

      submission.errorMessage = (
        evaluationError.message ||
        "Unable to evaluate submission."
      ).slice(0, 5000);

      await submission.save();

      return res.status(201).json({
        success: true,
        message: "Submission saved, but evaluation failed.",
        submission: {
          id: submission._id,
          problemId: problem._id,
          problemTitle: problem.title,
          language: submission.language,
          verdict: submission.verdict,
          passedTestCases: submission.passedTestCases,
          totalTestCases: submission.totalTestCases,
          createdAt: submission.createdAt,
        },
      });
    }

    // Save the final evaluation results.
    submission.verdict = evaluation.verdict;
    submission.passedTestCases = evaluation.passedTestCases;
    submission.totalTestCases = evaluation.totalTestCases;
    submission.executionTime = evaluation.executionTime;
    submission.memory = evaluation.memory;
    submission.testCaseResults = evaluation.testCaseResults;
    submission.errorMessage = evaluation.errorMessage;

    await submission.save();

    return res.status(201).json({
      success: true,
      message: "Submission evaluated successfully.",
      submission: {
        id: submission._id,
        problemId: problem._id,
        problemTitle: problem.title,
        language: submission.language,
        verdict: submission.verdict,
        passedTestCases: submission.passedTestCases,
        totalTestCases: submission.totalTestCases,
        executionTime: submission.executionTime,
        memory: submission.memory,
        testCaseResults: submission.testCaseResults,
        errorMessage: submission.errorMessage,
        createdAt: submission.createdAt,
      },
    });
  } catch (error) {
    console.error("Create submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process submission.",
    });
  }
};

export const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission ID.",
      });
    }

    // Users can only retrieve their own submissions.
    const submission = await Submission.findOne({
      _id: id,
      user: req.user._id,
    })
      .select("-sourceCode")
      .populate("problem", "title slug");

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    return res.status(200).json({
      success: true,
      submission: {
        id: submission._id,
        problemId: submission.problem?._id,
        problemTitle: submission.problem?.title,
        language: submission.language,
        verdict: submission.verdict,
        passedTestCases: submission.passedTestCases,
        totalTestCases: submission.totalTestCases,
        executionTime: submission.executionTime,
        memory: submission.memory,
        testCaseResults: submission.testCaseResults,
        errorMessage: submission.errorMessage,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve submission.",
    });
  }
};

export const getMySubmissions = async (req, res) => {
  try {
    const allowedVerdicts = [
      "Pending",
      "Accepted",
      "Wrong Answer",
      "Time Limit Exceeded",
      "Runtime Error",
      "Compilation Error",
      "Internal Error",
    ];

    const { page: pageQuery, limit: limitQuery, verdict } = req.query;

    // Validate pagination parameters.
    const parsePositiveInteger = (value, fallback) => {
      if (value === undefined) return fallback;

      if (!/^\d+$/.test(value)) return null;

      const parsed = Number(value);

      return Number.isSafeInteger(parsed) && parsed >= 1
        ? parsed
        : null;
    };

    const page = parsePositiveInteger(pageQuery, 1);
    const limit = parsePositiveInteger(limitQuery, 10);

    if (!page || !limit) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be positive integers.",
      });
    }

    if (limit > 50) {
      return res.status(400).json({
        success: false,
        message: "The maximum page limit is 50.",
      });
    }

    // Validate optional verdict filter.
    if (
      verdict &&
      verdict !== "all" &&
      !allowedVerdicts.includes(verdict)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission verdict filter.",
      });
    }

    // Always restrict results to the authenticated user.
    const filter = {
      user: req.user._id,
    };

    if (verdict && verdict !== "all") {
      filter.verdict = verdict;
    }

    const skip = (page - 1) * limit;

    // Retrieve submissions without source code or test-case details.
    const [submissions, total, verdictStats] = await Promise.all([
      Submission.find(filter)
        .select(
          "problem language verdict passedTestCases totalTestCases executionTime memory createdAt"
        )
        .populate("problem", "title slug")
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Submission.countDocuments(filter),

      // Overall statistics are independent of the selected filter.
      Submission.aggregate([
        {
          $match: {
            user: req.user._id,
          },
        },
        {
          $group: {
            _id: "$verdict",
            count: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);

    const verdictCounts = {};

    for (const item of verdictStats) {
      verdictCounts[item._id] = item.count;
    }

    const totalSubmissions = verdictStats.reduce(
      (sum, item) => sum + item.count,
      0
    );

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      submissions: submissions.map((submission) => ({
        id: submission._id,
        problemId: submission.problem?._id || null,
        problemTitle: submission.problem?.title || "Deleted Problem",
        problemSlug: submission.problem?.slug || null,
        language: submission.language,
        verdict: submission.verdict,
        passedTestCases: submission.passedTestCases,
        totalTestCases: submission.totalTestCases,
        executionTime: submission.executionTime,
        memory: submission.memory,
        createdAt: submission.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      statistics: {
        totalSubmissions,
        accepted: verdictCounts.Accepted || 0,
        wrongAnswer: verdictCounts["Wrong Answer"] || 0,
        pending: verdictCounts.Pending || 0,
        verdictCounts,
      },
    });
  } catch (error) {
    console.error("Get my submissions error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve submission history.",
    });
  }
};