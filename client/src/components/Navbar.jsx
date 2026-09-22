import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/useTheme';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/modules', label: 'Modules' },
  { to: '/review', label: 'Review' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const initial = (user?.name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="sticky top-0 z-40 bg-canvas dark:bg-canvas-dark pt-4 pb-2 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between bg-ink dark:bg-paper-dark rounded-full pl-4 pr-2 py-2">
          <div className="flex items-center gap-3">
            <span className="text-white text-sm font-medium">K.Sam</span>
            <div className="w-px h-3.5 bg-slate" />
            <nav className="hidden sm:flex items-center gap-3">
              {LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm transition ${
                    location.pathname === link.to ? 'text-smoke' : 'text-fog hover:text-smoke'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-7 h-7 rounded-full bg-charcoal flex items-center justify-center text-fog hover:text-smoke transition"
            >
              {theme === 'dark' ? (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 9a1 1 0 100 2h1a1 1 0 100-2h-1zm-7 7a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 5.05a1 1 0 011.414 0l.707.707A1 1 0 105.757 7.17l-.707-.707a1 1 0 010-1.414zm1.414 8.9a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM4 9a1 1 0 100 2H3a1 1 0 100-2h1z" /></svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-7 h-7 rounded-full bg-slate text-white text-xs font-medium flex items-center justify-center"
            >
              {initial}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mt-2 bg-paper dark:bg-charcoal border border-ash dark:border-graphite rounded-2xl p-5">
            <p className="text-[11px] uppercase tracking-wide text-fog mb-2.5">Menu</p>
            <div className="flex sm:hidden flex-col gap-3 mb-4">
              {LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="text-lg font-medium text-charcoal dark:text-charcoal-dark"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="h-px bg-ash dark:bg-graphite my-4" />
            <p className="text-[11px] uppercase tracking-wide text-fog mb-2.5">Account</p>
            <div className="flex flex-col gap-2.5">
              <p className="text-sm text-graphite dark:text-graphite-dark truncate">{user?.email}</p>
              <button
                onClick={logout}
                className="text-left text-sm font-medium text-graphite dark:text-graphite-dark hover:text-charcoal dark:hover:text-charcoal-dark"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
