import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProblemForm from "../components/problems/ProblemForm";

export default function AdminProblemForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/admin/problems"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400"
        >
          <ArrowLeft size={17} />
          Back to Manage Problems
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditing ? "Edit Problem" : "Create Problem"}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {isEditing
              ? "Update the problem information and test cases."
              : "Add a new coding challenge to DevQuest."}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:p-8">
          <ProblemForm problemId={id} />
        </div>
      </div>
    </div>
  );
}
