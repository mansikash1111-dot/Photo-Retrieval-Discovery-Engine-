import React from 'react';
import { Search, Sparkles } from 'lucide-react';

interface SearchInputProps {
  query: string;
  setQuery: (q: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  query,
  setQuery,
  onSearch,
  loading
}) => {
  const examplePrompts = [
    "Find the photo from my Goa trip where we were sitting at a small cafe near the beach.",
    "Find the picture of my dog near the lake during sunset.",
    "Find the birthday photo with balloons and cake.",
    "Find the medicine photo I took when I was sick last year.",
    "Find the rainy photo from my mountain trek trip in Manali."
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch();
    }
  };

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
      <form onSubmit={handleSubmit}>
        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <Sparkles size={16} style={{ color: 'var(--accent-cyan)' }} />
          <span>Describe what you remember about the photo</span>
        </label>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <textarea
              className="input"
              rows={2}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Find the photo from my Goa trip where we were sitting at a small cafe near the beach..."
              style={{ width: '100%', paddingLeft: '2.5rem', resize: 'none', lineHeight: '1.4' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '1rem', color: 'var(--text-dim)' }} />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !query.trim()}
            style={{ padding: '0 1.5rem', whiteSpace: 'nowrap' }}
          >
            {loading ? 'Searching...' : 'Search Memory'}
          </button>
        </div>

        {/* Clickable Prompt Examples */}
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
            Try an example memory search prompt:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {examplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="badge"
                onClick={() => {
                  setQuery(prompt);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 500
                }}
              >
                "{prompt.length > 55 ? prompt.substring(0, 55) + '...' : prompt}"
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
