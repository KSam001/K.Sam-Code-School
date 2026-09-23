import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/useAuth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await loginWithGoogle(tokenResponse.access_token);
        navigate('/dashboard', { state: { justAuthenticated: true } });
      } catch {
        setError('Google authentication failed on server');
      }
    },
    onError: () => setError('Google sign-in was cancelled or failed'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      await register(email, password, name);
      navigate('/dashboard', { state: { justAuthenticated: true } });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
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
          <h1 className="text-[22px] font-semibold tracking-tight text-ink">Create your account</h1>

          {error && (
            <div className="bg-ashmist text-graphite p-3 rounded-lg text-sm">{error}</div>
          )}

          <button
            type="button"
            onClick={() => handleGoogleSignIn()}
            className="w-full bg-white border border-softfog text-ink font-medium py-2.5 px-4 rounded-pill flex items-center justify-center gap-2.5 hover:bg-ashmist transition text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Sign up with Google
          </button>

          <div className="text-xs text-silver text-center">Or continue with email</div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              required
              autoComplete="name"
              aria-label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full bg-ashmist border border-softfog text-ink placeholder-silver rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ink transition"
            />
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
            <input
              type="password"
              required
              autoComplete="new-password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min. 8 characters)"
              className="w-full bg-ashmist border border-softfog text-ink placeholder-silver rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ink transition"
            />
            <input
              type="password"
              required
              autoComplete="new-password"
              aria-label="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full bg-ashmist border border-softfog text-ink placeholder-silver rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ink transition"
            />
            <button
              type="submit"
              className="w-full bg-ink text-white font-medium py-3 rounded-pill text-sm hover:bg-graphite transition"
            >
              Create account
            </button>
          </form>
        </div>

        <div className="text-sm text-steel text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-ink font-medium underline underline-offset-4">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
}
