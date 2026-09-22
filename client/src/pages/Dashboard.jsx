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
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 pb-16 pt-2">
        <div className="bg-white rounded-card p-5 mb-3 shadow-soft">
          <p className="text-[11px] tracking-wide text-silver mb-1.5">WELCOME BACK</p>
          {loading ? (
            <div className="h-8 w-32 bg-softfog rounded animate-pulse" />
          ) : (
            <p className="text-[29px] font-semibold tracking-tight text-ink">{displayName}</p>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
          {[
            { label: 'Modules', value: stats?.totalModules },
            { label: 'Exercises', value: stats?.totalExercises },
            { label: 'Reviewed', value: stats?.totalReviewsLogged },
            { label: 'Streak', value: stats?.currentStreakDays },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-card p-3.5 shadow-soft">
              <p className="text-xs text-steel mb-1.5">{card.label}</p>
              {loading ? (
                <div className="h-5 w-8 bg-softfog rounded animate-pulse" />
              ) : (
                <p className="text-xl font-semibold text-ink">{card.value ?? 0}</p>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-card p-4.5 sm:p-5.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-card">
          <div>
            <p className="text-[15px] font-medium text-ink">
              {loading
                ? 'Checking your queue...'
                : dueCount > 0
                ? `${dueCount} exercise${dueCount === 1 ? '' : 's'} due for review`
                : 'Nothing due right now'}
            </p>
            <p className="text-[13px] text-steel mt-0.5">
              {dueCount > 0 ? 'Keep your streak going.' : 'Add exercises to build your queue.'}
            </p>
          </div>
          <Link
            to={dueCount > 0 ? '/review' : '/modules'}
            className="bg-resolve text-ink rounded-pill px-5 py-2.5 text-sm font-medium text-center"
          >
            {dueCount > 0 ? 'Start review' : 'Add exercises'}
          </Link>
        </div>
      </main>
    </div>
  );
}
