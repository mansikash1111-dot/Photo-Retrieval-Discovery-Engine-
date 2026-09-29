import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  Smartphone, 
  Apple, 
  MessageSquare, 
  HelpCircle, 
  Youtube, 
  Globe, 
  PlayCircle, 
  Settings as SettingsIcon,
  SearchCode,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { StatsResponse } from '../../types';

interface SidebarProps {
  stats?: StatsResponse;
}

export const Sidebar: React.FC<SidebarProps> = ({ stats }) => {
  const getCount = (slug?: string) => {
    if (!stats || !stats.source_breakdown) return null;
    if (!slug) return stats.total_collected;
    return stats.source_breakdown[slug] || 0;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <SearchCode size={24} style={{ color: 'var(--accent-blue)' }} />
          <span>Photo Retrieval</span>
        </div>
        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-cyan)', fontWeight: 700, marginTop: '0.25rem' }}>
          PM Case Study Engine
        </div>
      </div>

      <nav className="sidebar-nav">
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
            <Layers size={18} />
            <span>All Reviews</span>
          </div>
          {getCount() !== null && <span className="nav-count">{getCount()}</span>}
        </NavLink>

        <NavLink to="/reviews/google-play" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Smartphone size={18} style={{ color: '#34d399' }} />
            <span>Google Play</span>
          </div>
          {getCount('google-play') !== null && <span className="nav-count">{getCount('google-play')}</span>}
        </NavLink>

        <NavLink to="/reviews/apple-app-store" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Apple size={18} style={{ color: '#60a5fa' }} />
            <span>Apple App Store</span>
          </div>
          {getCount('apple-app-store') !== null && <span className="nav-count">{getCount('apple-app-store')}</span>}
        </NavLink>

        <NavLink to="/reviews/reddit" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <MessageSquare size={18} style={{ color: '#fb923c' }} />
            <span>Reddit</span>
          </div>
          {getCount('reddit') !== null && <span className="nav-count">{getCount('reddit')}</span>}
        </NavLink>

        <NavLink to="/reviews/google-photos-community" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <HelpCircle size={18} style={{ color: '#93c5fd' }} />
            <span>Google Community</span>
          </div>
          {getCount('google-photos-community') !== null && <span className="nav-count">{getCount('google-photos-community')}</span>}
        </NavLink>

        <NavLink to="/reviews/youtube" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Youtube size={18} style={{ color: '#f87171' }} />
            <span>YouTube</span>
          </div>
          {getCount('youtube') !== null && <span className="nav-count">{getCount('youtube')}</span>}
        </NavLink>

        <NavLink to="/reviews/forums" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Globe size={18} style={{ color: '#c084fc' }} />
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
    </aside>
  );
};
