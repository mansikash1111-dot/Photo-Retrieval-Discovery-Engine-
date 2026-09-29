import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout/Layout';
import { StatCard } from '../../components/StatCard/StatCard';
import { Activity, CheckCircle, Footprints, Image, AlertCircle, RefreshCw } from 'lucide-react';

interface AnalyticsSummary {
  total_sessions: number;
  successful_retrievals: number;
  failed_retrievals: number;
  active_sessions: number;
  success_rate_percent: number;
  average_search_steps: number;
  average_candidates_viewed: number;
  dummy_photo_count: number;
}

export const AnalyticsPage: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/mvp/analytics/summary');
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (err) {
      console.error('Error fetching MVP analytics:', err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <Layout title="Prototype Retrieval Analytics">
      {/* Disclaimer Banner */}
      <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#fcd34d' }}>
        <AlertCircle size={18} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
        <div>
          <strong>Prototype Analytics Notice:</strong> These metrics reflect experimental observations from synthetic dummy library test sessions and are NOT final validated product metrics.
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard
          title="Retrieval Sessions"
          value={summary?.total_sessions || 0}
          icon={Activity}
          subtext="Total natural language searches"
          color="blue"
        />

        <StatCard
          title="Successful Retrievals"
          value={summary?.successful_retrievals || 0}
          icon={CheckCircle}
          subtext={`${summary?.success_rate_percent || 0}% target confirmed rate`}
          color="green"
        />

        <StatCard
          title="Average Search Steps"
          value={summary?.average_search_steps || 1.0}
          icon={Footprints}
          subtext="Refinements per successful session"
          color="purple"
        />

        <StatCard
          title="Synthetic Library Size"
          value={summary?.dummy_photo_count || 150}
          icon={Image}
          subtext="Generated photo metadata records"
          color="cyan"
        />
      </div>

      {/* Analytical Breakdown Panel */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fff' }}>
              Retrieval Behavior Instrumentation
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Data captured for future Parts 6 & 7 MVP testing & validation
            </span>
          </div>

          <button className="btn btn-secondary" onClick={fetchAnalytics}>
            <RefreshCw size={14} />
            <span>Refresh Metrics</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active In-Progress Sessions</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{summary?.active_sessions || 0}</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Sessions currently refining search</p>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Failed / Unconfirmed Sessions</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-rose)' }}>{summary?.failed_retrievals || 0}</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Target photo not found in initial results</p>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Average Candidates Viewed</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{summary?.average_candidates_viewed || 0}</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Candidates evaluated per session</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
