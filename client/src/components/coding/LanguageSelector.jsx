import { Code2 } from "lucide-react";

const languages = [
  { id: "javascript", name: "JavaScript" },
  { id: "python", name: "Python 3" },
  { id: "java", name: "Java" },
];

function LanguageSelector({ language, onChange, disabled = false }) {
  return (
    <div className="flex items-center gap-3">
      <Code2 size={17} className="text-gray-500" />

      <select
        value={language}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
      >
        {languages.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector;