import {
  Brain,
  Code2,
  Trophy,
  BarChart3,
  Target,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Interactive Code Editor",
    description:
      "Write, test, and submit your code in a powerful coding environment.",
  },
  {
    icon: Brain,
    title: "Algorithm Challenges",
    description:
      "Improve your problem-solving abilities with carefully designed challenges.",
  },
  {
    icon: Trophy,
    title: "Global Leaderboard",
    description:
      "Compete with developers and track your ranking on the platform.",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description:
      "Understand your performance through coding statistics and insights.",
  },
  {
    icon: Target,
    title: "Daily Challenges",
    description:
      "Stay consistent and develop your programming skills every day.",
  },
  {
    icon: Users,
    title: "Developer Community",
    description:
      "Connect with developers and learn through shared experiences.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="bg-slate-50 py-24 dark:bg-slate-900/50"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            Why DevQuest?
          </span>

          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Everything You Need to
            <span className="text-violet-600"> Grow as a Developer</span>
          </h2>

          <p className="mt-5 text-lg text-slate-600 dark:text-slate-400">
            A complete environment designed to help you practice,
            improve, and compete.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-8 transition duration-300 hover:-translate-y-2 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/5 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-violet-500/40"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white dark:bg-violet-500/10 dark:text-violet-400">
                  <Icon size={26} />
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;