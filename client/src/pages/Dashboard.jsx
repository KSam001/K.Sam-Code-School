import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAuth } from '../context/useAuth';
import api from '../api/axios';
import Layout from '../components/Layout';

ChartJS.register(CategoryScale, LinearScale, BarElement);

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

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, stats?.totalReviewsLogged ? 1 : 0],
        backgroundColor: '#dcfce7',
        borderRadius: 4,
        maxBarThickness: 18,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#a3a3a3' } },
      y: { display: false },
    },
  };

  return (
    <Layout>
      <p className="text-lg font-semibold text-ink mb-3">
        {loading ? 'Loading...' : `Good to see you, ${displayName}`}
      </p>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-ink rounded-card p-3">
          <p className="text-[11px] text-silver mb-1">XP total</p>
          <p className="text-lg font-semibold text-resolve">{loading ? '—' : (stats?.totalReviewsLogged || 0) * 10}</p>
        </div>
        <div className="bg-white border border-softfog rounded-card p-3">
          <p className="text-[11px] text-steel mb-1">Streak</p>
          <p className="text-lg font-semibold text-ink">{loading ? '—' : `${stats?.currentStreakDays || 0} days`}</p>
        </div>
        <div className="bg-white border border-softfog rounded-card p-3">
          <p className="text-[11px] text-steel mb-1">Modules</p>
          <p className="text-lg font-semibold text-ink">{loading ? '—' : stats?.totalModules || 0}</p>
        </div>
      </div>

      <div className="bg-white border border-softfog rounded-card p-3.5 mb-3">
        <p className="text-xs font-medium text-graphite mb-2.5">Reviews this week</p>
        <div className="h-24">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white border border-softfog rounded-card overflow-hidden">
        <div className="flex items-center justify-between px-3.5 py-3">
          <span className="text-sm font-medium text-ink">
            {loading ? 'Checking your queue...' : dueCount > 0 ? `${dueCount} due for review` : 'Nothing due right now'}
          </span>
          <Link
            to={dueCount > 0 ? '/review' : '/modules'}
            className={`text-[11px] px-2.5 py-1 rounded-pill font-medium ${
              dueCount > 0 ? 'text-resolvetext bg-resolvebg' : 'text-graphite bg-ashmist'
            }`}
          >
            {dueCount > 0 ? 'Start review' : 'Add exercises'}
          </Link>
        </div>
      </div>
    </Layout>
  );
}
