import { useState } from 'react';

export function IngestPanel({ onSave, saving }) {
  const [mode, setMode] = useState('note');
  const [draft, setDraft] = useState('');
  const [title, setTitle] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const value = draft.trim();
    if (!value) return;
    await onSave(mode, value, title.trim() || undefined);
    setDraft('');
    setTitle('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Mode toggle */}
      <div className="flex gap-1 p-1 bg-stone-100 rounded-lg" role="tablist" aria-label="Content type">
        {['note', 'url'].map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => { setMode(m); setDraft(''); }}
            className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
              mode === m
                ? 'bg-white shadow text-stone-900'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {m === 'note' ? '📝 Note' : '🔗 URL'}
          </button>
        ))}
      </div>

      {/* Optional title */}
      <div>
        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
          Title <span className="font-normal normal-case">(optional)</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give it a name…"
          maxLength={200}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
        />
      </div>

      {/* Content / URL */}
      <div>
        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
          {mode === 'note' ? 'Content' : 'Page URL'}
        </label>
        {mode === 'note' ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Paste or type a note…"
            rows={5}
            maxLength={20000}
            required
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        ) : (
          <input
            type="url"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="https://example.com/article"
            required
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={saving || !draft.trim()}
        className="flex items-center justify-center gap-2 py-2.5 px-5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
      >
        {saving ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving…
          </>
        ) : (
          <>
            <span>+</span> Save {mode === 'note' ? 'Note' : 'URL'}
          </>
        )}
      </button>
    </form>
  );
}
