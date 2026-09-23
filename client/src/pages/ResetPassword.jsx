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
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-5">

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-ink flex items-center justify-center">
            <span className="text-white font-semibold text-xs">K</span>
          </div>
          <span className="text-sm font-semibold text-ink">K.Sam Code School</span>
        </div>

        <div className="bg-white rounded-card p-6 shadow-card space-y-4">
          <h1 className="text-[22px] font-semibold tracking-tight text-ink">Set a new password</h1>

          {!token && (
            <div className="bg-ashmist text-graphite p-3 rounded-lg text-sm">
              This reset link is invalid or missing a token. Request a new one from the forgot password page.
            </div>
          )}

          {success && (
            <div className="bg-resolvebg text-resolvetext p-3 rounded-lg text-sm">
              Password updated. Redirecting you to sign in.
            </div>
          )}

          {error && (
            <div className="bg-ashmist text-graphite p-3 rounded-lg text-sm">{error}</div>
          )}

          {!success && token && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="password"
                required
                autoComplete="new-password"
                aria-label="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min. 8 characters)"
                className="w-full bg-ashmist border border-softfog text-ink placeholder-silver rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ink transition"
              />

              <input
                type="password"
                required
                autoComplete="new-password"
                aria-label="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-ashmist border border-softfog text-ink placeholder-silver rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ink transition"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink text-white font-medium py-3 rounded-pill text-sm hover:bg-graphite transition disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          )}
        </div>

        <div className="text-sm text-steel text-center">
          <Link to="/login" className="text-ink font-medium underline underline-offset-4">
            Back to sign in
          </Link>
        </div>

      </div>
    </div>
  );
}
