const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "violet",
}) => {
  const colors = {
    violet:
      "bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    blue:
      "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    green:
      "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    orange:
      "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>

        <div className={`rounded-xl p-3 ${colors[color]}`}>
          <Icon size={21} />
        </div>
      </div>

      <h3 className="mt-5 text-3xl font-extrabold text-slate-900 dark:text-white">
        {value}
      </h3>

      <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        {subtitle}
      </p>
    </div>
  );
};

export default StatCard;