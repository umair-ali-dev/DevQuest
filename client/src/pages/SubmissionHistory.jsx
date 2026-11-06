import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    History,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    Cpu,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Code2,
    Filter,
    LoaderCircle,
    FileCode2,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../services/api";

const verdictStyles = {
    Accepted:
        "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    "Wrong Answer":
        "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    "Time Limit Exceeded":
        "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
    "Runtime Error":
        "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    "Compilation Error":
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
    "Internal Error":
        "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400",
    Pending:
        "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
};

const verdictIcons = {
    Accepted: CheckCircle2,
    Pending: Clock,
    "Wrong Answer": XCircle,
    "Time Limit Exceeded": Clock,
    "Runtime Error": AlertCircle,
    "Compilation Error": AlertCircle,
    "Internal Error": AlertCircle,
};

const verdictOptions = [
    { label: "All Verdicts", value: "all" },
    { label: "Accepted", value: "Accepted" },
    { label: "Wrong Answer", value: "Wrong Answer" },
    { label: "Time Limit Exceeded", value: "Time Limit Exceeded" },
    { label: "Runtime Error", value: "Runtime Error" },
    { label: "Compilation Error", value: "Compilation Error" },
    { label: "Internal Error", value: "Internal Error" },
    { label: "Pending", value: "Pending" },
];

const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatTime = (time) => {
    if (time == null) return "N/A";
    return `${Number(time).toFixed(3)}s`;
};

const formatMemory = (memory) => {
    if (memory == null) return "N/A";
    return `${Number(memory).toLocaleString()} KB`;
};

function VerdictBadge({ verdict }) {
    const Icon = verdictIcons[verdict] || AlertCircle;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${verdictStyles[verdict] ||
                "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}
        >
            <Icon size={14} />
            {verdict}
        </span>
    );
}

