import { useState } from "react";

import {
  Terminal,
  ListChecks,
  Clock,
  Cpu,
  Keyboard,
  Copy,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  LoaderCircle,
} from "lucide-react";

function TestCasePanel({
  problem,
  activeTab,
  onActiveTabChange,
  executionResult,
  isRunning,
  customInput,
  onCustomInputChange,
  submissionResult,
  isSubmitting,
  submissionError,
}) {
  const [selectedCase, setSelectedCase] = useState(0);

  const examples = problem?.examples || [];
  const currentExample = examples[selectedCase];

  const tabs = [
    { id: "testcases", label: "Test Cases", icon: ListChecks },
    { id: "custom", label: "Custom Input", icon: Keyboard },
    { id: "console", label: "Console", icon: Terminal },
    { id: "submission", label: "Submission Results", icon: ListChecks },
  ];

  function useExampleInput() {
    if (currentExample?.input !== undefined) {
      onCustomInputChange(currentExample.input);
      onActiveTabChange("custom");
    }
  }

  async function copyOutput() {
    if (!executionResult?.stdout) return;

    try {
      await navigator.clipboard.writeText(executionResult.stdout);
    } catch (error) {
      console.error("Unable to copy output:", error);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-white dark:bg-gray-900">
      <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-gray-200 px-3 dark:border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onActiveTabChange(tab.id)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition ${activeTab === tab.id
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        {activeTab === "testcases" && (
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {examples.length > 0 ? (
                examples.map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedCase(index)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${selectedCase === index
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                  >
                    Case {index + 1}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No sample test cases available.
                </p>
              )}
            </div>

            {currentExample && (
              <div className="space-y-3">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Input
                  </p>
                  <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-gray-100 p-3 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    {currentExample.input || "(Empty input)"}
                  </pre>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Expected Output
                  </p>
                  <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-gray-100 p-3 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    {currentExample.output || "(No expected output)"}
                  </pre>
                </div>

                {currentExample.explanation && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Explanation
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentExample.explanation}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={useExampleInput}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  Use Example Input
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "custom" && (
          <div className="flex h-full min-h-0 flex-col gap-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Custom Program Input
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter input values below. Each line is passed to your program
                through standard input (stdin).
              </p>
            </div>

            <textarea
              value={customInput}
              onChange={(event) => onCustomInputChange(event.target.value)}
              placeholder={"Enter your input here...\nExample:\n10\n20"}
              spellCheck={false}
              className="min-h-28 flex-1 resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-600"
            />

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-gray-500">
                {customInput.length} characters
              </span>
              <button
                type="button"
                onClick={() => onCustomInputChange("")}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-800"
              >
                Clear Input
              </button>
            </div>
          </div>
        )}

        {activeTab === "console" && (
          <div className="space-y-4">
            {isRunning && (
              <div className="flex items-center gap-2 text-sm text-blue-500">
                <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                Executing your code...
              </div>
            )}

            {!isRunning && !executionResult && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Run your code to see the execution output here.
              </p>
            )}

            {executionResult && (
              <>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Execution Status
                  </p>
                  <span className="inline-flex rounded-md bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    {executionResult.status}
                  </span>
                </div>

                {executionResult.stdout && (
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Output
                      </p>
                      <button
                        type="button"
                        onClick={copyOutput}
                        title="Copy output"
                        className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                    <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-gray-100 p-3 font-mono text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      {executionResult.stdout}
                    </pre>
                  </div>
                )}

                {executionResult.stderr && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-500">
                      Runtime Error
                    </p>
                    <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-red-50 p-3 font-mono text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
                      {executionResult.stderr}
                    </pre>
                  </div>
                )}

                {executionResult.compileOutput && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-500">
                      Compilation Output
                    </p>
                    <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-red-50 p-3 font-mono text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
                      {executionResult.compileOutput}
                    </pre>
                  </div>
                )}

                {executionResult.message && (
                  <div>
                    <p className="mb-2 text-xs font-semibold text-gray-500">
                      Additional Information
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {executionResult.message}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 border-t border-gray-200 pt-3 text-xs text-gray-500 dark:border-gray-700">
                  {executionResult.time != null && (
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {executionResult.time}s
                    </span>
                  )}
                  {executionResult.memory != null && (
                    <span className="flex items-center gap-1">
                      <Cpu size={14} />
                      {executionResult.memory} KB
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "submission" && (
          <div className="space-y-4">
            {isSubmitting && (
              <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                <LoaderCircle size={20} className="animate-spin text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    Evaluating your submission...
                  </p>
                  <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                    Your code is being tested against the problem's test cases.
                  </p>
                </div>
              </div>
            )}

            {!isSubmitting && submissionError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <AlertTriangle size={18} />
                  <p className="text-sm font-semibold">Submission Failed</p>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-red-600 dark:text-red-400">
                  {submissionError}
                </p>
              </div>
            )}

            {!isSubmitting && !submissionError && !submissionResult && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Submit your solution to see its evaluation results here.
              </p>
            )}

            {!isSubmitting && submissionResult && (
              <>
                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {submissionResult.verdict === "Accepted" ? (
                        <CheckCircle2 size={26} className="text-green-500" />
                      ) : (
                        <XCircle size={26} className="text-red-500" />
                      )}

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Submission Verdict
                        </p>
                        <h3
                          className={`mt-1 text-lg font-bold ${submissionResult.verdict === "Accepted"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                            }`}
                        >
                          {submissionResult.verdict}
                        </h3>
                      </div>
                    </div>

                    <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {submissionResult.language}
                    </span>
                  </div>

                  {submissionResult.errorMessage && (
                    <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-lg bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/30 dark:text-red-300">
                      {submissionResult.errorMessage}
                    </pre>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Test Cases Passed
                    </p>
                    <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                      {submissionResult.passedTestCases ?? 0}
                      {" / "}
                      {submissionResult.totalTestCases ?? 0}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                    <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock size={13} />
                      Execution Time
                    </p>
                    <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                      {submissionResult.executionTime != null
                        ? `${submissionResult.executionTime}s`
                        : "N/A"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                    <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Cpu size={13} />
                      Memory
                    </p>
                    <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                      {submissionResult.memory != null
                        ? `${submissionResult.memory} KB`
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Test Case Results
                  </h3>

                  {submissionResult.testCaseResults?.length > 0 ? (
                    <div className="space-y-2">
                      {submissionResult.testCaseResults.map((testCase) => (
                        <div
                          key={testCase.testCaseNumber}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                        >
                          <div className="flex items-center gap-3">
                            {testCase.passed ? (
                              <CheckCircle2 size={18} className="text-green-500" />
                            ) : (
                              <XCircle size={18} className="text-red-500" />
                            )}

                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                Test Case {testCase.testCaseNumber}
                              </p>
                              <p
                                className={`text-xs ${testCase.passed
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                                  }`}
                              >
                                {testCase.status}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400">
                            {testCase.time != null && (
                              <span>{testCase.time}s</span>
                            )}
                            {testCase.memory != null && (
                              <span>{testCase.memory} KB</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No individual test-case results are available.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TestCasePanel;