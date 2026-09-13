import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal, LogOut, BookOpen, Flame, BarChart3, Layers } from 'lucide-react';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-[#0C0D12]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-lg text-emerald-400">
              <Terminal size={20} />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white uppercase block leading-none">
                K.Sam Code School
              </span>
              <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                Spaced Repetition Engine
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-md border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-md hover:bg-red-500/10"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}