function SubmissionHistory() {
    const [submissions, setSubmissions] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    const [statistics, setStatistics] = useState({
        totalSubmissions: 0,
        accepted: 0,
        wrongAnswer: 0,
        pending: 0,
    });

    const [selectedVerdict, setSelectedVerdict] = useState("all");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchSubmissions = useCallback(async () => {
        try {
            const response = await api.get("/submissions/my", {
                params: {
                    page,
                    limit: 10,
                    ...(selectedVerdict !== "all" && {
                        verdict: selectedVerdict,
                    }),
                },
            });

            if (!response.data?.success) {
                throw new Error(
                    response.data?.message || "Unable to load submission history."
                );
            }

            setSubmissions(response.data.submissions || []);

            setPagination(
                response.data.pagination || {
                    page: 1,
                    limit: 10,
                    total: 0,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPreviousPage: false,
                }
            );

            setStatistics(
                response.data.statistics || {
                    totalSubmissions: 0,
                    accepted: 0,
                    wrongAnswer: 0,
                    pending: 0,
                }
            );
        } catch (err) {
            console.error("Fetch submission history error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load submission history. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [page, selectedVerdict]);

    useEffect(() => {
        let ignore = false;

        const loadSubmissions = async () => {
            try {
                const response = await api.get("/submissions/my", {
                    params: {
                        page,
                        limit: 10,
                        ...(selectedVerdict !== "all" && {
                            verdict: selectedVerdict,
                        }),
                    },
                });

                if (!response.data?.success) {
                    throw new Error(
                        response.data?.message ||
                        "Unable to load submission history."
                    );
                }

                if (ignore) return;

                setSubmissions(response.data.submissions || []);

                setPagination(
                    response.data.pagination || {
                        page: 1,
                        limit: 10,
                        total: 0,
                        totalPages: 0,
                        hasNextPage: false,
                        hasPreviousPage: false,
                    }
                );

                setStatistics(
                    response.data.statistics || {
                        totalSubmissions: 0,
                        accepted: 0,
                        wrongAnswer: 0,
                        pending: 0,
                    }
                );

                setError("");
            } catch (err) {
                if (ignore) return;

                console.error("Fetch submission history error:", err);

                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Unable to load submission history. Please try again."
                );
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadSubmissions();

        return () => {
            ignore = true;
        };
    }, [page, selectedVerdict]);

    const handleRefresh = () => {
        setLoading(true);
        setError("");
        fetchSubmissions();
    };

    const handleVerdictChange = (event) => {
        setLoading(true);
        setError("");
        setSelectedVerdict(event.target.value);
        setPage(1);
    };

    const handlePreviousPage = () => {
        if (pagination.hasPreviousPage) {
            setLoading(true);
            setError("");
            setPage((current) => current - 1);
        }
    };

    const handleNextPage = () => {
        if (pagination.hasNextPage) {
            setLoading(true);
            setError("");
            setPage((current) => current + 1);
        }
    };


    return (
        <DashboardLayout>
            <div className="space-y-7">
                {/* PAGE HEADER */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                                <History size={24} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                                    Submission History
                                </h1>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Review your coding attempts and track your performance.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>

                {/* STATISTICS */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Total Submissions
                            </p>

                            <History size={20} className="text-violet-500" />
                        </div>

                        <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                            {statistics.totalSubmissions}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Accepted
                            </p>

                            <CheckCircle2 size={20} className="text-green-500" />
                        </div>

                        <p className="mt-3 text-3xl font-bold text-green-600 dark:text-green-400">
                            {statistics.accepted}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Wrong Answers
                            </p>

                            <XCircle size={20} className="text-red-500" />
                        </div>

                        <p className="mt-3 text-3xl font-bold text-red-600 dark:text-red-400">
                            {statistics.wrongAnswer}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Pending
                            </p>

                            <Clock size={20} className="text-blue-500" />
                        </div>

                        <p className="mt-3 text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {statistics.pending}
                        </p>
                    </div>
                </div>

                {/* SUBMISSION TABLE */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    {/* TABLE HEADER */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Your Submissions
                            </h2>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {pagination.total} submission
                                {pagination.total === 1 ? "" : "s"} found
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Filter size={17} className="text-slate-400" />

                            <select
                                value={selectedVerdict}
                                onChange={handleVerdictChange}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 sm:w-52"
                            >
                                {verdictOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* LOADING */}
                    {loading && (
                        <div className="flex min-h-64 flex-col items-center justify-center gap-3">
                            <LoaderCircle
                                size={32}
                                className="animate-spin text-violet-500"
                            />

                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Loading submission history...
                            </p>
                        </div>
                    )}

                    {/* ERROR */}
                    {!loading && error && (
                        <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
                            <AlertCircle size={38} className="text-red-500" />

                            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                                Unable to load submissions
                            </h3>

                            <p className="mt-2 max-w-md text-sm text-red-500">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={handleRefresh}
                                className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* EMPTY STATE */}
                    {!loading && !error && submissions.length === 0 && (
                        <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                                <FileCode2 size={30} />
                            </div>

                            <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                                No submissions found
                            </h3>

                            <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                                {selectedVerdict === "all"
                                    ? "You haven't submitted any solutions yet. Start solving problems to build your submission history."
                                    : `You don't have any submissions with the "${selectedVerdict}" verdict.`}
                            </p>

                            {selectedVerdict === "all" && (
                                <Link
                                    to="/problems"
                                    className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                                >
                                    Explore Problems
                                </Link>
                            )}
                        </div>
                    )}

                    {/* DESKTOP TABLE */}
                    {!loading && !error && submissions.length > 0 && (
                        <>
                            <div className="hidden overflow-x-auto lg:block">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                                            <th className="px-5 py-4">Problem</th>
                                            <th className="px-5 py-4">Verdict</th>
                                            <th className="px-5 py-4">Language</th>
                                            <th className="px-5 py-4">Test Cases</th>
                                            <th className="px-5 py-4">Runtime</th>
                                            <th className="px-5 py-4">Memory</th>
                                            <th className="px-5 py-4">Submitted</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {submissions.map((submission) => (
                                            <tr
                                                key={submission.id}
                                                className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                                            >
                                                <td className="px-5 py-4">
                                                    {submission.problemSlug ? (
                                                        <Link
                                                            to={`/problems/${submission.problemSlug}`}
                                                            className="font-semibold text-slate-800 transition hover:text-violet-600 dark:text-slate-200 dark:hover:text-violet-400"
                                                        >
                                                            {submission.problemTitle}
                                                        </Link>
                                                    ) : (
                                                        <span className="font-semibold text-slate-500">
                                                            {submission.problemTitle}
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <VerdictBadge verdict={submission.verdict} />
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                        <Code2 size={15} className="text-violet-500" />
                                                        {submission.language}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {submission.passedTestCases ?? 0} /{" "}
                                                    {submission.totalTestCases ?? 0}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                                                    {formatTime(submission.executionTime)}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                                                    {formatMemory(submission.memory)}
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                                                    {formatDate(submission.createdAt)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* MOBILE AND TABLET CARDS */}
                            <div className="space-y-3 p-4 lg:hidden">
                                {submissions.map((submission) => (
                                    <div
                                        key={submission.id}
                                        className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                {submission.problemSlug ? (
                                                    <Link
                                                        to={`/problems/${submission.problemSlug}`}
                                                        className="font-semibold text-slate-900 hover:text-violet-600 dark:text-white dark:hover:text-violet-400"
                                                    >
                                                        {submission.problemTitle}
                                                    </Link>
                                                ) : (
                                                    <p className="font-semibold text-slate-500">
                                                        {submission.problemTitle}
                                                    </p>
                                                )}

                                                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                                    <Code2 size={13} />
                                                    {submission.language}
                                                </p>
                                            </div>

                                            <VerdictBadge verdict={submission.verdict} />
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 dark:border-slate-800 sm:grid-cols-3">
                                            <div>
                                                <p className="text-xs text-slate-500">Test Cases</p>
                                                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                    {submission.passedTestCases ?? 0} /{" "}
                                                    {submission.totalTestCases ?? 0}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="flex items-center gap-1 text-xs text-slate-500">
                                                    <Clock size={12} />
                                                    Runtime
                                                </p>
                                                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                    {formatTime(submission.executionTime)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="flex items-center gap-1 text-xs text-slate-500">
                                                    <Cpu size={12} />
                                                    Memory
                                                </p>
                                                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                    {formatMemory(submission.memory)}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="mt-3 text-xs text-slate-400">
                                            {formatDate(submission.createdAt)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* PAGINATION */}
                            <div className="flex flex-col justify-between gap-4 border-t border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Page {pagination.page} of {pagination.totalPages}
                                    {" · "}
                                    {pagination.total} total submissions
                                </p>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handlePreviousPage}
                                        disabled={!pagination.hasPreviousPage || loading}
                                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        <ChevronLeft size={16} />
                                        Previous
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleNextPage}
                                        disabled={!pagination.hasNextPage || loading}
                                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        Next
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default SubmissionHistory;
