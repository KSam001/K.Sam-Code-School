import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const QUALITY_OPTIONS = [
  { label: 'Again', value: 0, style: 'bg-red-50 border-red-200 hover:bg-red-100 text-alert' },
  { label: 'Hard', value: 3, style: 'bg-warnbg border-amber-200 hover:bg-amber-100 text-warntext' },
  { label: 'Good', value: 4, style: 'bg-resolvebg border-green-200 hover:bg-green-100 text-resolvetext' },
  { label: 'Easy', value: 5, style: 'bg-focusbg border-blue-200 hover:bg-blue-100 text-focustext' },
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
    <div className="min-h-screen bg-canvas flex flex-col">

      <header className="border-b border-softfog bg-canvas sticky top-0 z-40 px-5 py-3.5 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-ink flex items-center justify-center">
            <span className="text-white text-xs font-semibold">K</span>
          </div>
          <span className="text-sm font-semibold text-ink">K.Sam Code School</span>
        </Link>
        <Link to="/dashboard" className="text-xs text-steel hover:text-ink transition">
          Exit review
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        {loading ? (
          <p className="text-sm text-steel">Loading your review queue...</p>
        ) : queue.length === 0 ? (
          <div className="text-center space-y-3 max-w-md">
            <h1 className="text-[22px] font-semibold tracking-tight text-ink">
              Nothing due right now
            </h1>
            <p className="text-sm text-steel">
              You're all caught up. Come back once your next reviews are scheduled, or add more exercises to your modules.
            </p>
            <Link
              to="/modules"
              className="inline-block bg-ink text-white font-medium px-5 py-2.5 rounded-pill text-sm hover:bg-graphite transition mt-2"
            >
              Go to modules
            </Link>
          </div>
        ) : isDone ? (
          <div className="text-center space-y-3 max-w-md">
            <h1 className="text-[22px] font-semibold tracking-tight text-ink">
              Review complete
            </h1>
            <p className="text-sm text-steel">
              You reviewed {completedCount} exercise{completedCount === 1 ? '' : 's'}. Nice work.
            </p>
            <Link
              to="/dashboard"
              className="inline-block bg-ink text-white font-medium px-5 py-2.5 rounded-pill text-sm hover:bg-graphite transition mt-2"
            >
              Back to dashboard
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-xl space-y-6">
            <div className="text-center text-xs text-silver uppercase tracking-widest">
              {currentIndex + 1} of {queue.length}
            </div>

            <div className="bg-white border border-softfog shadow-card rounded-card p-8 space-y-5 min-h-[200px] flex flex-col justify-center">
              <p className="text-lg font-medium text-ink text-center">
                {currentItem.exercise.questionText}
              </p>

              {showAnswer && (
                <div className="border-t border-softfog pt-5 text-center">
                  <p className="text-xs text-silver uppercase tracking-widest mb-1.5">Answer</p>
                  <p className="text-base text-graphite">{currentItem.exercise.correctAnswer}</p>
                </div>
              )}
            </div>

            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full bg-ink text-white font-medium py-3.5 rounded-pill text-sm hover:bg-graphite transition"
              >
                Show answer
              </button>
            ) : (
              <div className="grid grid-cols-4 gap-2.5">
                {QUALITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleRate(option.value)}
                    disabled={submitting}
                    className={`border rounded-card py-3 text-sm font-medium transition disabled:opacity-50 ${option.style}`}
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
