import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/modules', label: 'Modules' },
  { to: '/review', label: 'Review' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const initial = (user?.name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="sticky top-0 z-40 bg-canvas pt-4 pb-2 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between bg-ink rounded-pill pl-4.5 pr-2 py-2 shadow-card">
          <div className="flex items-center gap-3.5">
            <span className="text-white text-sm font-medium">K.Sam</span>
            <nav className="hidden sm:flex items-center gap-3.5">
              {LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition ${
                    location.pathname === link.to ? 'text-white' : 'text-silver hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 rounded-pill bg-resolve text-ink text-xs font-semibold flex items-center justify-center"
          >
            {initial}
          </button>
        </div>

        {menuOpen && (
          <div className="mt-2 bg-white border border-softfog rounded-card p-5 shadow-card">
            <div className="flex sm:hidden flex-col gap-3 mb-4">
              {LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="text-lg font-medium text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="text-sm text-graphite mb-3 truncate">{user?.email}</p>
            <button
              onClick={logout}
              className="text-sm font-medium text-ink hover:text-graphite"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
