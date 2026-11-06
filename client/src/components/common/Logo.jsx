import { Code2 } from "lucide-react";

const Logo = ({ size = "md", light = false }) => {
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-500/20">
        <Code2 size={23} />
      </div>

      <span
        className={`${sizes[size]} font-extrabold tracking-tight ${
          light ? "text-white" : "text-slate-900 dark:text-white"
        }`}
      >
        Dev<span className="text-violet-500">Quest</span>
      </span>
    </div>
  );
};

export default Logo;