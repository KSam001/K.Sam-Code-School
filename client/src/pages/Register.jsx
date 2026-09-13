import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/useAuth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    onError: () => setError('Google Sign-In was cancelled or failed'),
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
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-4">

      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/register-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />

      <div className="relative z-20 w-full max-w-sm space-y-5 backdrop-blur-sm bg-zinc-950/30 p-8 rounded-3xl border border-white/10 shadow-2xl">

        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 bg-zinc-200 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-black font-black text-xs">K</span>
          </div>
          <span
            className="text-zinc-200 text-lg font-bold tracking-widest uppercase"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            K.Sam Code School
          </span>
        </div>

        <h1 className="text-xl font-semibold text-zinc-200 tracking-tight">Create your account</h1>

        {error && (
          <div className="bg-zinc-900 border border-zinc-800 text-zinc-300 p-3 rounded-xl text-xs">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={() => handleGoogleSignIn()}
          className="w-full bg-zinc-200 text-zinc-900 font-medium py-3 px-4 rounded-full flex items-center justify-center space-x-3 hover:bg-white transition cursor-pointer shadow-lg text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="font-semibold">Sign up with Google</span>
        </button>

        <div className="text-xs text-zinc-500 text-center tracking-wider uppercase text-[10px]">Or continue with email</div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-200 placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 transition"
            placeholder="Full name"
          />

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-200 placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 transition"
            placeholder="Email address"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-200 placeholder-zinc-500 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-zinc-500 transition"
              placeholder="Password (min. 8 characters)"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m14.41 14.41l-3.59-3.59" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-200 placeholder-zinc-500 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-zinc-500 transition"
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
            >
              {showConfirmPassword ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m14.41 14.41l-3.59-3.59" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-200 text-zinc-900 font-semibold py-3 rounded-full text-sm transition cursor-pointer hover:bg-white shadow-lg mt-2"
          >
            Create account
          </button>
        </form>

        <div className="text-xs text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="text-zinc-200 underline underline-offset-4 hover:text-white">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
}