import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

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
      <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center space-y-4">
        <p className="text-zinc-300">Module not found.</p>
        <button
          onClick={() => navigate('/modules')}
          className="text-sm text-white underline underline-offset-4"
        >
          Back to modules
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans">

      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-40 px-10 py-5 flex items-center justify-between">
        <Link to="/dashboard" className="text-white text-xs font-black tracking-[0.3em] uppercase">
          K.SAM CODE SCHOOL
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/modules" className="text-xs text-zinc-400 hover:text-white transition">
            Modules
          </Link>
          <Link to="/review" className="text-xs text-zinc-400 hover:text-white transition">
            Review
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-10 py-16 space-y-10">

        {loading ? (
          <p className="text-sm text-zinc-500">Loading...</p>
        ) : (
          <>
            <div>
              <Link to="/modules" className="text-xs text-zinc-500 hover:text-white transition">
                ← Back to modules
              </Link>
              <h1 className="text-4xl font-black tracking-tighter mt-3" style={{ fontFamily: "'Syne', sans-serif" }}>
                {moduleData.title}
              </h1>
              {moduleData.description && (
                <p className="text-sm text-zinc-400 mt-2">{moduleData.description}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                Exercises ({moduleData.exercises.length})
              </h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-white text-black font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-zinc-200 transition cursor-pointer"
              >
                {showForm ? 'Cancel' : 'Add exercise'}
              </button>
            </div>

            {error && (
              <div className="bg-zinc-900 border border-zinc-800 text-zinc-300 p-3.5 rounded-xl text-sm">
                {error}
              </div>
            )}

            {showForm && (
              <form onSubmit={handleCreateExercise} className="border border-white/15 bg-white/5 rounded-2xl p-6 space-y-4">
                <textarea
                  required
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Question"
                  rows={2}
                  className="w-full bg-black/40 border border-white/10 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-white transition resize-none"
                />
                <textarea
                  required
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  placeholder="Correct answer"
                  rows={2}
                  className="w-full bg-black/40 border border-white/10 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-white transition resize-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-white text-black font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-zinc-200 transition cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add exercise'}
                </button>
              </form>
            )}

            {moduleData.exercises.length === 0 ? (
              <div className="border border-white/10 rounded-2xl p-12 text-center space-y-2">
                <p className="text-zinc-300 font-medium">No exercises yet</p>
                <p className="text-sm text-zinc-500">Add your first exercise to start reviewing this module.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {moduleData.exercises.map((exercise) => (
                  <div key={exercise.id} className="border border-white/10 rounded-xl p-5 space-y-2">
                    <p className="text-sm font-medium text-white">{exercise.questionText}</p>
                    <p className="text-sm text-zinc-500">{exercise.correctAnswer}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}