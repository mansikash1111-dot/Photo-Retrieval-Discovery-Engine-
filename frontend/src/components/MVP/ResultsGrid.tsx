import React from 'react';
import { PhotoResultCard, CandidateResult } from './PhotoResultCard';

interface ResultsGridProps {
  candidates: CandidateResult[];
  onConfirm: (photoId: string) => void;
  onRefine: () => void;
  loading?: boolean;
  query?: string;
  hasSearched?: boolean;
  onSelectTopic?: (topic: string) => void;
}

export const ResultsGrid: React.FC<ResultsGridProps> = ({
  candidates,
  onConfirm,
  onRefine,
  loading = false,
  query = '',
  hasSearched = false,
  onSelectTopic
}) => {
  if (loading) {
    return (
      <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          Understanding your memory & searching photo library...
        </div>
        <p style={{ fontSize: '0.85rem' }}>
          Comparing vector embeddings, matching scene clues, and candidate ranking.
        </p>
      </div>
    );
  }

  // Only show results or "no photos found" if a search has actually been performed
  if (!hasSearched) {
    return null;
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center', background: 'var(--bg-card)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem' }}>
          🔍 No photos found for search keyword {query ? `"${query}"` : ''}
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '520px', margin: '0 auto 1.25rem', lineHeight: '1.5' }}>
          We couldn't find any photos in your library matching this memory. Try searching for available topics in your library like:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
          {[
            'club party with friends',
            'trekking',
            'birthday party with friends',
            'Diwali with friends and family',
            'family gatherings',
            'pets with owner',
            'restaurant',
            'Himalayan mountain',
            'Jaipur',
            'food photos',
            'dancing class',
            'swimming classes',
            'holi celebration with friend and family',
            'outfits',
            'positive thoughts',
            'comment in social media',
            'Restaurant bill receipts',
            'video like cafe'
          ].map((topic, idx) => (
            <button
              key={idx}
              type="button"
              className="badge"
              onClick={() => onSelectTopic && onSelectTopic(topic)}
              style={{
                background: 'rgba(59, 130, 246, 0.12)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                borderRadius: '9999px',
                cursor: onSelectTopic ? 'pointer' : 'default'
              }}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Display up to 5 matching candidates only
  const displayedCandidates = candidates.slice(0, 5);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fff' }}>
          Possible Candidate Matches ({displayedCandidates.length})
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Top 5 ranked by Semantic + Metadata + AI Score
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {displayedCandidates.map((cand) => (
          <PhotoResultCard
            key={cand.photo_id}
            candidate={cand}
            onConfirm={onConfirm}
            onRefine={onRefine}
          />
        ))}
      </div>
    </div>
  );
};
