const db = require('../prisma/client');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

function calculateSM2(quality, prevEaseFactor, prevInterval) {
  let easeFactor = prevEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  let interval;
  if (quality < 3) {
    interval = 1;
  } else if (prevInterval === 0) {
    interval = 1;
  } else if (prevInterval === 1) {
    interval = 6;
  } else {
    interval = Math.round(prevInterval * easeFactor);
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return { easeFactor, interval, nextReviewDate };
}

exports.recordReview = asyncHandler(async (req, res) => {
  const { exerciseId, quality } = req.body;

  if (exerciseId === undefined || quality === undefined) {
    throw new AppError('exerciseId and quality score (0-5) are required.', 400);
  }

  if (!Number.isInteger(quality) || quality < 0 || quality > 5) {
    throw new AppError('Quality score must be an integer between 0 and 5.', 400);
  }

  const existing = await db.progress.findUnique({
    where: { userId_exerciseId: { userId: req.user.userId, exerciseId } },
  });

  const { easeFactor, interval, nextReviewDate } = calculateSM2(
    quality,
    existing ? existing.easeFactor : 2.5,
    existing ? existing.interval : 0
  );

  const [progress] = await db.$transaction([
    db.progress.upsert({
      where: { userId_exerciseId: { userId: req.user.userId, exerciseId } },
      update: { easeFactor, interval, nextReviewDate },
      create: { userId: req.user.userId, exerciseId, easeFactor, interval, nextReviewDate },
    }),
    db.reviewLog.create({
      data: { userId: req.user.userId, exerciseId },
    }),
  ]);

  res.json({ message: 'Review progress updated successfully.', progress });
});

exports.getDueReviews = asyncHandler(async (req, res) => {
  const dueReviews = await db.progress.findMany({
    where: {
      userId: req.user.userId,
      nextReviewDate: { lte: new Date() },
    },
    include: { exercise: true },
  });

  res.json({ dueReviews });
});