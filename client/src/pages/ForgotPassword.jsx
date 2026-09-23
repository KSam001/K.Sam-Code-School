import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to connect to the learning engine.');
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
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-ink">Reset your password</h1>
            <p className="text-sm text-steel mt-1">Enter your email address and we'll send you a link to get back into your account.</p>
          </div>

          {message && (
            <div className="bg-resolvebg text-resolvetext p-3 rounded-lg text-sm">{message}</div>
          )}

          {error && (
            <div className="bg-ashmist text-graphite p-3 rounded-lg text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              autoComplete="email"
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-ashmist border border-softfog text-ink placeholder-silver rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ink transition"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-white font-medium py-3 rounded-pill text-sm hover:bg-graphite transition disabled:opacity-50"
            >
              {loading ? 'Sending link...' : 'Send reset link'}
            </button>
          </form>
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
