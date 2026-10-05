import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlayCircle, 
  Settings as SettingsIcon,
  SearchCode,
  Sparkles,
  BarChart3,
  LogOut,
  LogIn
} from 'lucide-react';
import {
  AllReviewsIcon,
  GooglePlayIcon,
  AppleAppStoreIcon,
  RedditIcon,
  GoogleCommunityIcon,
  YouTubeIcon,
  ForumsIcon
} from '../Icons/BrandIcons';
import { StatsResponse } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  stats?: StatsResponse;
}

export const Sidebar: React.FC<SidebarProps> = ({ stats }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/signup');
  };

  const getCount = (slug?: string) => {
    if (!stats || !stats.source_breakdown) return null;
    if (!slug) return stats.total_collected;
    return stats.source_breakdown[slug] || 0;
  };

  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div className="sidebar-header">
        <div className="sidebar-title">
          <SearchCode size={24} style={{ color: 'var(--accent-blue)' }} />
          <span>Photo Retrieval</span>
        </div>
        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-cyan)', fontWeight: 700, marginTop: '0.25rem' }}>
          PM Case Study Engine
        </div>
      </div>

      <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="nav-section-title">Overview</div>
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>
        </NavLink>

        {/* Part 5: AI-Native Retrieval MVP Section */}
        <div className="nav-section-title" style={{ marginTop: '1.25rem' }}>AI-Native Retrieval MVP</div>
        <NavLink to="/mvp/retrieval" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Sparkles size={18} style={{ color: 'var(--accent-cyan)' }} />
            <span>Smart Photo Retrieval</span>
          </div>
        </NavLink>

        <NavLink to="/mvp/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <BarChart3 size={18} style={{ color: 'var(--accent-amber)' }} />
            <span>Prototype Analytics</span>
          </div>
        </NavLink>

        {/* Part 1: Review Collection Section */}
        <div className="nav-section-title" style={{ marginTop: '1.25rem' }}>Review Collection</div>
        
        <NavLink to="/reviews" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <AllReviewsIcon size={18} />
            <span>All Reviews</span>
          </div>
          {getCount() !== null && <span className="nav-count">{getCount()}</span>}
        </NavLink>

        <NavLink to="/reviews/google-play" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <GooglePlayIcon size={18} />
            <span>Google Play</span>
          </div>
          {getCount('google-play') !== null && <span className="nav-count">{getCount('google-play')}</span>}
        </NavLink>

        <NavLink to="/reviews/apple-app-store" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <AppleAppStoreIcon size={18} />
            <span>Apple App Store</span>
          </div>
          {getCount('apple-app-store') !== null && <span className="nav-count">{getCount('apple-app-store')}</span>}
        </NavLink>

        <NavLink to="/reviews/reddit" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <RedditIcon size={18} />
            <span>Reddit</span>
          </div>
          {getCount('reddit') !== null && <span className="nav-count">{getCount('reddit')}</span>}
        </NavLink>

        <NavLink to="/reviews/google-photos-community" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <GoogleCommunityIcon size={18} />
            <span>Google Community</span>
          </div>
          {getCount('google-photos-community') !== null && <span className="nav-count">{getCount('google-photos-community')}</span>}
        </NavLink>

        <NavLink to="/reviews/youtube" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <YouTubeIcon size={18} />
            <span>YouTube</span>
          </div>
          {getCount('youtube') !== null && <span className="nav-count">{getCount('youtube')}</span>}
        </NavLink>

        <NavLink to="/reviews/forums" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ForumsIcon size={18} />
            <span>Forums</span>
          </div>
          {getCount('forums') !== null && <span className="nav-count">{getCount('forums')}</span>}
        </NavLink>

        <div className="nav-section-title" style={{ marginTop: '1.25rem' }}>System & Control</div>

        <NavLink to="/collection-jobs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <PlayCircle size={18} />
            <span>Collection Jobs</span>
          </div>
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <SettingsIcon size={18} />
            <span>Settings</span>
          </div>
        </NavLink>
      </nav>

      {/* User Session Footer Block */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(15, 23, 42, 0.6)'
      }}>
        {isAuthenticated && user ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                fontWeight: 700,
                fontSize: '0.85rem',
                flexShrink: 0
              }}>
                {(user.full_name || user.email).charAt(0).toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#F1F5F9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.full_name || 'User Session'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.email}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#FCA5A5',
                borderRadius: '0.4rem',
                padding: '0.35rem 0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.75rem',
                flexShrink: 0
              }}
            >
              <LogOut size={13} />
              <span>Exit</span>
            </button>
          </div>
        ) : (
          <NavLink
            to="/signup"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              background: 'rgba(37, 99, 235, 0.15)',
              border: '1px solid rgba(37, 99, 235, 0.4)',
              color: '#38BDF8',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            <LogIn size={15} />
            <span>Log In / Sign Up</span>
          </NavLink>
        )}
      </div>
    </aside>
  );
};
