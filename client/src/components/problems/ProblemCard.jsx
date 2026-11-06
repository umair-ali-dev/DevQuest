import { Link } from "react-router-dom";
import { CheckCircle2, ChevronRight } from "lucide-react";

const difficultyStyles = {
  Easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function ProblemCard({ problem }) {
  return (
    <Link
      to={`/problems/${problem.slug}`}
      className="group flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 transition hover:border-blue-400 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-500"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {problem.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {problem.slug}
          </p>
        </div>

        <ChevronRight
          size={20}
          className="shrink-0 text-gray-400 transition group-hover:translate-x-1"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${difficultyStyles[problem.difficulty] ||
            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            }`}
        >
          {problem.difficulty}
        </span>

        {problem.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-sm dark:border-gray-800">
        <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <CheckCircle2 size={16} />
          Acceptance rate
        </span>
        <span className="font-medium text-gray-700 dark:text-gray-200">
          {Number(problem.acceptanceRate || 0).toFixed(1)}%
        </span>
      </div>
    </Link>
  );
}
