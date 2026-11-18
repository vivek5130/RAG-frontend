import { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/ToastContainer';
import { IngestPanel } from './components/IngestPanel';
import { ItemsList } from './components/ItemsList';
import { QueryPanel } from './components/QueryPanel';

export default function App() {
  const { toasts, addToast, removeToast } = useToast();

  // Items state
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Ingest state
  const [saving, setSaving] = useState(false);

  // Query state
  const [asking, setAsking] = useState(false);
  const [askError, setAskError] = useState('');
  const [result, setResult] = useState(null);

  const refresh = useCallback(async () => {
    setItemsLoading(true);
    setItemsError('');
    try {
      const data = await api.listItems();
      setItems(data.items);
    } catch (err) {
      setItemsError(err.message);
    } finally {
      setItemsLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function handleSave(mode, value, title) {
    setSaving(true);
    try {
      if (mode === 'note') await api.ingestNote(value, title);
      else await api.ingestUrl(value, title);
      addToast(mode === 'note' ? 'Note saved and indexed!' : 'URL fetched and indexed!');
      await refresh();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await api.deleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      addToast('Item deleted.');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleAsk(question, topK) {
    setAsking(true);
    setAskError('');
    setResult(null);
    try {
      const data = await api.askQuestion(question, topK);
      setResult(data);
    } catch (err) {
      setAskError(err.message);
      addToast(err.message, 'error');
    } finally {
      setAsking(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">AI Knowledge Inbox</p>
            <h1 className="text-xl font-bold text-stone-900 leading-tight">Ask your notes</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {items.length} item{items.length !== 1 ? 's' : ''} saved
            </span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
        {/* Left column: Save + Saved Items */}
        <div className="flex flex-col gap-4">
          {/* Save card */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
            <h2 className="text-sm font-bold text-stone-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">+</span>
              Add to Inbox
            </h2>
            <IngestPanel onSave={handleSave} saving={saving} />
          </div>

          {/* Saved items card */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center text-xs">📚</span>
                Saved Items
              </h2>
              <button
                onClick={refresh}
                disabled={itemsLoading}
                className="text-xs text-stone-400 hover:text-emerald-700 transition-colors disabled:opacity-50"
                title="Refresh"
              >
                ↻ Refresh
              </button>
            </div>
            <ItemsList
              items={items}
              loading={itemsLoading}
              error={itemsError}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          </div>
        </div>

        {/* Right column: Ask */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 lg:sticky lg:top-24">
          <h2 className="text-sm font-bold text-stone-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-xs">✦</span>
            Ask a Question
          </h2>
          <QueryPanel
            onAsk={handleAsk}
            asking={asking}
            result={result}
            error={askError}
          />
        </div>
      </main>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
