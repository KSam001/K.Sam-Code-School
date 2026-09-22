import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z' },
  { to: '/modules', label: 'Modules', icon: 'M4 4h16v4H4V4zm0 6h16v4H4v-4zm0 6h10v4H4v-4z' },
  { to: '/review', label: 'Review', icon: 'M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0115-6M20 15a9 9 0 01-15 6' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-44 bg-white border-r border-softfog px-3.5 py-5 flex-shrink-0 hidden sm:block">
      <div className="flex items-center gap-2 mb-6 px-1.5">
        <div className="w-6 h-6 rounded-lg bg-ink flex items-center justify-center">
          <span className="text-white text-xs font-semibold">K</span>
        </div>
        <span className="text-sm font-semibold text-ink">K.Sam</span>
      </div>

      <nav className="flex flex-col gap-0.5">
        {LINKS.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition ${
                active ? 'bg-resolvebg text-resolvetext font-medium' : 'text-graphite hover:bg-ashmist'
              }`}
            >
              <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d={link.icon} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
