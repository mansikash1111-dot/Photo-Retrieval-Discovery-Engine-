import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { StatCard } from '../components/StatCard/StatCard';
import { SourceBadge } from '../components/SourceBadge/SourceBadge';
import { ReviewTable } from '../components/ReviewTable/ReviewTable';
import { ReviewDetails } from './ReviewDetails';
import { getStats, getReviews, seedDemoData } from '../services/api';
import { StatsResponse, Review } from '../types';
import { Database, Filter, Layers, RefreshCw, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoActive, setIsDemoActive] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const s = await getStats();
      setStats(s);

      const r = await getReviews({ page: 1, page_size: 5 });
      setRecentReviews(r.items);

      const hasDemo = r.items.some(item => item.is_demo);
      setIsDemoActive(hasDemo);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSeedDemo = async () => {
    try {
      await seedDemoData();
      await fetchData();
    } catch (err) {
      console.error('Error seeding demo data:', err);
    }
  };

  const formattedLastCollection = stats?.last_collection
    ? new Date(stats.last_collection).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Never';

  const sourcesList = [
    { name: 'Google Play', slug: 'google-play' },
    { name: 'Apple App Store', slug: 'apple-app-store' },
    { name: 'Reddit', slug: 'reddit' },
    { name: 'Google Community', slug: 'google-photos-community' },
    { name: 'YouTube', slug: 'youtube' },
    { name: 'Forums', slug: 'forums' }
  ];

  return (
    <Layout
      title="Photo Retrieval Discovery Engine"
      stats={stats || undefined}
      isDemoActive={isDemoActive}
      onSeedDemo={handleSeedDemo}
    >
      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard
          title="Active Public Sources"
          value={stats?.total_sources || 6}
          icon={Layers}
          subtext="Google Play, App Store, Reddit, Support, YT, Forums"
          color="blue"
        />

        <StatCard
          title="Total Collected Reviews"
          value={stats?.total_collected || 0}
          icon={Database}
          subtext="Normalized & Deduplicated"
          color="cyan"
        />

        <StatCard
          title="Retrieval Related"
          value={stats?.retrieval_related || 0}
          icon={Filter}
          subtext={stats?.total_collected ? `${Math.round(((stats.retrieval_related || 0) / stats.total_collected) * 100)}% of total evidence` : '0%'}
          color="green"
        />

        <StatCard
          title="Last Collection Job"
          value={formattedLastCollection}
          icon={RefreshCw}
          subtext="Automated background runs"
          color="amber"
        />
      </div>

      {/* Main Breakdown Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Source Breakdown Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fff' }}>
              Public Source Evidence Breakdown
            </h2>
            <button className="btn btn-secondary" onClick={() => navigate('/reviews')} style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
              View All Reviews
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Public Source</th>
                  <th style={{ textAlign: 'right' }}>Total Collected</th>
                  <th style={{ textAlign: 'right' }}>Retrieval Related</th>
                  <th style={{ textAlign: 'right' }}>Relevance Ratio</th>
                </tr>
              </thead>
              <tbody>
                {sourcesList.map(src => {
                  const total = stats?.source_breakdown[src.slug] || 0;
                  const retrieval = stats?.retrieval_breakdown[src.slug] || 0;
                  const ratio = total > 0 ? Math.round((retrieval / total) * 100) : 0;

                  return (
                    <tr key={src.slug} style={{ cursor: 'pointer' }} onClick={() => navigate(`/reviews/${src.slug}`)}>
                      <td>
                        <SourceBadge slug={src.slug} name={src.name} />
                      </td>

                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#fff' }}>
                        {total}
                      </td>

                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-green)' }}>
                        {retrieval}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${ratio}%`, height: '100%', background: 'var(--accent-green)' }} />
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{ratio}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Research Actions */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '0.75rem' }}>
              Collection Control
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Run automated queries across Play Store, App Store, Reddit, Google Support, YouTube, and Forums to discover photo search problems.
            </p>

            <button className="btn btn-primary" onClick={() => navigate('/collection-jobs')} style={{ width: '100%', marginBottom: '0.75rem' }}>
              <Play size={16} />
              <span>Launch Collection Job</span>
            </button>

            <button className="btn btn-secondary" onClick={handleSeedDemo} style={{ width: '100%' }}>
              <Database size={16} />
              <span>Seed Synthetic Demo Dataset</span>
            </button>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              PM Research Guideline
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Original user reviews are strictly preserved without overwrite. Gemini Flash provides structured classification for research traceability.
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reviews Table Section */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fff' }}>
              Recent Public Feedback Evidence
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Real-time feed of ingested reviews & discussions
            </span>
          </div>

          <button className="btn btn-secondary" onClick={() => navigate('/reviews')}>
            View All Reviews ({stats?.total_collected || 0})
          </button>
        </div>

        <ReviewTable
          reviews={recentReviews}
          onSelectReview={setSelectedReview}
          loading={loading}
        />
      </div>

      {/* Review Details Modal */}
      {selectedReview && (
        <ReviewDetails
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </Layout>
  );
};
