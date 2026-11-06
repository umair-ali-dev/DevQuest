import mongoose from "mongoose";

const testCaseResultSchema = new mongoose.Schema(
  {
    testCaseNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    passed: {
      type: Boolean,
      required: true,
    },

    status: {
      type: String,
      default: "Unknown",
    },

    time: {
      type: Number,
      default: null,
      min: 0,
    },

    memory: {
      type: Number,
      default: null,
      min: 0,
    },
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    // User who submitted the solution
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Problem associated with this submission
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true,
    },

    // Submitted programming language
    language: {
      type: String,
      enum: ["javascript", "python", "java"],
      required: true,
    },

    // User's submitted source code
    sourceCode: {
      type: String,
      required: true,
      maxlength: 20000,
    },

    // Overall evaluation verdict
    verdict: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Wrong Answer",
        "Time Limit Exceeded",
        "Runtime Error",
        "Compilation Error",
        "Internal Error",
      ],
      default: "Pending",
      required: true,
    },

    // Test-case statistics
    passedTestCases: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalTestCases: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Total execution time in seconds
    executionTime: {
      type: Number,
      default: null,
      min: 0,
    },

    // Maximum memory usage in KB
    memory: {
      type: Number,
      default: null,
      min: 0,
    },

    // Safe test-case summaries (no hidden inputs or expected outputs)
    testCaseResults: {
      type: [testCaseResultSchema],
      default: [],
    },

    // Sanitized error information, if applicable
    errorMessage: {
      type: String,
      default: "",
      maxlength: 5000,
    },
  },
  {
    timestamps: true,
  }
);

// Efficient user submission history
submissionSchema.index({
  user: 1,
  createdAt: -1,
});

// Efficient problem submission history
submissionSchema.index({
  problem: 1,
  createdAt: -1,
});

// Efficient user's submissions for a particular problem
submissionSchema.index({
  user: 1,
  problem: 1,
  createdAt: -1,
});

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
