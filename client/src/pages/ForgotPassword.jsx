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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
            <span className="text-black font-extrabold text-xs">K</span>
          </div>
          <span className="font-bold text-lg text-white">K.Sam Code School</span>
        </div>

        <h1 className="text-2xl font-semibold text-white">Reset your password</h1>
        <p className="text-sm text-zinc-400">Enter your email address and we'll send you a link to get back into your account.</p>

        {message && (
          <div className="bg-[#1C1C1E] border border-zinc-800 text-zinc-200 p-3.5 rounded-2xl text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-[#1C1C1E] border border-zinc-700 text-zinc-300 p-3.5 rounded-2xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#1C1C1E] text-white placeholder-zinc-500 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-white transition"
            placeholder="Email address"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold py-3 rounded-full text-sm transition cursor-pointer hover:bg-zinc-200 disabled:opacity-50"
          >
            {loading ? 'Sending link...' : 'Send reset link'}
          </button>
        </form>

        <div>
          <Link to="/login" className="text-sm text-zinc-400 hover:text-white underline underline-offset-4">
            Back to sign in
          </Link>
        </div>

      </div>
    </div>
  );
}