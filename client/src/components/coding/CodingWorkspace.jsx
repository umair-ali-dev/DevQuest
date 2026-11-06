import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    Play,
    Send,
    RotateCcw,
    Code2,
    GripVertical,
    GripHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";

import CodeEditor from "./CodeEditor";
import LanguageSelector from "./LanguageSelector";
import ProblemPanel from "./ProblemPanel";
import TestCasePanel from "./TestCasePanel";
import api from "../../services/api";

const fallbackCode = {
    javascript: `function solution() {
  // Write your solution here
}`,
    python: `def solution():
    # Write your solution here
    pass`,
    java: `class Solution {
    public void solution() {
        // Write your solution here
    }
}`,
};

const languageLabels = {
    javascript: "JavaScript",
    python: "Python 3",
    java: "Java",
};

function getStarterCode(problem, language) {
    const starterCode = problem?.starterCode || {};

    const savedCode =
        starterCode instanceof Map
            ? starterCode.get(language)
            : starterCode[language];

    return savedCode || fallbackCode[language];
}

export default function CodingWorkspace({ problem }) {
    const [language, setLanguage] = useState("javascript");

    const problemKey = problem?._id || problem?.slug || "";

    const [codeState, setCodeState] = useState(null);

    const code =
        codeState?.problemKey === problemKey &&
            codeState?.language === language
            ? codeState.code
            : getStarterCode(problem, language);

    const [bottomHeight, setBottomHeight] = useState(220);
    const [leftWidth, setLeftWidth] = useState(42);

    const [notice, setNotice] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [executionState, setExecutionState] = useState(null);
    const [activePanelTab, setActivePanelTab] = useState("testcases");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);
    const [submissionError, setSubmissionError] = useState("");
    const [customInput, setCustomInput] = useState("");

    const executionResult =
        executionState?.problemKey === problemKey &&
            executionState?.language === language
            ? executionState.result
            : null;

    const workspaceRef = useRef(null);
    const dragMode = useRef(null);

    // Handle draggable workspace panels.
    useEffect(() => {
        function handlePointerMove(event) {
            if (!dragMode.current || !workspaceRef.current) {
                return;
            }

            const rect = workspaceRef.current.getBoundingClientRect();

            if (dragMode.current === "horizontal") {
                if (!rect.width) return;

                const percentage =
                    ((event.clientX - rect.left) / rect.width) * 100;

                setLeftWidth(Math.min(70, Math.max(25, percentage)));
            }

            if (dragMode.current === "vertical") {
                const availableHeight = rect.height;
                const newHeight = rect.bottom - event.clientY;

                setBottomHeight(
                    Math.min(
                        availableHeight * 0.65,
                        Math.max(120, newHeight)
                    )
                );
            }
        }

        function handlePointerUp() {
            dragMode.current = null;
        }

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        };
    }, []);

    function changeLanguage(newLanguage) {
        setLanguage(newLanguage);
        setNotice("");
    }

    function resetCode() {
        setCodeState({
            problemKey,
            language,
            code: getStarterCode(problem, language),
        });

        setExecutionState(null);
        setNotice("Starter code restored.");
    }

    function saveExecutionResult(result) {
        setExecutionState({
            problemKey,
            language,
            result,
        });
    }

    async function handleRun() {
        if (!code.trim()) {
            saveExecutionResult({
                status: "Error",
                stderr: "Please write some code before running.",
            });

            setNotice("");
            return;
        }

        setIsRunning(true);
        setExecutionState(null);
        setNotice("");

        try {
            const response = await api.post("/execute/run", {
                language,
                sourceCode: code,
                stdin: customInput,
            });

            saveExecutionResult(response.data.result);
        } catch (error) {
            console.error("Execution request failed:", error);

            saveExecutionResult({
                status: "Execution Failed",
                stderr:
                    error.response?.data?.message ||
                    "Unable to connect to the execution service.",
            });
        } finally {
            setIsRunning(false);
        }
    }

    async function handleSubmit() {
        if (isRunning || isSubmitting) return;

        if (!problem?._id) {
            setSubmissionError(
                "Problem ID is missing. Please reload the problem."
            );
            return;
        }

        if (!code.trim()) {
            setSubmissionError("Please write some code before submitting.");
            return;
        }

        setIsSubmitting(true);
        setActivePanelTab("submission");
        setSubmissionResult(null);
        setSubmissionError("");
        setNotice("");

        try {
            const response = await api.post("/submissions", {
                problemId: problem._id,
                language,
                sourceCode: code,
            });

            const result = response.data?.submission;

            if (!result) {
                throw new Error(
                    "Submission result was missing from the server response."
                );
            }

            setSubmissionResult(result);
        } catch (error) {
            console.error("Submission request failed:", error);

            setSubmissionError(
                error.response?.data?.message ||
                error.message ||
                "Unable to submit your solution. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-gray-100 dark:bg-gray-950">
            <header className="z-10 flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <Link
                        to="/problems"
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800"
                        title="Back to problems"
                    >
                        <ArrowLeft size={19} />
                    </Link>

                    <div className="min-w-0">
                        <h1 className="truncate text-sm font-bold text-gray-900 dark:text-white sm:text-base">
                            {problem.title}
                        </h1>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            DevQuest Coding Workspace
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <LanguageSelector
                        language={language}
                        onChange={changeLanguage}
                    />

                    <button
                        type="button"
                        onClick={resetCode}
                        className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        <RotateCcw size={14} />
                        <span className="hidden sm:inline">Reset</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleRun}
                        disabled={isRunning || isSubmitting}
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Play size={16} />
                        {isRunning ? "Running..." : "Run"}
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || isRunning}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Send size={14} />
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </header>

            {notice && (
                <div className="shrink-0 border-b border-blue-200 bg-blue-50 px-5 py-2 text-xs text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">
                    {notice}
                </div>
            )}

            <main
                ref={workspaceRef}
                className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row"
            >
                <section
                    className="h-[35%] w-full min-h-0 shrink-0 overflow-hidden border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 md:h-full md:w-[var(--left-width)] md:border-b-0 md:border-r"
                    style={{
                        "--left-width": `${leftWidth}%`,
                    }}
                >
                    <ProblemPanel problem={problem} />
                </section>

                <div
                    role="separator"
                    aria-label="Resize problem panel"
                    aria-orientation="vertical"
                    onPointerDown={(event) => {
                        event.preventDefault();
                        dragMode.current = "horizontal";
                    }}
                    className="hidden w-2 shrink-0 cursor-col-resize items-center justify-center bg-gray-100 transition hover:bg-blue-100 dark:bg-gray-950 dark:hover:bg-blue-950 md:flex"
                >
                    <GripVertical size={16} className="text-gray-400" />
                </div>

                <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                    <div className="flex h-10 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                            <Code2 size={15} className="text-blue-600" />
                            Solution
                        </div>

                        <span className="text-xs text-gray-400">
                            {languageLabels[language]}
                        </span>
                    </div>

                    <div className="min-h-0 flex-1 overflow-hidden p-2">
                        <CodeEditor
                            language={language}
                            value={code}
                            onChange={(nextCode) =>
                                setCodeState({
                                    problemKey,
                                    language,
                                    code: nextCode,
                                })
                            }
                            height="100%"
                        />
                    </div>

                    <div
                        role="separator"
                        aria-label="Resize test case panel"
                        aria-orientation="horizontal"
                        onPointerDown={(event) => {
                            event.preventDefault();
                            dragMode.current = "vertical";
                        }}
                        className="flex h-2 shrink-0 cursor-row-resize items-center justify-center bg-gray-100 transition hover:bg-blue-100 dark:bg-gray-950 dark:hover:bg-blue-950"
                    >
                        <GripHorizontal size={16} className="text-gray-400" />
                    </div>

                    <div
                        className="min-h-0 shrink-0 overflow-hidden"
                        style={{
                            height: `${bottomHeight}px`,
                        }}
                    >
                        <TestCasePanel
                            problem={problem}
                            executionResult={executionResult}
                            isRunning={isRunning}
                            customInput={customInput}
                            onCustomInputChange={setCustomInput}
                            activeTab={activePanelTab}
                            onActiveTabChange={setActivePanelTab}
                            submissionResult={submissionResult}
                            isSubmitting={isSubmitting}
                            submissionError={submissionError}
                        />
                    </div>
                </section>
            </main>
        </div>
    );
}
