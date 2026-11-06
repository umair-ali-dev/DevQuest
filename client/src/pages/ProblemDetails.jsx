import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import api from "../services/api";
import CodingWorkspace from "../components/coding/CodingWorkspace";

export default function ProblemDetails() {
  const { slug } = useParams();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchProblem() {
      try {
        setLoading(true);
        setError("");
        setProblem(null);

        const response = await api.get(`/problems/${slug}`);
        const result = response.data;

        const problemData =
          result.problem ??
          result.data?.problem ??
          result.data ??
          null;

        if (!problemData) {
          throw new Error("Problem data was not found in the API response.");
        }

        if (!cancelled) {
          setProblem(problemData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load this problem."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProblem();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500 dark:bg-gray-950 dark:text-gray-400">
        Loading problem...
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-gray-950">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Problem not found
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {error || "This problem could not be found."}
        </p>

        <Link
          to="/problems"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <ArrowLeft size={16} />
          Back to problems
        </Link>
      </div>
    );
  }

  return <CodingWorkspace problem={problem} />;
}
