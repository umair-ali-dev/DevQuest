import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, FileCode2 } from "lucide-react";
import api from "../services/api";

function extractProblems(response) {
  const result = response.data;

  const problems =
    result.problems ??
    result.data?.problems ??
    result.data ??
    [];

  return Array.isArray(problems) ? problems : [];
}

export default function AdminProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchProblems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [publishedResponse, draftResponse] = await Promise.all([
        api.get("/problems", { params: { status: "Published", limit: 100 } }),
        api.get("/problems", { params: { status: "Draft", limit: 100 } }),
      ]);

      const published = extractProblems(publishedResponse);
      const drafts = extractProblems(draftResponse);

      const combined = [
        ...published,
        ...drafts.filter(
          (draft) => !published.some((item) => item._id === draft._id)
        ),
      ];

      setProblems(combined);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load admin problems."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchProblems();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchProblems]);

  async function handleDelete(problem) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${problem.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(problem._id);
      await api.delete(`/problems/${problem._id}`);

      setProblems((current) =>
        current.filter((item) => item._id !== problem._id)
      );
    } catch (err) {
      window.alert(
        err.response?.data?.message || "Unable to delete this problem."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <FileCode2 size={25} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                  Manage Problems
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Create, edit, publish, and manage coding challenges.
                </p>
              </div>
            </div>
          </div>

          <Link
            to="/admin/problems/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Create Problem
          </Link>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500">Total problems</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {problems.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500">Published</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {problems.filter((item) => item.status === "Published").length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500">Drafts</p>
            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {problems.filter((item) => item.status === "Draft").length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-500">
            Loading problems...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            {error}
            <button onClick={fetchProblems} className="ml-2 underline">
              Retry
            </button>
          </div>
        ) : problems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
            <FileCode2 className="mx-auto mb-3 text-gray-400" size={36} />
            <p className="font-medium text-gray-800 dark:text-white">
              No problems created yet
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Create your first coding challenge.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-800/60">
                <tr>
                  <th className="px-5 py-4 font-medium">Problem</th>
                  <th className="px-5 py-4 font-medium">Difficulty</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Tags</th>
                  <th className="px-5 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {problems.map((problem) => (
                  <tr key={problem._id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {problem.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {problem.slug}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                      {problem.difficulty}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${problem.status === "Published"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                      >
                        {problem.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                      {(problem.tags || []).join(", ") || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/problems/${problem._id}/edit`}
                          title="Edit problem"
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300"
                        >
                          <Pencil size={16} />
                        </Link>

                        <button
                          type="button"
                          title="Delete problem"
                          disabled={deletingId === problem._id}
                          onClick={() => handleDelete(problem)}
                          className="rounded-lg border border-gray-200 p-2 text-red-500 hover:border-red-400 disabled:opacity-50 dark:border-gray-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
