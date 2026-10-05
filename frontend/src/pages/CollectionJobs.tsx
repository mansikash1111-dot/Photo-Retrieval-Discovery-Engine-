import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { CollectionJobStatus } from '../components/CollectionJobStatus/CollectionJobStatus';
import { getCollectionJobs, clearCollectionJobs, triggerCollection, getStats } from '../services/api';
import { CollectionJob, StatsResponse } from '../types';
import { Play, PlaySquare, RefreshCw, Sliders, CheckCircle2, Trash2 } from 'lucide-react';

export const CollectionJobs: React.FC = () => {
  const [jobs, setJobs] = useState<CollectionJob[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [selectedSource, setSelectedSource] = useState<string>('');
  const [query, setQuery] = useState<string>('photo search');
  const [maxItems, setMaxItems] = useState<number>(50);
  const [latestSummary, setLatestSummary] = useState<CollectionJob[] | null>(null);

  const presetQueries = [
    'photo search',
    'find photos',
    'can\'t find photo',
    'cannot find picture',
    'search photos',
    'old photos',
    'find old photo',
    'Google Photos search',
    'finding a specific photo',
    'photo retrieval',
    'search memories',
    'find vacation photo'
  ];

  const loadData = async () => {
    try {
      const s = await getStats();
      setStats(s);
      const j = await getCollectionJobs();
      setJobs(j);
    } catch (err) {
      console.error('Error fetching collection jobs:', err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // refresh status
    return () => clearInterval(interval);
  }, []);

  const handleStartJob = async (sourceSlugOverride?: string) => {
    setLoading(true);
    setLatestSummary(null);
    try {
      const targetSlug = sourceSlugOverride !== undefined ? sourceSlugOverride : selectedSource;
      const res = await triggerCollection(targetSlug || undefined, query, maxItems);
      setLatestSummary(res);
      await loadData();
    } catch (err) {
      console.error('Error launching collection job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear the collection jobs history log?')) return;
    try {
      await clearCollectionJobs();
      setLatestSummary(null);
      await loadData();
    } catch (err) {
      console.error('Error clearing jobs history:', err);
    }
  };

  return (
    <Layout title="Collection Control & Jobs History" stats={stats || undefined}>
      {/* Control Panel Card */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Sliders size={20} style={{ color: 'var(--accent-blue)' }} />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fff' }}>
            Configure & Trigger Collection Job
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', alignItems: 'end' }}>
          {/* Target Source Selection */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Target Source
            </label>
            <select
              className="select"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">All Enabled Sources (Run All)</option>
              <option value="google-play">Google Play Store</option>
              <option value="apple-app-store">Apple App Store</option>
              <option value="reddit">Reddit</option>
              <option value="google-photos-community">Google Photos Community</option>
              <option value="youtube">YouTube</option>
              <option value="forums">Public Forums</option>
            </select>
          </div>

          {/* Search Query Parameter */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Search Query Keyword
            </label>
            <input
              type="text"
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Google Photos search"
              style={{ width: '100%' }}
            />
          </div>

          {/* Query Presets */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Query Preset
            </label>
            <select
              className="select"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: '100%' }}
            >
              {presetQueries.map(q => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>

          {/* Limit Per Source */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Max Items Per Source: {maxItems}
            </label>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={maxItems}
              onChange={(e) => setMaxItems(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-blue)' }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-primary"
              disabled={loading}
              onClick={() => handleStartJob()}
              style={{ flex: 1 }}
            >
              {loading ? <RefreshCw size={15} className="spin" /> : <Play size={15} />}
              <span>{selectedSource ? 'Collect Source' : 'Run Selected'}</span>
            </button>

            <button
              className="btn btn-success"
              disabled={loading}
              onClick={() => handleStartJob('')}
              title="Run collection across all 6 public sources simultaneously"
            >
              <PlaySquare size={15} />
              <span>Run All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Latest Collection Summary Banner (Section 32) */}
      {latestSummary && latestSummary.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--accent-green)', background: 'rgba(16, 185, 129, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CheckCircle2 size={20} style={{ color: 'var(--accent-green)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fff' }}>
              Collection Complete Summary
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {latestSummary.map(j => (
              <CollectionJobStatus key={j.id} job={j} />
            ))}
          </div>
        </div>
      )}

      {/* Historical Jobs Log */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fff' }}>
              Collection Jobs History Log
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Audit trail of all background ingestion jobs
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {jobs.length > 0 && (
              <button
                className="btn btn-secondary"
                onClick={handleClearHistory}
                style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: '#FCA5A5' }}
                title="Clear past failed or completed job logs"
              >
                <Trash2 size={14} />
                <span>Clear History</span>
              </button>
            )}
            <button className="btn btn-secondary" onClick={loadData}>
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No collection jobs executed yet. Click <strong>Run All Sources</strong> to begin collecting public user feedback.
          </div>
        ) : (
          <div>
            {jobs.map(j => (
              <CollectionJobStatus key={j.id} job={j} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
