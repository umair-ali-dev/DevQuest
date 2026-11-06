import Submission from "../models/Submission.js";

export const getLeaderboard = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);

    const requestedLimit = Number.parseInt(req.query.limit, 10) || 20;
    const limit = Math.min(50, Math.max(1, requestedLimit));

    // Count unique problems solved and total accepted submissions per user.
    const leaderboardResults = await Submission.aggregate([
      {
        $match: {
          verdict: "Accepted",
        },
      },
      {
        // Group by user and problem to count each solved problem once.
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
        // Calculate each user's total solved problems and accepted attempts.
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
        // Retrieve only public profile information.
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
                    { $eq: ["$_id", "$$userId"] },
                    { $eq: ["$isActive", true] },
                    { $eq: ["$role", "user"] },
                  ],
                },
              },
            },
            {
              $project: {
                name: 1,
                username: 1,
                avatar: 1,
              },
            },
          ],
          as: "user",
        },
      },
      {
        // Remove users who are inactive or have an admin role.
        $unwind: "$user",
      },
      {
        // Ranking order: solved problems, accepted attempts, then user ID.
        $sort: {
          problemsSolved: -1,
          acceptedSubmissions: -1,
          _id: 1,
        },
      },
    ]);

    // Assign global ranks before applying pagination.
    const rankedUsers = leaderboardResults.map((entry, index) => ({
      rank: index + 1,
      userId: entry._id.toString(),
      name: entry.user.name,
      username: entry.user.username,
      avatar: entry.user.avatar,
      problemsSolved: entry.problemsSolved,
      acceptedSubmissions: entry.acceptedSubmissions,
      isCurrentUser:
        entry._id.toString() === req.user._id.toString(),
    }));

    const totalUsers = rankedUsers.length;
    const totalPages = Math.ceil(totalUsers / limit);
    const startIndex = (page - 1) * limit;

    const leaderboard = rankedUsers.slice(
      startIndex,
      startIndex + limit
    );

    // Return the current user's global position, even if they
    // are not included on the requested page.
    const currentUser = rankedUsers.find(
      (entry) => entry.isCurrentUser
    );

    return res.status(200).json({
      success: true,
      leaderboard,
      currentUserRank: currentUser
        ? {
            rank: currentUser.rank,
            problemsSolved: currentUser.problemsSolved,
            acceptedSubmissions: currentUser.acceptedSubmissions,
          }
        : null,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Leaderboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load leaderboard.",
    });
  }
};
