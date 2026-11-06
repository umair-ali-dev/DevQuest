import Editor from "@monaco-editor/react";
import { useTheme } from "../../context/ThemeContext";

function CodeEditor({
  language = "javascript",
  value = "",
  onChange,
  height = "500px",
  readOnly = false,
}) {
  const { theme } = useTheme();

  const editorTheme = theme === "dark" ? "vs-dark" : "light";

  return (
    <div className="h-full w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <Editor
        height={height}
        language={language}
        value={value}
        theme={editorTheme}
        onChange={(newValue) => onChange?.(newValue ?? "")}
        options={{
          readOnly,
          minimap: { enabled: true },
          fontSize: 14,
          fontFamily: "Consolas, 'Courier New', monospace",
          fontLigatures: true,
          lineNumbers: "on",
          roundedSelection: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          folding: true,
          bracketPairColorization: { enabled: true },
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          contextmenu: true,
        }}
      />
    </div>
  );
}

export default CodeEditor;
