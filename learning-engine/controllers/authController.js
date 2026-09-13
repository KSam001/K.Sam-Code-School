const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const nodemailer = require('nodemailer');
const db = require('../prisma/client');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function toPublicUser(user) {
  return { id: user.id, email: user.email, name: user.name };
}

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required.', 400);
  }

  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters long.', 400);
  }

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('User already exists with this email.', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      name: name || 'User',
      email,
      password: hashedPassword,
      provider: 'PASSWORD',
    },
  });

  const token = signToken(user.id);

  res.status(201).json({ token, user: toPublicUser(user) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required.', 400);
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    throw new AppError('Invalid email or password.', 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 400);
  }

  const token = signToken(user.id);

  res.json({ token, user: toPublicUser(user) });
});

exports.googleAuth = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError('Google access token is required.', 400);
  }

  let googleProfile;
  try {
    const googleRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });
    googleProfile = googleRes.data;
  } catch (err) {
    throw new AppError('Google authentication failed.', 400);
  }

  const { email, name } = googleProfile;

  if (!email) {
    throw new AppError('Google account has no email associated.', 400);
  }

  let user = await db.user.findUnique({ where: { email } });

  if (!user) {
    user = await db.user.create({
      data: {
        email,
        name: name || 'User',
        provider: 'GOOGLE',
      },
    });
  }

  const jwtToken = signToken(user.id);

  res.json({ token: jwtToken, user: toPublicUser(user) });
});

exports.me = asyncHandler(async (req, res) => {
  const user = await db.user.findUnique({ where: { id: req.user.userId } });

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  res.json({ user: toPublicUser(user) });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required.', 400);
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return res.json({ message: 'If that email exists, a reset link has been sent.' });
  }

  const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: '"K.Sam Code School" <no-reply@ksam.dev>',
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <div style="background-color: #000; color: #fff; padding: 24px; font-family: sans-serif;">
        <h2>Password Reset</h2>
        <p>You requested to reset your password for K.Sam Code School.</p>
        <a href="${resetLink}" style="background: #fff; color: #000; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block; margin-top: 16px;">Reset Password</a>
        <p style="color: #888; font-size: 12px; margin-top: 24px;">If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  });

  res.json({ message: 'If that email exists, a reset link has been sent.' });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new AppError('Token and new password are required.', 400);
  }

  if (newPassword.length < 8) {
    throw new AppError('Password must be at least 8 characters long.', 400);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new AppError('Invalid or expired reset token.', 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.user.update({
    where: { id: decoded.userId },
    data: { password: hashedPassword },
  });

  res.json({ message: 'Password has been successfully reset.' });
});