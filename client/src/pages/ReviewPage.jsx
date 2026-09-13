import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const QUALITY_OPTIONS = [
  { label: 'Again', value: 0, style: 'bg-red-500/15 border-red-500/30 hover:bg-red-500/25 text-red-300' },
  { label: 'Hard', value: 3, style: 'bg-amber-500/15 border-amber-500/30 hover:bg-amber-500/25 text-amber-300' },
  { label: 'Good', value: 4, style: 'bg-emerald-500/15 border-emerald-500/30 hover:bg-emerald-500/25 text-emerald-300' },
  { label: 'Easy', value: 5, style: 'bg-blue-500/15 border-blue-500/30 hover:bg-blue-500/25 text-blue-300' },
];

export default function ReviewPage() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    api.get('/progress/due')
      .then((res) => setQueue(res.data.dueReviews))
      .catch(() => setQueue([]))
      .finally(() => setLoading(false));
  }, []);

  const currentItem = queue[currentIndex];
  const isDone = !loading && currentIndex >= queue.length;

  const handleRate = async (quality) => {
    if (!currentItem) return;
    setSubmitting(true);

    try {
      await api.post('/progress/review', {
        exerciseId: currentItem.exercise.id,
        quality,
      });
      setCompletedCount((c) => c + 1);
      setShowAnswer(false);
      setCurrentIndex((i) => i + 1);
    } catch {
      setShowAnswer(false);
      setCurrentIndex((i) => i + 1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans flex flex-col">

      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-40 px-10 py-5 flex items-center justify-between">
        <Link to="/dashboard" className="text-white text-xs font-black tracking-[0.3em] uppercase">
          K.SAM CODE SCHOOL
        </Link>
        <Link to="/dashboard" className="text-xs text-zinc-400 hover:text-white transition">
          Exit review
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-10">
        {loading ? (
          <p className="text-sm text-zinc-500">Loading your review queue...</p>
        ) : queue.length === 0 ? (
          <div className="text-center space-y-4 max-w-md">
            <h1 className="text-3xl font-black tracking-tighter" style={{ fontFamily: "'Syne', sans-serif" }}>
              Nothing due right now
            </h1>
            <p className="text-sm text-zinc-400">
              You're all caught up. Come back once your next reviews are scheduled, or add more exercises to your modules.
            </p>
            <Link
              to="/modules"
              className="inline-block bg-white text-black font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-zinc-200 transition mt-2"
            >
              Go to modules
            </Link>
          </div>
        ) : isDone ? (
          <div className="text-center space-y-4 max-w-md">
            <h1 className="text-3xl font-black tracking-tighter" style={{ fontFamily: "'Syne', sans-serif" }}>
              Review complete
            </h1>
            <p className="text-sm text-zinc-400">
              You reviewed {completedCount} exercise{completedCount === 1 ? '' : 's'}. Nice work.
            </p>
            <Link
              to="/dashboard"
              className="inline-block bg-white text-black font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-zinc-200 transition mt-2"
            >
              Back to dashboard
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-xl space-y-8">
            <div className="text-center text-xs text-zinc-500 uppercase tracking-widest">
              {currentIndex + 1} of {queue.length}
            </div>

            <div className="border border-white/15 bg-white/5 rounded-2xl p-10 space-y-6 min-h-[220px] flex flex-col justify-center">
              <p className="text-xl font-medium text-white text-center">
                {currentItem.exercise.questionText}
              </p>

              {showAnswer && (
                <div className="border-t border-white/10 pt-6 text-center">
                  <p className="text-sm text-zinc-400 uppercase tracking-widest mb-2">Answer</p>
                  <p className="text-lg text-zinc-200">{currentItem.exercise.correctAnswer}</p>
                </div>
              )}
            </div>

            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full bg-white text-black font-semibold py-3.5 rounded-full text-sm hover:bg-zinc-200 transition cursor-pointer"
              >
                Show answer
              </button>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {QUALITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleRate(option.value)}
                    disabled={submitting}
                    className={`border rounded-xl py-3 text-sm font-semibold transition cursor-pointer disabled:opacity-50 ${option.style}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}