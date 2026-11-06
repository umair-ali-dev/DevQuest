import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const emptyForm = {
  title: "",
  description: "",
  difficulty: "Easy",
  tags: "",
  constraints: "",
  examples: [{ input: "", output: "", explanation: "" }],
  starterCode: {
    javascript: "",
    python: "",
    java: "",
  },
  testCases: [{ input: "", expectedOutput: "", isHidden: false }],
  status: "Draft",
};

export default function ProblemForm({ problemId }) {
  const navigate = useNavigate();
  const isEditing = Boolean(problemId);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;

    let cancelled = false;

    async function loadProblem() {
      try {
        const response = await api.get(`/problems/admin/${problemId}`);
        const problem = response.data.problem ?? response.data.data;

        if (!problem) {
          throw new Error("Problem data was not returned.");
        }

        if (!cancelled) {
          setForm({
            title: problem.title || "",
            description: problem.description || "",
            difficulty: problem.difficulty || "Easy",
            tags: (problem.tags || []).join("\n"),
            constraints: (problem.constraints || []).join("\n"),
            examples: problem.examples?.length
              ? problem.examples
              : emptyForm.examples,
            starterCode: {
              javascript: problem.starterCode?.get?.("javascript") ||
                problem.starterCode?.javascript || "",
              python: problem.starterCode?.get?.("python") ||
                problem.starterCode?.python || "",
              java: problem.starterCode?.get?.("java") ||
                problem.starterCode?.java || "",
            },
            testCases: problem.testCases?.length
              ? problem.testCases
              : emptyForm.testCases,
            status: problem.status || "Draft",
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Unable to load this problem."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProblem();

    return () => {
      cancelled = true;
    };
  }, [isEditing, problemId]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateArrayItem(field, index, key, value) {
    setForm((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  function addArrayItem(field, item) {
    setForm((current) => ({
      ...current,
      [field]: [...current[field], item],
    }));
  }

  function removeArrayItem(field, index) {
    setForm((current) => ({
      ...current,
      [field]: current[field].filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      difficulty: form.difficulty,
      tags: form.tags.split("\n").map((item) => item.trim()).filter(Boolean),
      constraints: form.constraints
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      examples: form.examples,
      starterCode: form.starterCode,
      testCases: form.testCases,
      status: form.status,
    };

    if (!payload.title || !payload.description) {
      setError("Title and description are required.");
      return;
    }

    if (
      payload.examples.some((item) => !item.input.trim() || !item.output.trim())
    ) {
      setError("Every example must have input and output.");
      return;
    }

    if (
      payload.testCases.some(
        (item) => !item.input.trim() || !item.expectedOutput.trim()
      )
    ) {
      setError("Every test case must have input and expected output.");
      return;
    }

    try {
      setSaving(true);

      if (isEditing) {
        await api.patch(`/problems/${problemId}`, payload);
      } else {
        await api.post("/problems", payload);
      }

      navigate("/admin/problems");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save the problem."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading problem...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Basic Information
        </h2>

        <input
          required
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="Problem title"
          className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />

        <textarea
          required
          rows={7}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Write the problem description..."
          className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <select
            value={form.difficulty}
            onChange={(e) => updateField("difficulty", e.target.value)}
            className="rounded-lg border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <select
            value={form.status}
            onChange={(e) => updateField("status", e.target.value)}
            className="rounded-lg border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>

        <textarea
          rows={3}
          value={form.tags}
          onChange={(e) => updateField("tags", e.target.value)}
          placeholder={"Tags, one per line\nArray\nHash Table"}
          className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />

        <textarea
          rows={4}
          value={form.constraints}
          onChange={(e) => updateField("constraints", e.target.value)}
          placeholder={"Constraints, one per line\n2 <= nums.length <= 10000"}
          className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Examples
          </h2>
          <button
            type="button"
            onClick={() =>
              addArrayItem("examples", {
                input: "",
                output: "",
                explanation: "",
              })
            }
            className="text-sm font-medium text-blue-600"
          >
            + Add example
          </button>
        </div>

        {form.examples.map((example, index) => (
          <div
            key={index}
            className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-800 dark:text-white">
                Example {index + 1}
              </h3>
              {form.examples.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("examples", index)}
                  className="text-sm text-red-500"
                >
                  Remove
                </button>
              )}
            </div>

            <input
              required
              value={example.input}
              onChange={(e) =>
                updateArrayItem("examples", index, "input", e.target.value)
              }
              placeholder="Input"
              className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />

            <input
              required
              value={example.output}
              onChange={(e) =>
                updateArrayItem("examples", index, "output", e.target.value)
              }
              placeholder="Output"
              className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />

            <textarea
              rows={2}
              value={example.explanation || ""}
              onChange={(e) =>
                updateArrayItem(
                  "examples",
                  index,
                  "explanation",
                  e.target.value
                )
              }
              placeholder="Explanation (optional)"
              className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Starter Code
        </h2>

        {["javascript", "python", "java"].map((language) => (
          <div key={language}>
            <label className="mb-2 block text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
              {language}
            </label>
            <textarea
              rows={5}
              value={form.starterCode[language]}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  starterCode: {
                    ...current.starterCode,
                    [language]: e.target.value,
                  },
                }))
              }
              placeholder={`${language} starter code`}
              className="w-full rounded-lg border border-gray-200 bg-gray-950 p-3 font-mono text-sm text-green-300 dark:border-gray-700"
            />
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Test Cases
          </h2>
          <button
            type="button"
            onClick={() =>
              addArrayItem("testCases", {
                input: "",
                expectedOutput: "",
                isHidden: false,
              })
            }
            className="text-sm font-medium text-blue-600"
          >
            + Add test case
          </button>
        </div>

        {form.testCases.map((testCase, index) => (
          <div
            key={index}
            className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-800 dark:text-white">
                Test case {index + 1}
              </h3>
              {form.testCases.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("testCases", index)}
                  className="text-sm text-red-500"
                >
                  Remove
                </button>
              )}
            </div>

            <textarea
              required
              rows={2}
              value={testCase.input}
              onChange={(e) =>
                updateArrayItem("testCases", index, "input", e.target.value)
              }
              placeholder="Input"
              className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />

            <textarea
              required
              rows={2}
              value={testCase.expectedOutput}
              onChange={(e) =>
                updateArrayItem(
                  "testCases",
                  index,
                  "expectedOutput",
                  e.target.value
                )
              }
              placeholder="Expected output"
              className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />

            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={Boolean(testCase.isHidden)}
                onChange={(e) =>
                  updateArrayItem(
                    "testCases",
                    index,
                    "isHidden",
                    e.target.checked
                  )
                }
              />
              Hidden test case
            </label>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : isEditing
              ? "Update Problem"
              : "Create Problem"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/problems")}
          className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
