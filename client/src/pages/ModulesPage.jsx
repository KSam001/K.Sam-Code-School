import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';

export default function ModulesPage() {
  const navigate = useNavigate();

  const [curriculum, setCurriculum] = useState([]);
  const [curriculumLoading, setCurriculumLoading] = useState(true);

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
    api.get('/modules/curriculum')
      .then((res) => setCurriculum(res.data.modules))
      .catch(() => setCurriculum([]))
      .finally(() => setCurriculumLoading(false));

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
    if (!window.confirm(`Delete "${moduleTitle}" and all its exercises? This cannot be undone.`)) return;

    try {
      await api.delete(`/modules/${id}`);
      reloadModules();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete module.');
    }
  };

  return (
    <Layout>
      <div className="space-y-8">

        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-ink mb-1">Curriculum</h1>
          <p className="text-sm text-steel mb-3">Structured lessons, free for every account.</p>

          {curriculumLoading ? (
            <div className="h-20 bg-white rounded-card shadow-soft animate-pulse" />
          ) : curriculum.length === 0 ? (
            <div className="bg-white rounded-card p-5 shadow-soft text-sm text-steel">
              No curriculum modules published yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {curriculum.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => navigate(`/modules/${mod.id}`)}
                  className="text-left bg-white rounded-card p-4 shadow-soft hover:shadow-card transition"
                >
                  <h3 className="font-medium text-ink mb-1">{mod.title}</h3>
                  {mod.description && (
                    <p className="text-xs text-steel line-clamp-2">{mod.description}</p>
                  )}
                  <p className="text-[11px] text-silver mt-2">
                    {mod._count?.exercises || 0} exercise{mod._count?.exercises === 1 ? '' : 's'}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-ink">Your modules</h2>
              <p className="text-sm text-steel">Your own personal study modules.</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-ink text-white font-medium px-4 py-2 rounded-pill text-sm"
            >
              {showForm ? 'Cancel' : 'New module'}
            </button>
          </div>

          {error && (
            <div className="bg-ashmist text-graphite p-3 rounded-lg text-sm mb-3">{error}</div>
          )}

          {showForm && (
            <form onSubmit={handleCreate} className="bg-white rounded-card p-5 shadow-soft space-y-3 mb-3">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Module title"
                className="w-full bg-ashmist border border-softfog text-ink placeholder-silver rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="w-full bg-ashmist border border-softfog text-ink placeholder-silver rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ink resize-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-ink text-white font-medium px-4 py-2 rounded-pill text-sm disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create module'}
              </button>
            </form>
          )}

          {loading ? (
            <div className="h-20 bg-white rounded-card shadow-soft animate-pulse" />
          ) : modules.length === 0 ? (
            <div className="bg-white rounded-card p-6 shadow-soft text-center">
              <p className="text-ink font-medium">No modules yet</p>
              <p className="text-sm text-steel mt-1">Create your first module to start adding exercises.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {modules.map((mod) => (
                <div key={mod.id} className="bg-white rounded-card p-4 shadow-soft">
                  <div className="flex items-start justify-between mb-1">
                    <button onClick={() => navigate(`/modules/${mod.id}`)} className="text-left">
                      <h3 className="font-medium text-ink hover:underline">{mod.title}</h3>
                    </button>
                    <button
                      onClick={() => handleDelete(mod.id, mod.title)}
                      className="text-xs text-silver hover:text-alert transition"
                    >
                      Delete
                    </button>
                  </div>
                  {mod.description && <p className="text-xs text-steel">{mod.description}</p>}
                  <p className="text-[11px] text-silver mt-2">
                    {mod._count?.exercises || 0} exercise{mod._count?.exercises === 1 ? '' : 's'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
