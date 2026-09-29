import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

interface RefinementInputProps {
  onRefine: (text: string) => void;
  loading: boolean;
}

export const RefinementInput: React.FC<RefinementInputProps> = ({
  onRefine,
  loading
}) => {
  const [refinementText, setRefinementText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (refinementText.trim() && !loading) {
      onRefine(refinementText.trim());
      setRefinementText('');
    }
  };

  return (
    <div className="card" style={{ padding: '1.25rem', marginTop: '2rem', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
      <form onSubmit={handleSubmit}>
        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <MessageSquare size={16} style={{ color: 'var(--accent-blue)' }} />
          <span>Conversational Search Refinement</span>
        </label>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Didn't find the target photo? Add more remembered clues to narrow down the search (e.g. "The one near the beach around sunset").
        </p>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="input"
            value={refinementText}
            onChange={(e) => setRefinementText(e.target.value)}
            placeholder="Tell me more details about the photo memory..."
            style={{ flex: 1 }}
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !refinementText.trim()}
          >
            <Send size={14} />
            <span>Refine Search</span>
          </button>
        </div>
      </form>
    </div>
  );
};
