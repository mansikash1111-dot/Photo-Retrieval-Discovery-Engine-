import React from 'react';
import { Play, Database, Sparkles, LogOut, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  title: string;
  isDemoActive?: boolean;
  onSeedDemo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, isDemoActive, onSeedDemo }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

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

        {/* User Session Handling Controls */}
        {isAuthenticated && user ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.35rem 0.65rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '2rem',
            marginLeft: '0.5rem'
          }}>
            <div style={{
              width: '1.85rem',
              height: '1.85rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              fontWeight: 700,
              fontSize: '0.8rem'
            }}>
              {(user.full_name || user.email).charAt(0).toUpperCase()}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '0.25rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#F1F5F9', lineHeight: 1.1 }}>
                {user.full_name || 'User'}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                {user.email}
              </span>
            </div>

            <button
              onClick={logout}
              title="Log Out of Session"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: 'none',
                color: '#FCA5A5',
                borderRadius: '50%',
                width: '1.85rem',
                height: '1.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/login')}
            style={{
              marginLeft: '0.5rem',
              borderColor: 'var(--accent-blue)',
              color: '#38BDF8'
            }}
          >
            <LogIn size={15} />
            <span>Log In / Sign Up</span>
          </button>
        )}
      </div>
    </header>
  );
};
