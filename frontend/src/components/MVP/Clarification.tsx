import React from 'react';
import { HelpCircle, ChevronRight } from 'lucide-react';

interface ClarificationProps {
  question: string;
  options: string[];
  onSelectOption: (option: string) => void;
}

export const Clarification: React.FC<ClarificationProps> = ({
  question,
  options,
  onSelectOption
}) => {
  if (!question || !options || options.length === 0) return null;

  return (
    <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <HelpCircle size={18} style={{ color: 'var(--accent-amber)' }} />
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fff' }}>
          AI Retrieval Clarification
        </h3>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#fff', marginBottom: '1rem', fontWeight: 500 }}>
        "{question}"
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {options.map((opt, idx) => (
          <button
            key={idx}
            className="btn btn-secondary"
            onClick={() => onSelectOption(opt)}
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', background: 'var(--bg-card)', borderColor: 'rgba(245, 158, 11, 0.4)' }}
          >
            <span>{opt}</span>
            <ChevronRight size={13} style={{ color: 'var(--accent-amber)' }} />
          </button>
        ))}
      </div>
    </div>
  );
};
