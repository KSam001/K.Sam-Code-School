import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then((res) => setStats(res.data.stats))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const displayName = user?.name || user?.email?.split('@')[0] || 'there';
  const dueCount = stats?.dueReviewsCount || 0;

  return (
    <div className="min-h-screen bg-canvas dark:bg-canvas-dark">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 pb-16 pt-4">
        <div className="border border-ash dark:border-graphite rounded-card p-5 mb-4">
          <p className="text-[11px] uppercase tracking-wide text-fog mb-1">Welcome back</p>
          {loading ? (
            <div className="h-7 w-32 bg-ash dark:bg-graphite rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-medium text-graphite dark:text-graphite-dark">{displayName}</p>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Modules', value: stats?.totalModules },
            { label: 'Exercises', value: stats?.totalExercises },
            { label: 'Reviewed', value: stats?.totalReviewsLogged },
            { label: 'Streak', value: stats?.currentStreakDays, emphasis: true },
          ].map((card) => (
            <div
              key={card.label}
              className={`border rounded-card p-3 ${
                card.emphasis
                  ? 'border-smoke dark:border-slate'
                  : 'border-ash dark:border-graphite'
              }`}
            >
              <p className={`text-[11px] mb-1.5 ${card.emphasis ? 'text-steel dark:text-steel-dark' : 'text-fog'}`}>
                {card.label}
              </p>
              {loading ? (
                <div className="h-5 w-8 bg-ash dark:bg-graphite rounded animate-pulse" />
              ) : (
                <p className="text-xl font-medium text-graphite dark:text-graphite-dark">{card.value ?? 0}</p>
              )}
            </div>
          ))}
        </div>

        <div className="border border-ash dark:border-graphite rounded-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-graphite dark:text-graphite-dark">
              {loading
                ? 'Checking your queue...'
                : dueCount > 0
                ? `${dueCount} exercise${dueCount === 1 ? '' : 's'} due for review`
                : 'Nothing due right now'}
            </p>
            <p className="text-xs text-fog mt-0.5">
              {dueCount > 0 ? 'Keep your streak going.' : 'Add exercises to build your queue.'}
            </p>
          </div>
          <Link
            to={dueCount > 0 ? '/review' : '/modules'}
            className="bg-charcoal dark:bg-charcoal-dark text-white dark:text-canvas-dark rounded-lg px-4 py-2 text-xs font-medium text-center"
          >
            {dueCount > 0 ? 'Start review' : 'Add exercises'}
          </Link>
        </div>
      </main>
    </div>
  );
}
