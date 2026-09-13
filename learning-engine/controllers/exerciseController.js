const db = require('../prisma/client');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.createExercise = asyncHandler(async (req, res) => {
  const { moduleId, questionText, correctAnswer } = req.body;

  if (!moduleId || !questionText || !correctAnswer) {
    throw new AppError('moduleId, questionText, and correctAnswer are required.', 400);
  }

  const moduleItem = await db.module.findFirst({
    where: { id: moduleId, userId: req.user.userId },
  });

  if (!moduleItem) {
    throw new AppError('Module not found or unauthorized.', 404);
  }

  const exercise = await db.exercise.create({
    data: { moduleId, questionText, correctAnswer },
  });

  res.status(201).json({ message: 'Exercise created successfully.', exercise });
});

exports.getExercisesByModule = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;

  const moduleItem = await db.module.findFirst({
    where: { id: moduleId, userId: req.user.userId },
  });

  if (!moduleItem) {
    throw new AppError('Module not found or unauthorized.', 404);
  }

  const exercises = await db.exercise.findMany({ where: { moduleId } });

  res.json({ exercises });
});