import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  SearchCode, 
  Sparkles, 
  Database, 
  ShieldCheck, 
  ArrowRight, 
  LogIn, 
  LogOut, 
  Image as ImageIcon,
  Search,
  MessageSquare
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/signup');
  };

  const sampleKeywords = [
    { label: 'Goa Beach Trip', query: 'goa beach' },
    { label: 'Birthday Party', query: 'birthday party' },
    { label: 'Restaurant Receipts', query: 'restaurant bill' },
    { label: 'Himalayan Mountain', query: 'himalayan' },
    { label: 'Diwali Celebration', query: 'diwali' },
    { label: 'Pet Dog Photos', query: 'pets owner' },
    { label: 'Outfit Screenshots', query: 'outfit screenshot' },
    { label: 'Swimming & Dance', query: 'swimming' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #1E293B 0%, #0F172A 50%, #0B0F19 100%)',
      color: '#F8FAFC',
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Navbar Header */}
      <header style={{
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        {/* Left Side: Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
          }}>
            <SearchCode size={22} style={{ color: '#FFFFFF' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#FFFFFF', lineHeight: 1.1 }}>
              Google Photos Discovery Engine
            </div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38BDF8', fontWeight: 700 }}>
              PM Case Study & AI Smart Retrieval
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ background: 'none', border: 'none', color: '#CBD5E1', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#38BDF8'}
            onMouseOut={(e) => e.currentTarget.style.color = '#CBD5E1'}
          >
            Review Evidence Dashboard
          </button>
          <button 
            onClick={() => navigate('/mvp/retrieval')}
            style={{ background: 'none', border: 'none', color: '#CBD5E1', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#38BDF8'}
            onMouseOut={(e) => e.currentTarget.style.color = '#CBD5E1'}
          >
            <Sparkles size={15} style={{ color: '#38BDF8' }} />
            <span>Smart Retrieval MVP</span>
          </button>
          <button 
            onClick={() => navigate('/mvp/analytics')}
            style={{ background: 'none', border: 'none', color: '#CBD5E1', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#38BDF8'}
            onMouseOut={(e) => e.currentTarget.style.color = '#CBD5E1'}
          >
            Analytics
          </button>
        </nav>

        {/* Right Side: Auth / Login Button */}
        <div>
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.35rem 0.85rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '2rem'
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
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F1F5F9' }}>
                  {user.full_name || user.email}
                </span>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#FCA5A5',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '0.6rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '0.5rem 1.15rem',
                  borderRadius: '0.65rem',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  background: 'rgba(56, 189, 248, 0.1)',
                  color: '#38BDF8',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <LogIn size={16} />
                <span>Log In</span>
              </button>

              <button
                onClick={() => navigate('/signup')}
                style={{
                  padding: '0.5rem 1.15rem',
                  borderRadius: '0.65rem',
                  border: 'none',
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 14px rgba(14, 165, 233, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>Sign Up</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '3.5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 3.5rem auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.9rem',
            borderRadius: '2rem',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            color: '#38BDF8',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '1.25rem'
          }}>
            <Sparkles size={14} />
            <span>GOOGLE PHOTOS PRODUCT MANAGEMENT CASE STUDY</span>
          </div>

          <h1 style={{
            fontSize: '2.75rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            lineHeight: 1.2,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.25rem'
          }}>
            AI-Native Smart Photo Retrieval & Feedback Discovery Engine
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: '#94A3B8',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            An end-to-end product solution built to solve user search friction in personal photo libraries. 
            Combines multi-source public review mining (Play Store, App Store, Reddit, YouTube) with a high-precision, 
            deduplicated multi-modal photo retrieval engine.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/mvp/retrieval')}
              style={{
                padding: '0.85rem 1.75rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
                color: '#FFFFFF',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 8px 24px rgba(14, 165, 233, 0.35)'
              }}
            >
              <Sparkles size={18} />
              <span>Launch Photo Retrieval MVP</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '0.85rem 1.75rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#F8FAFC',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <Database size={18} style={{ color: '#38BDF8' }} />
              <span>Explore Review Evidence</span>
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3.5rem'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '1rem',
            padding: '1.75rem',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{
              width: '2.75rem',
              height: '2.75rem',
              borderRadius: '0.75rem',
              background: 'rgba(56, 189, 248, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <MessageSquare size={22} style={{ color: '#38BDF8' }} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
              Multi-Source Review Mining
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.5 }}>
              Ingests real public user feedback from 6 distinct channels: Google Play, Apple App Store, Reddit, Google Support, YouTube, and Digital Forums.
            </p>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '1rem',
            padding: '1.75rem',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{
              width: '2.75rem',
              height: '2.75rem',
              borderRadius: '0.75rem',
              background: 'rgba(34, 197, 94, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Search size={22} style={{ color: '#22C55E' }} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
              Multi-Modal Natural Language Search
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.5 }}>
              Search personal photos by people, events, activities, receipts, outfits, weather, date range, or specific keywords with exact photo matching.
            </p>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '1rem',
            padding: '1.75rem',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{
              width: '2.75rem',
              height: '2.75rem',
              borderRadius: '0.75rem',
              background: 'rgba(245, 158, 11, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <ImageIcon size={22} style={{ color: '#F59E0B' }} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
              Deduplicated High-Precision Results
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.5 }}>
              Ensoring exact relevance with zero duplicate results. If no photo matches the user keyword, displays a clear helpful notice.
            </p>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '1rem',
            padding: '1.75rem',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{
              width: '2.75rem',
              height: '2.75rem',
              borderRadius: '0.75rem',
              background: 'rgba(168, 85, 247, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <ShieldCheck size={22} style={{ color: '#A855F7' }} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
              User Auth & Protected Session
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.5 }}>
              Secure PBKDF2 password hashing, user session tokens, protected search routes, and quick one-click demo login.
            </p>
          </div>
        </div>

        {/* Interactive Query Keywords Showcase */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '1.25rem',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
            Try Real Photo Retrieval Seed Queries
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '1.25rem' }}>
            Click any query below to launch the smart retrieval search engine
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', justifyContent: 'center' }}>
            {sampleKeywords.map((item, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/mvp/retrieval?q=${encodeURIComponent(item.query)}`)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#E2E8F0',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                  e.currentTarget.style.color = '#38BDF8';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.color = '#E2E8F0';
                }}
              >
                <Search size={14} style={{ color: '#38BDF8' }} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '1.5rem 2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(15, 23, 42, 0.9)',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#64748B'
      }}>
        Google Photos Product Management & Discovery Engine Case Study • Built with React, FastAPI, SQLite & PBKDF2 Session Security
      </footer>
    </div>
  );
};
