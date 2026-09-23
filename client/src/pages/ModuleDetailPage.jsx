import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';

export default function ModuleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadModule = () => {
    setLoading(true);
    api.get(`/modules/${id}`)
      .then((res) => setModuleData(res.data.module))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadModule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    if (!questionText.trim() || !correctAnswer.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      await api.post('/exercises', { moduleId: id, questionText, correctAnswer });
      setQuestionText('');
      setCorrectAnswer('');
      setShowForm(false);
      loadModule();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create exercise.');
    } finally {
      setSubmitting(false);
    }
  };

  if (notFound) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <p className="text-steel">Module not found.</p>
          <button
            onClick={() => navigate('/modules')}
            className="text-sm text-ink font-medium underline underline-offset-4"
          >
            Back to modules
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {loading ? (
        <div className="h-20 bg-white rounded-card shadow-soft animate-pulse" />
      ) : (
        <div className="space-y-6">
          <div>
            <button
              onClick={() => navigate('/modules')}
              className="text-xs text-steel hover:text-ink transition"
            >
              ← Back to modules
            </button>
            <h1 className="text-[22px] font-semibold tracking-tight text-ink mt-2">
              {moduleData.title}
            </h1>
            {moduleData.description && (
              <p className="text-sm text-steel mt-1">{moduleData.description}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              Exercises ({moduleData.exercises.length})
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-ink text-white font-medium px-4 py-2 rounded-pill text-sm hover:bg-graphite transition"
            >
              {showForm ? 'Cancel' : 'Add exercise'}
            </button>
          </div>

          {error && (
            <div className="bg-ashmist text-graphite p-3 rounded-lg text-sm">{error}</div>
          )}

          {showForm && (
            <form onSubmit={handleCreateExercise} className="bg-white border border-softfog rounded-card p-5 shadow-soft space-y-3">
              <textarea
                required
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Question"
                rows={2}
                className="w-full bg-ashmist border border-softfog text-ink placeholder-silver rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ink transition resize-none"
              />
              <textarea
                required
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="Correct answer"
                rows={2}
                className="w-full bg-ashmist border border-softfog text-ink placeholder-silver rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ink transition resize-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-ink text-white font-medium px-4 py-2 rounded-pill text-sm hover:bg-graphite transition disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add exercise'}
              </button>
            </form>
          )}

          {moduleData.exercises.length === 0 ? (
            <div className="bg-white border border-softfog rounded-card p-10 text-center space-y-1.5">
              <p className="text-ink font-medium">No exercises yet</p>
              <p className="text-sm text-steel">Add your first exercise to start reviewing this module.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {moduleData.exercises.map((exercise) => (
                <div key={exercise.id} className="bg-white border border-softfog rounded-card p-4 space-y-1.5 shadow-soft">
                  <p className="text-sm font-medium text-ink">{exercise.questionText}</p>
                  <p className="text-sm text-steel">{exercise.correctAnswer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
