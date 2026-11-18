function formatDate(value) {
  if (!value) return '';
  const date = new Date(value.includes('T') ? value : `${value.replace(' ', 'T')}Z`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ItemsList({ items, loading, error, onDelete, deletingId }) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-xl border border-stone-100 p-4 bg-stone-50">
            <div className="h-3 bg-stone-200 rounded w-1/3 mb-2" />
            <div className="h-4 bg-stone-200 rounded w-2/3 mb-1" />
            <div className="h-3 bg-stone-200 rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
        {error}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mt-6 text-center py-10">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-stone-400 text-sm">Nothing saved yet. Add a note or URL above.</p>
      </div>
    );
  }

  return (
    <ul className="mt-4 flex flex-col gap-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="group relative rounded-xl border border-stone-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-stone-300 transition-all"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                  item.source_type === 'url'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {item.source_type === 'url' ? '🔗 URL' : '📝 Note'}
              </span>
              <time className="text-xs text-stone-400 shrink-0">{formatDate(item.created_at)}</time>
            </div>
            <button
              onClick={() => onDelete(item.id)}
              disabled={deletingId === item.id}
              aria-label="Delete item"
              className="shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
            >
              {deletingId === item.id ? (
                <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              )}
            </button>
          </div>

          <h3 className="mt-2 text-sm font-semibold text-stone-800 leading-tight">
            {item.title || 'Untitled'}
          </h3>

          {item.source_url && (
            <a
              href={item.source_url}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block text-xs text-emerald-700 hover:underline truncate"
            >
              {item.source_url}
            </a>
          )}

          <p className="mt-1.5 text-xs text-stone-500 leading-relaxed line-clamp-3">
            {item.content}
          </p>
        </li>
      ))}
    </ul>
  );
}
