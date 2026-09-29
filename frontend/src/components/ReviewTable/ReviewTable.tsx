import React from 'react';
import { Eye, Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { Review } from '../../types';
import { SourceBadge } from '../SourceBadge/SourceBadge';

interface ReviewTableProps {
  reviews: Review[];
  onSelectReview: (review: Review) => void;
  sourceSlug?: string;
  loading?: boolean;
}

export const ReviewTable: React.FC<ReviewTableProps> = ({
  reviews,
  onSelectReview,
  sourceSlug,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading review evidence...</div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          No reviews collected yet.
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
          Run a collection job to begin collecting public feedback from Google Play, App Store, Reddit, Google Support, YouTube, and Forums.
        </p>
      </div>
    );
  }

  const renderSourceMetric = (r: Review) => {
    if (r.rating !== undefined && r.rating !== null) {
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontWeight: 700 }}>
          {r.rating} <Star size={12} fill="#f59e0b" />
        </span>
      );
    }
    if (r.reddit_meta) {
      return (
        <span style={{ fontSize: '0.8rem', color: 'var(--accent-orange, #fb923c)', fontWeight: 600 }}>
          {r.reddit_meta.score} pts ({r.reddit_meta.subreddit})
        </span>
      );
    }
    if (r.youtube_meta) {
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <ThumbsUp size={12} /> {r.youtube_meta.like_count}
        </span>
      );
    }
    if (r.community_meta) {
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <MessageSquare size={12} /> {r.community_meta.reply_count} replies
        </span>
      );
    }
    return <span style={{ color: 'var(--text-dim)' }}>—</span>;
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Source</th>
            <th>Title / Content Snippet</th>
            <th>Metric</th>
            <th>Author</th>
            <th>Retrieval Related</th>
            <th>Topic & Score</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => {
            const pubDate = r.published_at
              ? new Date(r.published_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
              : new Date(r.collected_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

            const isRelated = r.is_retrieval_related;
            const scorePct = r.relevance_score ? Math.round(r.relevance_score * 100) : null;

            return (
              <tr key={r.id}>
                <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {pubDate}
                </td>

                <td>
                  <SourceBadge slug={r.source_slug || sourceSlug || 'unknown'} name={r.source_name} />
                </td>

                <td style={{ maxWidth: '420px' }}>
                  {r.title && (
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.875rem', marginBottom: '0.2rem' }}>
                      {r.title}
                    </div>
                  )}
                  <div style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.825rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    "{r.content}"
                  </div>
                </td>

                <td>{renderSourceMetric(r)}</td>

                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  {r.author || 'Anonymous'}
                </td>

                <td>
                  {isRelated === true && (
                    <span className="badge badge-retrieval-yes">YES</span>
                  )}
                  {isRelated === false && (
                    <span className="badge badge-retrieval-no">NO</span>
                  )}
                  {isRelated === null && (
                    <span className="badge badge-retrieval-pending">PENDING</span>
                  )}
                </td>

                <td>
                  {r.retrieval_topic && (
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#e5e7eb' }}>
                      {r.retrieval_topic.replace(/_/g, ' ')}
                    </div>
                  )}
                  {scorePct !== null && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>
                      Relevance: {scorePct}%
                    </div>
                  )}
                </td>

                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => onSelectReview(r)}
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', gap: '0.3rem' }}
                  >
                    <Eye size={13} />
                    <span>Details</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
