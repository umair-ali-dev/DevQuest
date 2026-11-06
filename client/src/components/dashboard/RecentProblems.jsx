import { ArrowUpRight, CheckCircle2, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";

const RecentProblems = ({
  problems = [],
  isLoading = false,
}) => {
  const difficultyColors = {
    Easy: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-500/10",
    Medium: "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-500/10",
    Hard: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/10",
  };

  const formatDate = (date) => {
    if (!date) return "Recently";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatus = (problem) => {
    if (problem.isSolved) {
      return {
        label: "Solved",
        icon: CheckCircle2,
        color: "text-green-600 dark:text-green-400",
      };
    }

    return {
      label: problem.verdict || "Attempted",
      icon: Clock3,
      color: "text-orange-600 dark:text-orange-400",
    };
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Recent Problems
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Your recently attempted coding challenges
          </p>
        </div>

        <Link
          to="/submissions"
          className="flex items-center gap-1 text-sm font-semibold text-violet-600 transition hover:text-violet-700 dark:text-violet-400"
        >
          View All
          <ArrowUpRight size={16} />
        </Link>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-sm text-slate-500">
          Loading recent problems...
        </div>
      ) : problems.length === 0 ? (
        <div className="p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
            <Clock3 size={22} />
          </div>

          <h4 className="mt-4 font-semibold text-slate-800 dark:text-white">
            No submissions yet
          </h4>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Start solving problems to see your recent activity here.
          </p>

          <Link
            to="/problems"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Explore Problems
            <ArrowUpRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {problems.map((problem) => {
            const status = getStatus(problem);
            const StatusIcon = status.icon;

            return (
              <div
                key={problem.problemId}
                className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
              >
                <div className="min-w-0">
                  <Link
                    to={
                      problem.slug
                        ? `/problems/${problem.slug}`
                        : "/problems"
                    }
                    className="font-semibold text-slate-800 transition hover:text-violet-600 dark:text-white dark:hover:text-violet-400"
                  >
                    {problem.title}
                  </Link>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {problem.tags?.length
                      ? problem.tags.join(", ")
                      : problem.language || "Coding challenge"}
                    {" · "}
                    {formatDate(problem.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {problem.difficulty && (
                    <span
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                        difficultyColors[problem.difficulty] ||
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  )}

                  <span
                    className={`flex min-w-24 items-center justify-end gap-1 text-xs font-semibold ${status.color}`}
                  >
                    <StatusIcon size={14} />
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentProblems;