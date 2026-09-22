import React from 'react';
import { useAuth } from '../context/useAuth';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const initial = (user?.name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-canvas flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 px-5 py-3.5">
          <div className="flex-1 max-w-xs bg-white border border-softfog rounded-pill px-3.5 py-1.5 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-silver" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" strokeLinecap="round" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <span className="text-xs text-silver">Search modules</span>
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-[18px] h-[18px] text-graphite" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <button
              onClick={logout}
              className="w-7 h-7 rounded-pill bg-resolve text-white text-xs font-semibold flex items-center justify-center"
              title="Sign out"
            >
              {initial}
            </button>
          </div>
        </div>
        <main className="px-5 pb-10">{children}</main>
      </div>
    </div>
  );
}
