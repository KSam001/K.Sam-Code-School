import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await loginWithGoogle(tokenResponse.access_token);
        navigate('/dashboard', { state: { justAuthenticated: true } });
      } catch (err) {
        setError('Google authentication failed on server');
      }
    },
    onError: () => setError('Google Sign-In was cancelled or failed'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard', { state: { justAuthenticated: true } });
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
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
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10" />

      <div className="relative z-20 w-full max-w-sm space-y-6 backdrop-blur-md bg-black/40 p-8 rounded-3xl border border-white/10 shadow-2xl">

        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
            <span className="text-black font-extrabold text-xs">K</span>
          </div>
          <span className="font-bold text-lg text-white">K.Sam Code School</span>
        </div>

        <h1 className="text-2xl font-semibold text-white">Sign in to your account</h1>

        {error && (
          <div className="bg-[#1C1C1E] border border-zinc-700 text-zinc-300 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={() => handleGoogleSignIn()}
          className="w-full bg-white text-black font-medium py-3 px-4 rounded-full flex items-center justify-center space-x-3 hover:bg-zinc-200 transition cursor-pointer shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          <span className="text-sm font-semibold">Sign in with Google</span>
        </button>

        <div className="text-xs text-zinc-400 text-center">Or continue with email</div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-white transition"
            placeholder="Email address"
          />

          <div className="space-y-1">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-white transition"
              placeholder="Password"
            />
            <div className="flex justify-end pt-1">
              <Link to="/forgot-password" className="text-xs text-zinc-400 hover:text-white transition">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-3 rounded-full text-sm transition cursor-pointer hover:bg-zinc-200 shadow-lg"
          >
            Sign in
          </button>
        </form>

        <div className="text-sm text-zinc-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-white underline underline-offset-4">
            Sign up
          </Link>
        </div>

      </div>
    </div>
  );
}