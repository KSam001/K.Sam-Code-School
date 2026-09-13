import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('This reset link is invalid or incomplete.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">

        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
            <span className="text-black font-extrabold text-xs">K</span>
          </div>
          <span className="font-bold text-lg text-white">K.Sam Code School</span>
        </div>

        <h1 className="text-2xl font-semibold text-white">Set a new password</h1>

        {!token && (
          <div className="bg-[#1C1C1E] border border-zinc-700 text-zinc-300 p-3.5 rounded-2xl text-sm">
            This reset link is invalid or missing a token. Request a new one from the forgot password page.
          </div>
        )}

        {success && (
          <div className="bg-[#1C1C1E] border border-zinc-800 text-zinc-200 p-3.5 rounded-2xl text-sm">
            Password updated. Redirecting you to sign in.
          </div>
        )}

        {error && (
          <div className="bg-[#1C1C1E] border border-zinc-700 text-zinc-300 p-3.5 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {!success && token && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#1C1C1E] text-white placeholder-zinc-500 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-white transition"
              placeholder="New password (min. 8 characters)"
            />

            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#1C1C1E] text-white placeholder-zinc-500 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-white transition"
              placeholder="Confirm new password"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-semibold py-3 rounded-full text-sm transition cursor-pointer hover:bg-zinc-200 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        )}

        <div>
          <Link to="/login" className="text-sm text-zinc-400 hover:text-white underline underline-offset-4">
            Back to sign in
          </Link>
        </div>

      </div>
    </div>
  );
}