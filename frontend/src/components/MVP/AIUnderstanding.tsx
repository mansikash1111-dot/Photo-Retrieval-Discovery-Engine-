import React from 'react';
import { Cpu, MapPin, Calendar, Compass, User, Package, Sun, CloudRain } from 'lucide-react';

interface AIUnderstandingProps {
  interpretation: {
    location?: string[];
    event?: string[];
    scene?: string[];
    activity?: string[];
    people?: string[];
    objects?: string[];
    time?: string[];
    weather?: string[];
    visual_clues?: string[];
    uncertain_clues?: string[];
  };
}

export const AIUnderstanding: React.FC<AIUnderstandingProps> = ({ interpretation }) => {
  const renderPills = (label: string, icon: React.ReactNode, items?: string[], colorClass = 'var(--accent-blue)') => {
    if (!items || items.length === 0) return null;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.04)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
        <span style={{ color: colorClass }}>{icon}</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{label}:</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{items.join(', ')}</span>
      </div>
    );
  };

  return (
    <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: 'rgba(6, 182, 212, 0.04)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
        <Cpu size={18} style={{ color: 'var(--accent-cyan)' }} />
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          AI Memory Understanding (Groq Extracted Clues)
        </h3>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
        {renderPills('Location', <MapPin size={14} />, interpretation.location, 'var(--accent-cyan)')}
        {renderPills('Event', <Calendar size={14} />, interpretation.event, 'var(--accent-purple)')}
        {renderPills('Scene', <Compass size={14} />, interpretation.scene, 'var(--accent-green)')}
        {renderPills('Activity', <Sun size={14} />, interpretation.activity, 'var(--accent-amber)')}
        {renderPills('People', <User size={14} />, interpretation.people, '#60a5fa')}
        {renderPills('Objects', <Package size={14} />, interpretation.objects, '#f472b6')}
        {renderPills('Weather / Lighting', <CloudRain size={14} />, interpretation.weather, '#a78bfa')}
      </div>

      {interpretation.uncertain_clues && interpretation.uncertain_clues.length > 0 && (
        <div style={{ marginTop: '0.65rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          <span style={{ fontWeight: 600, color: 'var(--accent-amber)' }}>Uncertain / Missing: </span>
          {interpretation.uncertain_clues.join(', ')}
        </div>
      )}
    </div>
  );
};
