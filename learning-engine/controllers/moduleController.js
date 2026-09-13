const db = require('../prisma/client');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.createModule = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    throw new AppError('Module title is required.', 400);
  }

  const newModule = await db.module.create({
    data: {
      title,
      description: description || null,
      userId: req.user.userId,
    },
  });

  res.status(201).json({ message: 'Module created successfully.', module: newModule });
});

exports.getUserModules = asyncHandler(async (req, res) => {
  const modules = await db.module.findMany({
    where: { userId: req.user.userId },
    include: { _count: { select: { exercises: true } } },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ modules });
});

exports.getModuleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const moduleItem = await db.module.findFirst({
    where: { id, userId: req.user.userId },
    include: { exercises: true },
  });

  if (!moduleItem) {
    throw new AppError('Module not found.', 404);
  }

  res.json({ module: moduleItem });
});

exports.deleteModule = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existingModule = await db.module.findFirst({
    where: { id, userId: req.user.userId },
  });

  if (!existingModule) {
    throw new AppError('Module not found or unauthorized.', 404);
  }

  await db.module.delete({ where: { id } });

  res.json({ message: 'Module deleted successfully.' });
});