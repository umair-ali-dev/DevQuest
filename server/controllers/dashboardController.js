import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";

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

  // A streak can continue from today or yesterday.
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

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Seven-day activity window, including today (UTC).
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setUTCDate(startDate.getUTCDate() - 6);

    const [
      totalSubmissions,
      acceptedSubmissions,
      evaluatedSubmissions,
      solvedProblemIds,
      activityResults,
      recentProblemResults,
      streakResults,
    ] = await Promise.all([
      // All submissions made by this user.
      Submission.countDocuments({
        user: userId,
      }),

      // Accepted submissions.
      Submission.countDocuments({
        user: userId,
        verdict: "Accepted",
      }),

      // Exclude Pending and Internal Error from the acceptance rate.
      Submission.countDocuments({
        user: userId,
        verdict: {
          $nin: ["Pending", "Internal Error"],
        },
      }),

      // Distinct problems solved by this user.
      Submission.distinct("problem", {
        user: userId,
        verdict: "Accepted",
      }),

      // Count distinct problems accepted per day over the last 7 days.
      Submission.aggregate([
        {
          $match: {
            user: userId,
            verdict: "Accepted",
            createdAt: {
              $gte: startDate,
            },
          },
        },
        {
          $project: {
            problem: 1,
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
            _id: {
              day: "$day",
              problem: "$problem",
            },
          },
        },
        {
          $group: {
            _id: "$_id.day",
            solved: {
              $sum: 1,
            },
          },
        },
      ]),

      // Most recently attempted distinct problems.
      Submission.aggregate([
        {
          $match: {
            user: userId,
          },
        },
        {
          $sort: {
            createdAt: -1,
            _id: -1,
          },
        },
        {
          $group: {
            _id: "$problem",

            latest: {
              $first: {
                verdict: "$verdict",
                language: "$language",
                createdAt: "$createdAt",
              },
            },

            isSolved: {
              $max: {
                $cond: [
                  {
                    $eq: ["$verdict", "Accepted"],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $sort: {
            "latest.createdAt": -1,
          },
        },
        {
          $limit: 5,
        },
        {
          $lookup: {
            from: "problems",
            localField: "_id",
            foreignField: "_id",
            as: "problem",
          },
        },
        {
          $unwind: {
            path: "$problem",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            problemId: "$_id",
            title: {
              $ifNull: ["$problem.title", "Deleted Problem"],
            },
            slug: "$problem.slug",
            difficulty: "$problem.difficulty",
            tags: {
              $ifNull: ["$problem.tags", []],
            },
            verdict: "$latest.verdict",
            language: "$latest.language",
            createdAt: "$latest.createdAt",
            isSolved: {
              $eq: ["$isSolved", 1],
            },
          },
        },
      ]),

      // All distinct UTC dates with at least one accepted submission.
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
    ]);

    // Calculate difficulty distribution using distinct solved problems.
    const solvedProblems = solvedProblemIds.length
      ? await Problem.find({
          _id: {
            $in: solvedProblemIds,
          },
        }).select("difficulty")
      : [];

    const difficultyBreakdown = {
      Easy: 0,
      Medium: 0,
      Hard: 0,
    };

    for (const problem of solvedProblems) {
      if (difficultyBreakdown[problem.difficulty] !== undefined) {
        difficultyBreakdown[problem.difficulty]++;
      }
    }

    // Fill missing activity dates with zero.
    const activityMap = new Map(
      activityResults.map((item) => [item._id, item.solved])
    );

    const activity = [];

    for (let index = 0; index < 7; index++) {
      const date = new Date(startDate);
      date.setUTCDate(date.getUTCDate() + index);

      const dateKey = getUTCDateKey(date);

      activity.push({
        date: dateKey,
        day: date.toLocaleDateString("en-US", {
          weekday: "short",
          timeZone: "UTC",
        }),
        solved: activityMap.get(dateKey) || 0,
      });
    }

    const acceptanceRate =
      evaluatedSubmissions > 0
        ? Number(
            (
              (acceptedSubmissions / evaluatedSubmissions) *
              100
            ).toFixed(1)
          )
        : 0;

    const activityDates = streakResults.map((item) => item._id);

    const currentStreak = getCurrentStreak(activityDates);

    return res.status(200).json({
      success: true,

      statistics: {
        totalSubmissions,
        problemsSolved: solvedProblemIds.length,
        acceptedSubmissions,
        evaluatedSubmissions,
        acceptanceRate,
        currentStreak,
        difficultyBreakdown,
      },

      activity,

      recentProblems: recentProblemResults,
    });
  } catch (error) {
    console.error("Get dashboard statistics error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve dashboard statistics.",
    });
  }
};