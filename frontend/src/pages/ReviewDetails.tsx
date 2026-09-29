import React from 'react';
import { X, ExternalLink, Cpu, FileText } from 'lucide-react';
import { Review } from '../types';
import { SourceBadge } from '../components/SourceBadge/SourceBadge';

interface ReviewDetailsProps {
  review: Review | null;
  onClose: () => void;
}

export const ReviewDetails: React.FC<ReviewDetailsProps> = ({ review, onClose }) => {
  if (!review) return null;

  const publishedStr = review.published_at
    ? new Date(review.published_at).toLocaleString()
    : 'Unknown';

  const collectedStr = new Date(review.collected_at).toLocaleString();

  const isRelated = review.is_retrieval_related;
  const scorePct = review.relevance_score !== null && review.relevance_score !== undefined
    ? Math.round(review.relevance_score * 100)
    : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
              <SourceBadge slug={review.source_slug || 'unknown'} name={review.source_name} />
              {review.is_demo && <span className="badge badge-demo">DEMO DATA</span>}
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fff' }}>
              {review.title || `Review Evidence #${review.id}`}
            </h2>
          </div>

          <button className="btn btn-secondary" onClick={onClose} style={{ padding: '0.5rem', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Metadata Info Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Author</span>
            <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{review.author || 'Anonymous'}</div>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Published Date</span>
            <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{publishedStr}</div>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Original Source</span>
            <div>
              <a href={review.source_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600 }}>
                <span>Open Original</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* Section 1: Explicit User Evidence (Original User Text) */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <FileText size={16} style={{ color: 'var(--accent-blue)' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Original User Evidence (Unfiltered Raw Text)
            </h3>
          </div>

          <div style={{ background: 'var(--bg-primary)', border: '1px dashed rgba(255, 255, 255, 0.15)', borderRadius: 'var(--radius-md)', padding: '1.25rem', color: '#f3f4f6', fontSize: '0.95rem', lineHeight: '1.6', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            "{review.content}"
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
            Note: Original text is preserved unaltered to maintain research traceability.
          </div>
        </div>

        {/* Section 2: AI Relevance Classification & Inference (Section 29 Separation!) */}
        <div style={{ background: 'rgba(31, 41, 61, 0.6)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={18} style={{ color: 'var(--accent-cyan)' }} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AI Relevance Inference (Gemini Flash)
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isRelated === true && <span className="badge badge-retrieval-yes">RETRIEVAL RELATED</span>}
              {isRelated === false && <span className="badge badge-retrieval-no">NOT RETRIEVAL RELATED</span>}
              {isRelated === null && <span className="badge badge-retrieval-pending">CLASSIFICATION PENDING</span>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confidence Score</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {scorePct !== null ? `${scorePct}%` : 'N/A'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Inferred Retrieval Topic</span>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                {review.retrieval_topic ? review.retrieval_topic.replace(/_/g, ' ') : 'N/A'}
              </div>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Classification Reasoning</span>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.25rem', fontStyle: 'italic' }}>
              "{review.relevance_reason || 'No reasoning available.'}"
            </p>
          </div>
        </div>

        {/* Section 3: Collection Metadata */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div>
            <strong>Collected At:</strong> {collectedStr}
          </div>
          <div>
            <strong>Collection Method:</strong> {review.collection_method}
          </div>
          <div>
            <strong>Content SHA-256 Hash:</strong> <code style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>{review.content_hash.substring(0, 16)}...</code>
          </div>
        </div>
      </div>
    </div>
  );
};
