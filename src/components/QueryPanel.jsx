import { useState } from 'react';

function ScoreBadge({ score }) {
  const pct = Math.round(score * 100);
  const color = pct > 70 ? 'bg-emerald-100 text-emerald-800' : pct > 40 ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600';
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color}`}>
      {pct}% match
    </span>
  );
}

export function QueryPanel({ onAsk, asking, result, error }) {
  const [question, setQuestion] = useState('');
  const [topK, setTopK] = useState(5);

  async function handleSubmit(e) {
    e.preventDefault();
    const value = question.trim();
    if (!value) return;
    await onAsk(value, topK);
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
            Your Question
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What did I save about…?"
            rows={3}
            maxLength={1000}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-xs text-stone-500">
            <span>Top</span>
            <select
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="border border-stone-200 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {[3, 5, 10].map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
            <span>sources</span>
          </label>

          <button
            type="submit"
            disabled={asking || !question.trim()}
            className="flex items-center gap-2 py-2 px-5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
          >
            {asking ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Thinking…
              </>
            ) : (
              <>✦ Ask</>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-2 flex flex-col gap-4">
          {/* Answer */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-emerald-700 text-sm font-bold">✦ Answer</span>
            </div>
            <p className="text-stone-800 text-sm leading-relaxed whitespace-pre-wrap">{result.answer}</p>
          </div>

          {/* Sources */}
          {result.sources.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                Sources ({result.sources.length})
              </h3>
              <ol className="flex flex-col gap-2">
                {result.sources.map((src, i) => (
                  <li key={src.chunk_id} className="rounded-xl border border-stone-200 bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-stone-800 text-white text-[10px] font-bold">
                          {i + 1}
                        </span>
                        <span className="text-xs font-semibold text-stone-700 truncate">
                          {src.title || `Item ${src.item_id}`}
                        </span>
                      </div>
                      <ScoreBadge score={src.score} />
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed line-clamp-4 pl-7">
                      {src.text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {!result && !error && (
        <div className="text-center py-8 text-stone-400 text-sm">
          <p className="text-3xl mb-2">🔍</p>
          <p>Answers are grounded in your saved notes.</p>
          <p className="text-xs mt-1">Sources show which passages were retrieved.</p>
        </div>
      )}
    </div>
  );
}
