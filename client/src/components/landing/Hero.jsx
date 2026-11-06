import { ArrowRight, Play, Trophy, Code2, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950">
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-500/10 blur-[100px]" />

      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 py-24 lg:grid-cols-2 lg:px-8 lg:py-32">

        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
            <Zap size={15} />
            Your coding journey starts here
          </div>

          <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.12] tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
            Level Up Your
            <span className="block bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
              Coding Skills.
            </span>
            One Challenge at a Time.
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            Master algorithms, solve real-world programming challenges,
            compete with developers, and become a better problem solver
            with DevQuest.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-4 font-semibold text-white shadow-xl shadow-violet-600/20 transition hover:-translate-y-1 hover:bg-violet-700"
            >
              Start Your Journey
              <ArrowRight size={19} />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-7 py-4 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-900"
            >
              <Play size={17} />
              Explore Features
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-8">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                500+
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Coding Challenges
              </p>
            </div>

            <div className="h-12 w-px bg-slate-200 dark:bg-slate-800" />

            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                10+
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Programming Topics
              </p>
            </div>

            <div className="h-12 w-px bg-slate-200 dark:bg-slate-800" />

            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                ∞
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Learning Opportunities
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-violet-500/20 to-blue-500/20 blur-2xl" />

          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="text-violet-500" size={19} />
                <span className="font-semibold text-slate-800 dark:text-white">
                  Two Sum.js
                </span>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                Solved
              </span>
            </div>

            <div className="space-y-3 p-6 font-mono text-sm">
              <p className="text-slate-400">
                <span className="text-violet-500">function</span>{" "}
                twoSum(nums, target) {"{"}
              </p>

              <p className="pl-5 text-slate-500">
                <span className="text-blue-500">const</span> map = new Map();
              </p>

              <p className="pl-5 text-slate-500">
                <span className="text-violet-500">for</span> (
                <span className="text-orange-500">let</span> i = 0;
                i {"<"} nums.length; i++) {"{"}
              </p>

              <p className="pl-10 text-slate-500">
                <span className="text-blue-500">const</span> diff =
                target - nums[i];
              </p>

              <p className="pl-10 text-slate-500">
                <span className="text-violet-500">if</span> (map.has(diff))
              </p>

              <p className="pl-14 text-green-500">
                return [map.get(diff), i];
              </p>

              <p className="pl-10 text-slate-500">
                map.set(nums[i], i);
              </p>

              <p className="pl-5 text-slate-500">{"}"}</p>

              <p className="text-slate-400">{"}"}</p>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="text-yellow-500" size={20} />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Challenge completed!
                  </span>
                </div>

                <span className="font-bold text-green-600">
                  +100 XP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;