import Submission from "../models/Submission.js";

const getUTCDateKey = (date) => {
  return date.toISOString().slice(0, 10);
};

const getCurrentStreak = (activityDates) => {
  if (!activityDates.length) return 0;

  const activeDates = new Set(activityDates);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  let currentDate = activeDates.has(getUTCDateKey(today))
    ? today
    : yesterday;

  if (!activeDates.has(getUTCDateKey(currentDate))) {
    return 0;
  }

  let streak = 0;

  while (activeDates.has(getUTCDateKey(currentDate))) {
    streak++;

    currentDate = new Date(currentDate);
    currentDate.setUTCDate(currentDate.getUTCDate() - 1);
  }

  return streak;
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      totalSubmissions,
      acceptedSubmissions,
      evaluatedSubmissions,
      solvedProblemIds,
      activityResults,
      recentSubmissions,
      leaderboardResults,
    ] = await Promise.all([
      // Total submissions made by the authenticated user.
      Submission.countDocuments({
        user: userId,
      }),

      // Accepted submissions.
      Submission.countDocuments({
        user: userId,
        verdict: "Accepted",
      }),

      // Evaluated submissions, excluding Pending and Internal Error.
      Submission.countDocuments({
        user: userId,
        verdict: {
          $nin: ["Pending", "Internal Error"],
        },
      }),

      // Unique problems solved.
      Submission.distinct("problem", {
        user: userId,
        verdict: "Accepted",
      }),

      // All distinct UTC dates with accepted submissions.
      Submission.aggregate([
        {
          $match: {
            user: userId,
            verdict: "Accepted",
          },
        },
        {
          $project: {
            day: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: "UTC",
              },
            },
          },
        },
        {
          $group: {
            _id: "$day",
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ]),

      // Latest five submissions. Never return source code.
      Submission.find({
        user: userId,
      })
        .select(
          "problem language verdict passedTestCases totalTestCases executionTime memory createdAt"
        )
        .populate("problem", "title slug difficulty")
        .sort({
          createdAt: -1,
          _id: -1,
        })
        .limit(5)
        .lean(),

      // Calculate the authenticated user's global leaderboard position.
      Submission.aggregate([
        {
          $match: {
            verdict: "Accepted",
          },
        },
        {
          $group: {
            _id: {
              user: "$user",
              problem: "$problem",
            },
            acceptedAttempts: {
              $sum: 1,
            },
          },
        },
        {
          $group: {
            _id: "$_id.user",
            problemsSolved: {
              $sum: 1,
            },
            acceptedSubmissions: {
              $sum: "$acceptedAttempts",
            },
          },
        },
        {
          $lookup: {
            from: "users",
            let: {
              userId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$_id", "$$userId"],
                      },
                      {
                        $eq: ["$isActive", true],
                      },
                      {
                        $eq: ["$role", "user"],
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                },
              },
            ],
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $sort: {
            problemsSolved: -1,
            acceptedSubmissions: -1,
            _id: 1,
          },
        },
        {
          $project: {
            _id: 1,
            problemsSolved: 1,
            acceptedSubmissions: 1,
          },
        },
      ]),
    ]);

    // Calculate acceptance rate.
    const acceptanceRate =
      evaluatedSubmissions > 0
        ? Number(
            (
              (acceptedSubmissions / evaluatedSubmissions) *
              100
            ).toFixed(1)
          )
        : 0;

    // Calculate current streak.
    const activityDates = activityResults.map(
      (item) => item._id
    );

    const currentStreak = getCurrentStreak(activityDates);

    // Find the user's global rank.
    const currentUserRankIndex = leaderboardResults.findIndex(
      (entry) => entry._id.toString() === userId.toString()
    );

    const currentUserRank =
      currentUserRankIndex !== -1
        ? currentUserRankIndex + 1
        : null;

    // Format recent submissions without exposing private fields.
    const formattedRecentSubmissions = recentSubmissions.map(
      (submission) => ({
        id: submission._id,
        problem: submission.problem
          ? {
              id: submission.problem._id,
              title: submission.problem.title,
              slug: submission.problem.slug,
              difficulty: submission.problem.difficulty,
            }
          : {
              id: null,
              title: "Deleted Problem",
              slug: null,
              difficulty: null,
            },
        language: submission.language,
        verdict: submission.verdict,
        passedTestCases: submission.passedTestCases,
        totalTestCases: submission.totalTestCases,
        executionTime: submission.executionTime,
        memory: submission.memory,
        createdAt: submission.createdAt,
      })
    );

    return res.status(200).json({
      success: true,

      profile: {
        id: req.user._id,
        name: req.user.name,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        createdAt: req.user.createdAt,
      },

      statistics: {
        totalSubmissions,
        acceptedSubmissions,
        problemsSolved: solvedProblemIds.length,
        acceptanceRate,
        currentStreak,
      },

      leaderboard: {
        rank: currentUserRank,
      },

      recentSubmissions: formattedRecentSubmissions,
    });
  } catch (error) {
    console.error("Get user profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve your profile.",
    });
  }
};
