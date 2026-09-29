import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  color?: 'blue' | 'cyan' | 'purple' | 'green' | 'amber';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  subtext,
  color = 'blue'
}) => {
  const getColorStyle = () => {
    switch (color) {
      case 'cyan': return { bg: 'rgba(6, 182, 212, 0.15)', text: '#06b6d4' };
      case 'purple': return { bg: 'rgba(139, 92, 246, 0.15)', text: '#8b5cf6' };
      case 'green': return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' };
      case 'amber': return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' };
      default: return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' };
    }
  };

  const style = getColorStyle();

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.35rem' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#fff' }}>
          {value}
        </div>
        {subtext && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
            {subtext}
          </div>
        )}
      </div>

      <div style={{
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        background: style.bg,
        color: style.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={24} />
      </div>
    </div>
  );
};
