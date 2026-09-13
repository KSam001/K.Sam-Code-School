const db = require('../prisma/client');
const asyncHandler = require('../utils/asyncHandler');

function toDateKey(date) {
  return date.toISOString().split('T')[0];
}

function calculateStreak(reviewDates) {
  if (reviewDates.length === 0) return 0;

  const uniqueDays = [...new Set(reviewDates.map(toDateKey))].sort().reverse();

  const today = toDateKey(new Date());
  const yesterday = toDateKey(new Date(Date.now() - 86400000));

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  let cursor = new Date(uniqueDays[0]);

  for (let i = 1; i < uniqueDays.length; i++) {
    cursor.setDate(cursor.getDate() - 1);
    if (toDateKey(cursor) === uniqueDays[i]) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

exports.getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const now = new Date();

  const [totalModules, totalExercises, dueReviewsCount, totalReviewsLogged, recentLogs] =
    await Promise.all([
      db.module.count({ where: { userId } }),
      db.exercise.count({ where: { module: { userId } } }),
      db.progress.count({ where: { userId, nextReviewDate: { lte: now } } }),
      db.reviewLog.count({ where: { userId } }),
      db.reviewLog.findMany({
        where: { userId },
        select: { reviewedAt: true },
        orderBy: { reviewedAt: 'desc' },
        take: 90,
      }),
    ]);

  const currentStreakDays = calculateStreak(recentLogs.map((log) => log.reviewedAt));

  res.json({
    stats: {
      totalModules,
      totalExercises,
      dueReviewsCount,
      totalReviewsLogged,
      currentStreakDays,
    },
  });
});