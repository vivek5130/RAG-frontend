const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Cannot reach the API. Make sure the backend is running on port 8000.');
  }

  if (response.status === 204) return null;

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.error?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }
  return body;
}

export const api = {
  listItems: () => request('/items'),
  ingestNote: (content, title) =>
    request('/ingest', { method: 'POST', body: JSON.stringify({ source_type: 'note', content, title }) }),
  ingestUrl: (url, title) =>
    request('/ingest', { method: 'POST', body: JSON.stringify({ source_type: 'url', url, title }) }),
  askQuestion: (question, top_k = 5) =>
    request('/query', { method: 'POST', body: JSON.stringify({ question, top_k }) }),
  deleteItem: (id) => request(`/items/${id}`, { method: 'DELETE' }),
};
