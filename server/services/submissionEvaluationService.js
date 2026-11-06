import { executeCode } from "./judge0Service.js";

const MAX_TEST_CASES = 20;

// Normalize line endings and ignore whitespace around individual lines.
// Internal spaces and blank lines are preserved.
const normalizeOutput = (output) => {
  return String(output ?? "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/^\n+|\n+$/g, "");
};

// Convert Judge0 status IDs into DevQuest verdicts.
const getFailureVerdict = (statusId) => {
  if (statusId === 5) {
    return "Time Limit Exceeded";
  }

  if (statusId === 6) {
    return "Compilation Error";
  }

  if (statusId >= 7 && statusId <= 12) {
    return "Runtime Error";
  }

  return "Internal Error";
};

export const evaluateSubmission = async ({
  sourceCode,
  language,
  testCases,
}) => {
  if (!Array.isArray(testCases) || testCases.length === 0) {
    throw new Error("This problem does not have any test cases.");
  }

  if (testCases.length > MAX_TEST_CASES) {
    throw new Error(
      `A maximum of ${MAX_TEST_CASES} test cases is allowed per problem.`
    );
  }

  let verdict = "Accepted";
  let passedTestCases = 0;
  let totalExecutionTime = 0;
  let maximumMemory = 0;
  let errorMessage = "";

  const testCaseResults = [];

  // Execute test cases sequentially.
  for (let index = 0; index < testCases.length; index++) {
    const testCase = testCases[index];

    const result = await executeCode({
      sourceCode,
      language,
      stdin: testCase.input,
    });

    const statusId = result.statusId;

    const executionTime = Number(result.time) || 0;
    const memory = Number(result.memory) || 0;

    totalExecutionTime += executionTime;
    maximumMemory = Math.max(maximumMemory, memory);

    // A non-successful Judge0 execution.
    if (statusId !== 3) {
      verdict = getFailureVerdict(statusId);

      errorMessage = (
        result.compileOutput ||
        result.stderr ||
        result.message ||
        result.status ||
        "Code execution failed."
      ).slice(0, 5000);

      testCaseResults.push({
        testCaseNumber: index + 1,
        passed: false,
        status: verdict,
        time: executionTime,
        memory,
      });

      // Stop after a compilation, runtime, or time-limit failure.
      break;
    }

    // Compare program output with expected output.
    const actualOutput = normalizeOutput(result.stdout);
    const expectedOutput = normalizeOutput(testCase.expectedOutput);

    const passed = actualOutput === expectedOutput;

    testCaseResults.push({
      testCaseNumber: index + 1,
      passed,
      status: passed ? "Passed" : "Wrong Answer",
      time: executionTime,
      memory,
    });

    if (passed) {
      passedTestCases++;
    } else {
      // Record Wrong Answer but continue evaluating remaining cases.
      verdict = "Wrong Answer";
    }
  }

  return {
    verdict,
    passedTestCases,
    totalTestCases: testCases.length,
    executionTime: Number(totalExecutionTime.toFixed(3)),
    memory: maximumMemory,
    testCaseResults,
    errorMessage,
  };
};
