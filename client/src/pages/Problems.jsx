import { useCallback, useEffect, useState } from "react";
import { Search, SlidersHorizontal, Code2 } from "lucide-react";
import api from "../services/api";
import ProblemCard from "../components/problems/ProblemCard";

const PAGE_SIZE = 9;

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProblems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: PAGE_SIZE,
      };

      if (search.trim()) params.search = search.trim();
      if (difficulty) params.difficulty = difficulty;
      if (tag.trim()) params.tag = tag.trim();

      const response = await api.get("/problems", { params });
      const result = response.data;

      // Supports the common response shapes used by the backend.
      const problemList =
        result.problems ?? result.data?.problems ?? result.data ?? [];

      setProblems(Array.isArray(problemList) ? problemList : []);
      setTotalPages(
        result.totalPages ??
        result.pagination?.totalPages ??
        result.data?.totalPages ??
        1
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load problems. Please try again."
      );
      setProblems([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, difficulty, tag]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchProblems();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchProblems]);

  function updateFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Code2 size={26} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Problems
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Practice coding and improve your problem-solving skills.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 md:grid-cols-3">
          <div className="relative md:col-span-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => updateFilter(setSearch, e.target.value)}
              placeholder="Search problems..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <select
            value={difficulty}
            onChange={(e) => updateFilter(setDifficulty, e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <div className="relative">
            <SlidersHorizontal
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={tag}
              onChange={(e) => updateFilter(setTag, e.target.value)}
              placeholder="Filter by tag (e.g. Array)"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500">
            Loading problems...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            {error}
            <button
              onClick={fetchProblems}
              className="ml-2 font-semibold underline"
            >
              Retry
            </button>
          </div>
        ) : problems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-20 text-center dark:border-gray-700">
            <Code2 className="mx-auto mb-3 text-gray-400" size={36} />
            <h2 className="font-semibold text-gray-800 dark:text-white">
              No problems found
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {problems.length} problems
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {page} of {totalPages}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {problems.map((problem) => (
                <ProblemCard key={problem._id} problem={problem} />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-white"
              >
                Previous
              </button>

              <span className="text-sm text-gray-500 dark:text-gray-400">
                {page} / {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-white"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
