import React from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { CollectionJob } from '../../types';
import { SourceBadge } from '../SourceBadge/SourceBadge';

interface CollectionJobStatusProps {
  job: CollectionJob;
}

export const CollectionJobStatus: React.FC<CollectionJobStatusProps> = ({ job }) => {
  const started = new Date(job.started_at);
  const completed = job.completed_at ? new Date(job.completed_at) : null;
  const durationSec = completed ? Math.max(1, Math.round((completed.getTime() - started.getTime()) / 1000)) : null;

  return (
    <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem', borderLeft: `4px solid ${job.status === 'completed' ? '#10b981' : job.status === 'failed' ? '#f43f5e' : '#3b82f6'}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <SourceBadge slug={job.source_slug || 'unknown'} name={job.source_name || 'All Sources'} />
          
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Query: <code style={{ color: '#fff' }}>"{job.query || 'photo search'}"</code>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {job.status === 'completed' && (
            <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <CheckCircle2 size={12} />
              <span>COMPLETED</span>
            </span>
          )}
          {job.status === 'running' && (
            <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <Loader2 size={12} className="spin" />
              <span>RUNNING</span>
            </span>
          )}
          {job.status === 'failed' && (
            <span className="badge" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
              <XCircle size={12} />
              <span>FAILED</span>
            </span>
          )}
        </div>
      </div>

      {/* Metrics breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem', background: 'var(--bg-primary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Items Found</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{job.items_found}</div>
        </div>

        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>New Saved</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-green)' }}>{job.items_saved}</div>
        </div>

        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Duplicates</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-amber)' }}>{job.items_duplicate}</div>
        </div>

        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Classified AI</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{job.items_classified}</div>
        </div>

        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Duration</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            {durationSec !== null ? `${durationSec}s` : 'Running...'}
          </div>
        </div>
      </div>

      {job.error_message && (
        <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.85rem', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: 'var(--radius-sm)', color: '#f87171', fontSize: '0.8rem' }}>
          <strong>Error:</strong> {job.error_message}
        </div>
      )}
    </div>
  );
};
