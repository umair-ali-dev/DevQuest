import {
  BookOpen,
  Code2,
  ListChecks,
} from "lucide-react";

const difficultyStyles = {
  Easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function ProblemPanel({ problem }) {
  return (
    <div className="h-full overflow-y-auto p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            difficultyStyles[problem.difficulty] ||
            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          {problem.difficulty}
        </span>

        <span className="text-xs text-gray-500 dark:text-gray-400">
          {Number(problem.acceptanceRate || 0).toFixed(1)}% acceptance
        </span>
      </div>

      <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
        {problem.title}
      </h1>

      {problem.tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {problem.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="my-6 border-t border-gray-200 dark:border-gray-800" />

      <section>
        <div className="mb-3 flex items-center gap-2">
          <BookOpen size={18} className="text-blue-600" />
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Description
          </h2>
        </div>

        <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700 dark:text-gray-300">
          {problem.description}
        </p>
      </section>

      {problem.examples?.length > 0 && (
        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <Code2 size={18} className="text-blue-600" />
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Examples
            </h2>
          </div>

          <div className="space-y-4">
            {problem.examples.map((example, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60"
              >
                <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Example {index + 1}
                </h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="mb-1 font-medium text-gray-500 dark:text-gray-400">
                      Input
                    </p>
                    <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-gray-100 p-3 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                      {example.input}
                    </pre>
                  </div>

                  <div>
                    <p className="mb-1 font-medium text-gray-500 dark:text-gray-400">
                      Output
                    </p>
                    <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-gray-100 p-3 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                      {example.output}
                    </pre>
                  </div>

                  {example.explanation && (
                    <div>
                      <p className="mb-1 font-medium text-gray-500 dark:text-gray-400">
                        Explanation
                      </p>
                      <p className="leading-6 text-gray-700 dark:text-gray-300">
                        {example.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {problem.constraints?.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <ListChecks size={18} className="text-blue-600" />
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Constraints
            </h2>
          </div>

          <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-gray-700 dark:text-gray-300">
            {problem.constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
