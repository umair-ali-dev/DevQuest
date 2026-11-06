import { useEffect, useState } from "react";
import {
  Code2,
  Target,
  Flame,
  ArrowRight,
  Sparkles,
  Send,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import DailyChallenge from "../components/dashboard/DailyChallenge";
import ActivityChart from "../components/dashboard/ActivityChart";
import RecentProblems from "../components/dashboard/RecentProblems";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const INITIAL_STATS = {
  totalSubmissions: 0,
  problemsSolved: 0,
  acceptedSubmissions: 0,
  evaluatedSubmissions: 0,
  acceptanceRate: 0,
  currentStreak: 0,
  difficultyBreakdown: {
    Easy: 0,
    Medium: 0,
    Hard: 0,
  },
};

const MILESTONE_TARGET = 150;

const Dashboard = () => {
  const { user } = useAuth();

  const [statistics, setStatistics] = useState(INITIAL_STATS);
  const [activity, setActivity] = useState([]);
  const [recentProblems, setRecentProblems] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get("/dashboard");

        const data = response.data;

        if (!data.success) {
          throw new Error("Unable to load dashboard data.");
        }

        setStatistics({
          ...INITIAL_STATS,
          ...data.statistics,
          difficultyBreakdown: {
            ...INITIAL_STATS.difficultyBreakdown,
            ...data.statistics?.difficultyBreakdown,
          },
        });

        setActivity(data.activity || []);
        setRecentProblems(data.recentProblems || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [refreshKey]);

  const {
    totalSubmissions,
    problemsSolved,
    acceptanceRate,
    currentStreak,
    difficultyBreakdown,
  } = statistics;

  const milestoneProgress = Math.min(
    (problemsSolved / MILESTONE_TARGET) * 100,
    100
  );

  const remainingProblems = Math.max(
    MILESTONE_TARGET - problemsSolved,
    0
  );

  return (
    <DashboardLayout>
      {/* Welcome section */}
      <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400">
            <Sparkles size={16} />
            YOUR DEVELOPER WORKSPACE
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {user?.name || "Developer"}!
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Ready to solve some challenges and level up your skills?
          </p>
        </div>

        <Link
          to="/problems"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700"
        >
          Explore Problems
          <ArrowRight size={17} />
        </Link>
      </section>

      {/* Dashboard loading and error states */}
      {isLoading && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-300 border-t-violet-700" />
          Loading your dashboard statistics...
        </div>
      )}

      {error && (
        <div className="mb-6 flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10 sm:flex-row sm:items-center">
          <p className="text-sm text-red-700 dark:text-red-300">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setRefreshKey((previous) => previous + 1)}
            className="inline-flex items-center gap-2 self-start rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 sm:self-auto"
          >
            <Send size={14} />
            Retry
          </button>
        </div>
      )}

      {/* Statistics */}
      <section className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Problems Solved"
          value={problemsSolved}
          subtitle="Unique accepted problems"
          icon={Code2}
          color="violet"
        />

        <StatCard
          title="Total Submissions"
          value={totalSubmissions}
          subtitle="All your coding attempts"
          icon={Target}
          color="blue"
        />

        <StatCard
          title="Acceptance Rate"
          value={`${acceptanceRate}%`}
          subtitle="Accepted / evaluated submissions"
          icon={CheckCircle2}
          color="green"
        />

        <StatCard
          title="Current Streak"
          value={`${currentStreak} Days`}
          subtitle="Consecutive days with accepted solutions"
          icon={Flame}
          color="orange"
        />
      </section>

      {/* Daily challenge */}
      <section className="mb-8">
        <DailyChallenge />
      </section>

      {/* Activity and quick statistics */}
      <section className="mb-8 grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <ActivityChart
            activity={activity}
            isLoading={isLoading}
          />
        </div>

        <div className="flex flex-col gap-5 xl:col-span-2">
          {/* Problem distribution */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Problem Distribution
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your solved challenges by difficulty
            </p>

            <div className="mt-6 space-y-5">
              {[
                {
                  name: "Easy",
                  count: difficultyBreakdown.Easy,
                  color: "bg-green-500",
                },
                {
                  name: "Medium",
                  count: difficultyBreakdown.Medium,
                  color: "bg-orange-500",
                },
                {
                  name: "Hard",
                  count: difficultyBreakdown.Hard,
                  color: "bg-red-500",
                },
              ].map((item) => {
                const percentage =
                  problemsSolved > 0
                    ? (item.count / problemsSolved) * 100
                    : 0;

                return (
                  <div key={item.name}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium text-slate-600 dark:text-slate-300">
                        {item.name}
                      </span>

                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.count}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
              Total unique problems solved: {problemsSolved}
            </p>
          </div>

          {/* Next milestone */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Your Next Milestone
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {remainingProblems > 0
                ? `Solve ${remainingProblems} more problems to unlock the Problem Solver milestone.`
                : "Congratulations! You reached your 150-problem milestone."}
            </p>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-2xl font-extrabold text-violet-600">
                {problemsSolved}/{MILESTONE_TARGET}
              </span>

              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {Math.round(milestoneProgress)}% Complete
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500 transition-all duration-500"
                style={{ width: `${milestoneProgress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recent problems */}
      <section>
        <RecentProblems
          problems={recentProblems}
          isLoading={isLoading}
        />
      </section>
    </DashboardLayout>
  );
};

export default Dashboard;
