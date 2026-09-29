import React from 'react';
import { Play, Database, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  isDemoActive?: boolean;
  onSeedDemo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, isDemoActive, onSeedDemo }) => {
  const navigate = useNavigate();

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fff' }}>
          {title}
        </h1>

        {isDemoActive && (
          <span className="badge badge-demo">
            <Sparkles size={12} />
            <span>DEMO DATA ACTIVE</span>
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {onSeedDemo && (
          <button className="btn btn-secondary" onClick={onSeedDemo} title="Load synthetic demo data for offline PM review">
            <Database size={15} />
            <span>Load Demo Data</span>
          </button>
        )}

        <button className="btn btn-primary" onClick={() => navigate('/collection-jobs')}>
          <Play size={15} />
          <span>Run Collection</span>
        </button>
      </div>
    </header>
  );
};
