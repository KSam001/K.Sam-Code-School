import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../api/axios';

export default function ModulesPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reloadModules = () => {
    api.get('/modules')
      .then((res) => setModules(res.data.modules))
      .catch(() => setError('Could not load modules.'));
  };

  useEffect(() => {
    api.get('/modules')
      .then((res) => setModules(res.data.modules))
      .catch(() => setError('Could not load modules.'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      await api.post('/modules', { title, description });
      setTitle('');
      setDescription('');
      setShowForm(false);
      reloadModules();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create module.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, moduleTitle) => {
    if (!window.confirm(`Delete "${moduleTitle}" and all its exercises? This cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/modules/${id}`);
      reloadModules();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete module.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans">

      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-40 px-10 py-5 flex items-center justify-between">
        <Link to="/dashboard" className="text-white text-xs font-black tracking-[0.3em] uppercase">
          K.SAM CODE SCHOOL
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-xs text-zinc-400 hover:text-white transition">
            Dashboard
          </Link>
          <Link to="/review" className="text-xs text-zinc-400 hover:text-white transition">
            Review
          </Link>
          <button
            onClick={logout}
            className="bg-white/15 hover:bg-white hover:text-black border border-white/20 text-xs text-zinc-200 transition uppercase px-4 py-2 rounded-full font-bold cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-10 py-16 space-y-10">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tighter" style={{ fontFamily: "'Syne', sans-serif" }}>
              Modules
            </h1>
            <p className="text-sm text-zinc-400 mt-2">Organize what you're learning into modules, then add exercises to each.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-black font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-zinc-200 transition cursor-pointer"
          >
            {showForm ? 'Cancel' : 'New module'}
          </button>
        </div>

        {error && (
          <div className="bg-zinc-900 border border-zinc-800 text-zinc-300 p-3.5 rounded-xl text-sm">
            {error}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleCreate} className="border border-white/15 bg-white/5 rounded-2xl p-6 space-y-4">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Module title, e.g. Async JavaScript"
              className="w-full bg-black/40 border border-white/10 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-white transition"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
              className="w-full bg-black/40 border border-white/10 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-white transition resize-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-white text-black font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-zinc-200 transition cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create module'}
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-sm text-zinc-500">Loading modules...</p>
        ) : modules.length === 0 ? (
          <div className="border border-white/10 rounded-2xl p-12 text-center space-y-2">
            <p className="text-zinc-300 font-medium">No modules yet</p>
            <p className="text-sm text-zinc-500">Create your first module to start adding exercises.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {modules.map((module) => (
              <div
                key={module.id}
                className="border border-white/15 bg-white/5 rounded-2xl p-6 space-y-3 hover:border-white/30 transition"
              >
                <div className="flex items-start justify-between">
                  <button
                    onClick={() => navigate(`/modules/${module.id}`)}
                    className="text-left cursor-pointer"
                  >
                    <h3 className="font-bold text-lg text-white hover:underline">{module.title}</h3>
                  </button>
                  <button
                    onClick={() => handleDelete(module.id, module.title)}
                    className="text-xs text-zinc-500 hover:text-red-400 transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
                {module.description && (
                  <p className="text-sm text-zinc-400">{module.description}</p>
                )}
                <p className="text-xs text-zinc-500">
                  {module._count?.exercises || 0} exercise{module._count?.exercises === 1 ? '' : 's'}
                </p>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}