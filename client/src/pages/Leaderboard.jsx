import { useCallback, useEffect, useState } from "react";
import {
  Trophy,
  Medal,
  Crown,
  Target,
  CheckCircle2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  LoaderCircle,
  Users,
  Code2,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../services/api";

const PAGE_SIZE = 20;

const getInitials = (name, username) => {
  const value = name || username || "U";

  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const getRankStyle = (rank) => {
  if (rank === 1) {
    return {
      icon: Crown,
      color: "text-yellow-500",
      background: "bg-yellow-100 dark:bg-yellow-500/10",
    };
  }

  if (rank === 2) {
    return {
      icon: Medal,
      color: "text-slate-500 dark:text-slate-300",
      background: "bg-slate-100 dark:bg-slate-700/40",
    };
  }

  if (rank === 3) {
    return {
      icon: Medal,
      color: "text-orange-600 dark:text-orange-400",
      background: "bg-orange-100 dark:bg-orange-500/10",
    };
  }

  return {
    icon: null,
    color: "text-slate-500 dark:text-slate-400",
    background: "bg-slate-100 dark:bg-slate-800",
  };
};

function PlayerAvatar({ player, size = "normal" }) {
  const sizeClass =
    size === "large" ? "h-16 w-16 text-xl" : "h-10 w-10 text-sm";

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-100 font-bold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 ${sizeClass}`}
    >
      {player.avatar ? (
        <img
          src={player.avatar}
          alt={player.username || player.name || "Player"}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        getInitials(player.name, player.username)
      )}
    </div>
  );
}

function PodiumCard({ player, position }) {
  const rankStyle = getRankStyle(position);
  const RankIcon = rankStyle.icon;

  return (
    <div
      className={`relative rounded-2xl border p-5 text-center transition ${position === 1
        ? "border-yellow-300 bg-yellow-50 dark:border-yellow-500/30 dark:bg-yellow-500/5"
        : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        }`}
    >
      {position === 1 && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-yellow-950">
          TOP PLAYER
        </div>
      )}

      <div
        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${rankStyle.background}`}
      >
        {RankIcon ? (
          <RankIcon size={19} className={rankStyle.color} />
        ) : (
          <span className="text-sm font-bold text-orange-600">3</span>
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <PlayerAvatar player={player} size="large" />
      </div>

      <h3 className="mt-3 truncate font-bold text-slate-900 dark:text-white">
        {player.name || player.username}
      </h3>

      <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
        @{player.username || "user"}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">
        <div>
          <p className="text-xl font-bold text-violet-600 dark:text-violet-400">
            {player.problemsSolved ?? 0}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Solved
          </p>
        </div>

        <div>
          <p className="text-xl font-bold text-slate-800 dark:text-white">
            {player.acceptedSubmissions ?? 0}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Accepted
          </p>
        </div>
      </div>
    </div>
  );
}

function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/leaderboard", {
        params: {
          page,
          limit: PAGE_SIZE,
        },
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to load the leaderboard."
        );
      }

      setPlayers(
        Array.isArray(response.data.leaderboard)
          ? response.data.leaderboard
          : []
      );

      setCurrentUserRank(response.data.currentUserRank || null);

      setPagination(
        response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalUsers: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      );
    } catch (err) {
      console.error("Leaderboard fetch error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load the leaderboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchLeaderboard();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchLeaderboard]);

  const topPlayers = players.filter(
    (player) => player.rank >= 1 && player.rank <= 3
  );

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage && !loading) {
      setPage((current) => Math.max(1, current - 1));
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage && !loading) {
      setPage((current) => current + 1);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-7">
        {/* PAGE HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400">
              <Trophy size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                Leaderboard
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Compete with developers and climb the rankings.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchLeaderboard}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* CURRENT USER RANK */}
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 dark:border-violet-500/20 dark:bg-violet-500/10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-violet-700 dark:text-violet-300">
                <Target size={17} />
                Your Global Ranking
              </p>

              <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                {currentUserRank?.rank
                  ? `#${currentUserRank.rank}`
                  : "Unranked"}
              </p>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {currentUserRank
                  ? "Keep solving problems to improve your position."
                  : "Get your first accepted solution to enter the leaderboard."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5 sm:gap-8">
              <div>
                <p className="text-2xl font-bold text-violet-700 dark:text-violet-300">
                  {currentUserRank?.problemsSolved ?? 0}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Problems Solved
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-violet-700 dark:text-violet-300">
                  {currentUserRank?.acceptedSubmissions ?? 0}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Accepted
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* LEADERBOARD STATISTICS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Ranked Developers
              </p>
              <Users size={21} className="text-violet-500" />
            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
              {pagination.totalUsers}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Your Solved Problems
              </p>
              <Code2 size={21} className="text-green-500" />
            </div>

            <p className="mt-3 text-3xl font-bold text-green-600 dark:text-green-400">
              {currentUserRank?.problemsSolved ?? 0}
            </p>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <LoaderCircle
              size={34}
              className="animate-spin text-violet-500"
            />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Loading leaderboard...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-red-200 bg-white px-5 text-center dark:border-red-500/20 dark:bg-slate-900">
            <AlertCircle size={38} className="text-red-500" />

            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
              Unable to load leaderboard
            </h3>

            <p className="mt-2 max-w-md text-sm text-red-500">{error}</p>

            <button
              type="button"
              onClick={fetchLeaderboard}
              className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* LEADERBOARD CONTENT */}
        {!loading && !error && (
          <>
            {/* TOP THREE */}
            {topPlayers.length > 0 && (
              <section>
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Top Developers
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    The highest-ranked problem solvers.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {topPlayers.map((player) => (
                    <PodiumCard
                      key={player.userId || player.username || player.rank}
                      player={player}
                      position={player.rank}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* FULL RANKINGS */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 p-5 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Global Rankings
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {pagination.totalUsers} ranked developer
                  {pagination.totalUsers === 1 ? "" : "s"}
                </p>
              </div>

              {players.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
                  <Trophy size={42} className="text-slate-300 dark:text-slate-600" />

                  <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                    No rankings available
                  </h3>

                  <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                    Solve a problem and get an Accepted submission to appear
                    on the leaderboard.
                  </p>
                </div>
              ) : (
                <>
                  {/* DESKTOP TABLE */}
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                          <th className="px-5 py-4">Rank</th>
                          <th className="px-5 py-4">Developer</th>
                          <th className="px-5 py-4">Problems Solved</th>
                          <th className="px-5 py-4">Accepted Submissions</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {players.map((player) => {
                          const rankStyle = getRankStyle(player.rank);
                          const RankIcon = rankStyle.icon;

                          return (
                            <tr
                              key={player.userId || player.username || player.rank}
                              className={`transition hover:bg-slate-50 dark:hover:bg-slate-800/40 ${player.isCurrentUser
                                ? "bg-violet-50/70 dark:bg-violet-500/5"
                                : ""
                                }`}
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2">
                                  {RankIcon ? (
                                    <RankIcon
                                      size={18}
                                      className={rankStyle.color}
                                    />
                                  ) : (
                                    <span className="w-[18px] text-center text-sm font-bold text-slate-500">
                                      {player.rank}
                                    </span>
                                  )}

                                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                    #{player.rank}
                                  </span>
                                </div>
                              </td>

                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <PlayerAvatar player={player} />

                                  <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                      {player.name || player.username}
                                      {player.isCurrentUser && (
                                        <span className="ml-2 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                                          YOU
                                        </span>
                                      )}
                                    </p>

                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      @{player.username || "user"}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-5 py-4">
                                <span className="font-bold text-violet-600 dark:text-violet-400">
                                  {player.problemsSolved ?? 0}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-400">
                                  <CheckCircle2 size={15} />
                                  {player.acceptedSubmissions ?? 0}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE CARDS */}
                  <div className="space-y-3 p-4 md:hidden">
                    {players.map((player) => (
                      <div
                        key={player.userId || player.username || player.rank}
                        className={`rounded-xl border p-4 ${player.isCurrentUser
                          ? "border-violet-300 bg-violet-50/70 dark:border-violet-500/30 dark:bg-violet-500/5"
                          : "border-slate-200 dark:border-slate-800"
                          }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <PlayerAvatar player={player} />

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900 dark:text-white">
                                {player.name || player.username}
                              </p>
                              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                @{player.username || "user"}
                              </p>
                            </div>
                          </div>

                          <span className="shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            #{player.rank}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-3 dark:border-slate-800">
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Problems Solved
                            </p>
                            <p className="mt-1 font-bold text-violet-600 dark:text-violet-400">
                              {player.problemsSolved ?? 0}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Accepted
                            </p>
                            <p className="mt-1 font-bold text-green-600 dark:text-green-400">
                              {player.acceptedSubmissions ?? 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* PAGINATION */}
              {pagination.totalPages > 1 && (
                <div className="flex flex-col justify-between gap-4 border-t border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Page {pagination.currentPage} of {pagination.totalPages}
                    {" · "}
                    {pagination.totalUsers} developers
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePreviousPage}
                      disabled={!pagination.hasPreviousPage || loading}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>

                    <button
                      type="button"
                      onClick={handleNextPage}
                      disabled={!pagination.hasNextPage || loading}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Leaderboard;
