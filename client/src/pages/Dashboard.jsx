import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../api/axios';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [stats, setStats] = useState(null);
  const [showIntro, setShowIntro] = useState(Boolean(location.state?.justAuthenticated));
  const [quotePhase, setQuotePhase] = useState(false);
  const [isFirstVisit] = useState(() => {
    const seenBeforeKey = `ksam_has_logged_in_${user?.id}`;
    const seenBefore = localStorage.getItem(seenBeforeKey);
    if (!seenBefore && user?.id) {
      localStorage.setItem(seenBeforeKey, 'true');
    }
    return !seenBefore;
  });
  const [isHovered, setIsHovered] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const introVideoRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then((res) => setStats(res.data.stats))
      .catch(() => setStats(null));

    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  const actionGreeting = isFirstVisit ? 'Glad to see you here,' : 'Welcome back,';

  return (
    <div className="min-h-screen text-zinc-100 flex flex-col font-sans relative overflow-hidden selection:bg-white selection:text-black">

      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none filter brightness-[0.85] contrast-[1.05] scale-105"
        style={{ backgroundImage: `url('/dashboard-bg.jpg')` }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-tr from-black/40 via-black/20 to-black/30 pointer-events-none" />

      {showIntro && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-1000">
          <video
            ref={introVideoRef}
            autoPlay
            muted
            playsInline
            preload="auto"
            onTimeUpdate={(e) => {
              if (e.target.currentTime >= 4.5 && !quotePhase) {
                setQuotePhase(true);
              }
            }}
            onEnded={() => setShowIntro(false)}
            className="absolute inset-0 w-full h-full object-cover filter brightness-90"
          >
            <source src="/welcome-intro.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 pointer-events-none" />

          <div className="relative z-20 max-w-5xl px-6 text-center space-y-8">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span
                className="text-3xl md:text-6xl font-black tracking-tighter text-white animate-drop whitespace-nowrap"
                style={{ fontFamily: "'Syne', sans-serif", animationDelay: '0s' }}
              >
                {actionGreeting}
              </span>
              <span
                className="text-3xl md:text-6xl font-black tracking-tighter text-white animate-drop whitespace-nowrap"
                style={{ fontFamily: "'Syne', sans-serif", animationDelay: '0.15s' }}
              >
                {displayName}
              </span>
            </div>

            {quotePhase && (
              <div className="space-y-4 pt-4 animate-drop">
                <p className="text-zinc-100 text-lg md:text-xl font-normal tracking-wide drop-shadow-md">
                  Do so much volume that it would be unreasonable for you to fail.
                </p>
                <div className="flex items-center justify-center space-x-3 pt-1">
                  <span className="h-px w-8 bg-zinc-400"></span>
                  <span className="text-xs tracking-widest text-zinc-200 font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Alex Hormozi</span>
                  <span className="h-px w-8 bg-zinc-400"></span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowIntro(false)}
            className="absolute bottom-10 right-10 z-50 bg-white/20 hover:bg-white text-zinc-100 hover:text-black border border-white/30 text-xs tracking-widest uppercase px-6 py-3 rounded-full backdrop-blur-xl transition duration-300 cursor-pointer font-bold shadow-2xl"
          >
            Skip Intro
          </button>
        </div>
      )}

      <style>{`
        @keyframes dropIn {
          0% {
            opacity: 0;
            transform: translateY(-40px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-drop {
          animation: dropIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}</style>

      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-40 px-10 py-5 flex items-center justify-between">
        <span
          className="text-white text-xs font-black tracking-[0.3em] uppercase drop-shadow"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          K.SAM CODE SCHOOL
        </span>

        <div className="flex items-center space-x-6 relative" ref={profileMenuRef}>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-full transition cursor-pointer backdrop-blur-md shadow-lg group"
            >
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs font-black">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-zinc-200 font-medium group-hover:text-white">
                {displayName}
              </span>
              <svg className={`w-3 h-3 text-zinc-400 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-72 bg-black/85 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-5 space-y-4 z-50 animate-drop">
                <div className="border-b border-white/10 pb-3 space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Account Profile</span>
                  <h4 className="text-sm font-bold text-white">{displayName}</h4>
                  <p className="text-xs text-zinc-300 truncate">{user?.email}</p>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center text-xs bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                    <span className="text-zinc-400">Coding Streak</span>
                    <span className="font-bold text-white">{stats ? `${stats.currentStreakDays} Days Active` : '...'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                    <span className="text-zinc-400">Reviews Logged</span>
                    <span className="font-bold text-white">{stats ? stats.totalReviewsLogged : '...'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                  <Link to="/settings" onClick={() => setShowProfileMenu(false)} className="text-xs text-zinc-300 hover:text-white underline">
                    Edit Settings
                  </Link>
                  <button
                    onClick={logout}
                    className="bg-white/10 hover:bg-white hover:text-black border border-white/20 text-xs text-zinc-200 transition px-3 py-1.5 rounded-full font-bold cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className="bg-white/15 hover:bg-white hover:text-black border border-white/20 text-xs text-zinc-200 transition tracking-widest uppercase px-4 py-2 rounded-full font-bold cursor-pointer shadow-lg backdrop-blur-md hidden sm:inline-block"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative z-10">

        <aside
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`fixed left-0 top-20 bottom-0 z-30 transition-all duration-500 ease-out bg-black/35 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between p-6 ${
            isHovered ? 'w-72 shadow-2xl shadow-black/50' : 'w-20'
          }`}
        >
          <div className="space-y-8">
            <div className="flex items-center space-x-4 cursor-pointer group">
              <div className="w-9 h-9 rounded-xl border border-white/20 flex items-center justify-center bg-white/10 group-hover:bg-white group-hover:text-black transition duration-300 shadow-md">
                <span className="text-xs font-black">D</span>
              </div>
              {isHovered && (
                <span className="text-xs font-bold tracking-widest uppercase text-white animate-drop">
                  Command Center
                </span>
              )}
            </div>

            <nav className="space-y-6">
              <Link to="/dashboard" className="flex items-center space-x-4 text-white group py-1">
                <span className="text-xs font-mono font-bold text-zinc-400 group-hover:text-white transition shrink-0">01</span>
                {isHovered && <span className="text-xs tracking-wider uppercase font-semibold animate-drop">Overview</span>}
              </Link>
              <Link to="/modules" className="flex items-center space-x-4 text-white group py-1">
                <span className="text-xs font-mono font-bold text-zinc-400 group-hover:text-white transition shrink-0">02</span>
                {isHovered && <span className="text-xs tracking-wider uppercase font-semibold animate-drop">Modules</span>}
              </Link>
              <Link to="/review" className="flex items-center space-x-4 text-white group py-1">
                <span className="text-xs font-mono font-bold text-zinc-400 group-hover:text-white transition shrink-0">03</span>
                {isHovered && <span className="text-xs tracking-wider uppercase font-semibold animate-drop">Review</span>}
              </Link>
            </nav>
          </div>
        </aside>

        <main className={`flex-1 transition-all duration-500 p-10 md:p-16 space-y-16 max-w-7xl mx-auto ${isHovered ? 'ml-72' : 'ml-20'}`}>

          <div className="relative border-b border-white/10 pb-16 space-y-6">
            <div className="space-y-3">
              <span className="inline-block bg-white text-black text-xs font-medium tracking-wider px-2.5 py-1 shadow-md">
                Let's get to Coding
              </span>
              <h1
                className="text-6xl md:text-9xl font-black tracking-tighter text-white select-none drop-shadow-2xl"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {displayName}
              </h1>
            </div>

            <div className="max-w-xl space-y-4">
              <div className="space-y-2 pt-1">
                <div>
                  <span className="inline-block bg-white text-black text-base md:text-lg font-medium tracking-wide px-2 py-1 shadow-md">
                    Do so much volume that it would be unreasonable for you to fail.
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-3">
                <span className="h-px w-8 bg-zinc-400"></span>
                <span className="text-xs tracking-widest text-zinc-200 font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Alex Hormozi</span>
                <span className="h-px w-8 bg-zinc-400"></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="border border-white/15 bg-black/25 backdrop-blur-md p-8 rounded-2xl space-y-3 hover:border-white/40 transition duration-300 shadow-xl">
              <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-300 font-bold block">Modules</span>
              <span className="text-4xl font-black text-white block tracking-tighter drop-shadow" style={{ fontFamily: "'Syne', sans-serif" }}>
                {stats ? stats.totalModules : '—'}
              </span>
              <span className="text-xs text-zinc-300 block">Active learning modules</span>
            </div>
            <div className="border border-white/15 bg-black/25 backdrop-blur-md p-8 rounded-2xl space-y-3 hover:border-white/40 transition duration-300 shadow-xl">
              <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-300 font-bold block">Exercises</span>
              <span className="text-4xl font-black text-white block tracking-tighter drop-shadow" style={{ fontFamily: "'Syne', sans-serif" }}>
                {stats ? stats.totalExercises : '—'}
              </span>
              <span className="text-xs text-zinc-300 block">Across all modules</span>
            </div>
            <div className="border border-white/15 bg-black/25 backdrop-blur-md p-8 rounded-2xl space-y-3 hover:border-white/40 transition duration-300 shadow-xl">
              <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-300 font-bold block">Reviews Logged</span>
              <span className="text-4xl font-black text-white block tracking-tighter drop-shadow" style={{ fontFamily: "'Syne', sans-serif" }}>
                {stats ? stats.totalReviewsLogged : '—'}
              </span>
              <span className="text-xs text-zinc-300 block">Total review sessions</span>
            </div>
            <div className="border border-white/15 bg-black/25 backdrop-blur-md p-8 rounded-2xl space-y-3 hover:border-white/40 transition duration-300 shadow-xl">
              <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-300 font-bold block">Streak</span>
              <span className="text-4xl font-black text-white block tracking-tighter drop-shadow" style={{ fontFamily: "'Syne', sans-serif" }}>
                {stats ? stats.currentStreakDays : '—'}
              </span>
              <span className="text-xs text-zinc-300 block">Consecutive days active</span>
            </div>
          </div>

          <div className="border border-white/20 bg-black/30 backdrop-blur-md p-10 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-300 font-bold">Priority Target</span>
              <h3 className="text-lg font-bold text-white tracking-tight drop-shadow">
                {stats && stats.dueReviewsCount > 0
                  ? `You have ${stats.dueReviewsCount} exercise${stats.dueReviewsCount === 1 ? '' : 's'} due for review`
                  : 'Nothing due for review right now'}
              </h3>
              <p className="text-xs text-zinc-200">
                {stats && stats.dueReviewsCount > 0
                  ? 'Clear your queue to keep your streak going.'
                  : 'Add a module and exercises to start building your review queue.'}
              </p>
            </div>
            <Link
              to={stats && stats.dueReviewsCount > 0 ? '/review' : '/modules'}
              className="bg-white text-black font-semibold px-6 py-3 rounded-full text-sm hover:bg-zinc-200 transition shrink-0"
            >
              {stats && stats.dueReviewsCount > 0 ? 'Start review' : 'Add exercises'}
            </Link>
          </div>

        </main>
      </div>
    </div>
  );
}