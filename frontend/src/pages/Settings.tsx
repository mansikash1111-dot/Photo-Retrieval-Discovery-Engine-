import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { getSources, getStats } from '../services/api';
import { Source, StatsResponse } from '../types';
import { Cpu, Database, CheckCircle, ShieldCheck } from 'lucide-react';

export const Settings: React.FC = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    getSources().then(setSources).catch(console.error);
    getStats().then(setStats).catch(console.error);
  }, []);

  return (
    <Layout title="System Configuration & Settings" stats={stats || undefined}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Card 1: AI Provider Status */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Cpu size={20} style={{ color: 'var(--accent-cyan)' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fff' }}>
              AI Classifier Provider
            </h2>
          </div>

          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <strong>Provider Model:</strong> <code style={{ color: 'var(--accent-cyan)' }}>Gemini Flash (gemini-2.5-flash)</code>
            </div>
            <div>
              <strong>Fallback Classifier:</strong> Enabled (Keyword Pre-filter Rule Engine)
            </div>
            <div>
              <strong>JSON Output Schema:</strong> Strict Pydantic JSON validation enforced
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
              <ShieldCheck size={14} style={{ color: 'var(--accent-green)', display: 'inline', marginRight: '0.35rem' }} />
              Original review text is never overwritten. AI relevance score & topic inferences are stored in dedicated columns.
            </div>
          </div>
        </div>

        {/* Card 2: Database Connection */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Database size={20} style={{ color: 'var(--accent-blue)' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fff' }}>
              Database Engine
            </h2>
          </div>

          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <strong>Database Backend:</strong> SQLite / PostgreSQL (SQLAlchemy 2.0 ORM)
            </div>
            <div>
              <strong>Total Records Stored:</strong> {stats?.total_collected || 0} reviews
            </div>
            <div>
              <strong>Unique Constraint:</strong> <code>(source_id, external_id)</code> & <code>content_hash (SHA-256)</code>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Configured Sources Status */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1rem' }}>
          Configured Collector Connectors
        </h2>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Source Channel</th>
                <th>Slug</th>
                <th>Base URL</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sources.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{s.name}</td>
                  <td><code>{s.slug}</code></td>
                  <td><a href={s.base_url || '#'} target="_blank" rel="noopener noreferrer">{s.base_url || 'N/A'}</a></td>
                  <td>
                    <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                      <CheckCircle size={12} /> Enabled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};
