import React, { useState, useEffect } from 'react';
import { CheckCircle, HelpCircle, MapPin, Calendar, Tag, Info, Image as ImageIcon, Download } from 'lucide-react';

export interface CandidateResult {
  photo_id: string;
  rank: number;
  filename: string;
  image_url: string;
  date?: string;
  location?: string;
  event?: string;
  description: string;
  matching_clues: string[];
  semantic_score: number;
  metadata_score: number;
  final_score: number;
  explanation: string;
}

interface PhotoResultCardProps {
  candidate: CandidateResult;
  onConfirm: (photoId: string) => void;
  onRefine: () => void;
  isConfirmed?: boolean;
}

export const PhotoResultCard: React.FC<PhotoResultCardProps> = ({
  candidate,
  onConfirm,
  onRefine,
  isConfirmed: parentConfirmed = false
}) => {
  const scorePct = Math.round(candidate.final_score * 100);

  // Compute candidate image source with direct backend URL fallback
  const initialUrl = candidate.image_url.startsWith('http')
    ? candidate.image_url
    : candidate.image_url.startsWith('/')
    ? candidate.image_url
    : `/${candidate.image_url}`;

  const directBackendUrl = candidate.image_url.startsWith('http')
    ? candidate.image_url
    : `http://localhost:8000${candidate.image_url.startsWith('/') ? '' : '/'}${candidate.image_url}`;

  const [imageSrc, setImageSrc] = useState<string>(initialUrl);
  const [hasFailed, setHasFailed] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(parentConfirmed);

  useEffect(() => {
    setImageSrc(initialUrl);
    setHasFailed(false);
  }, [candidate.image_url]);

  useEffect(() => {
    if (parentConfirmed) {
      setIsConfirmed(true);
    }
  }, [parentConfirmed]);

  const handleImageError = () => {
    if (imageSrc !== directBackendUrl) {
      setImageSrc(directBackendUrl);
    } else {
      setHasFailed(true);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const downloadUrl = imageSrc;
    fetch(downloadUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = candidate.filename || 'retrieved_photo.jpg';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = candidate.filename || 'retrieved_photo.jpg';
        a.target = '_blank';
        a.click();
      });
  };

  const handleConfirmClick = () => {
    setIsConfirmed(true);
    onConfirm(candidate.photo_id);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0', position: 'relative', border: isConfirmed ? '2px solid var(--accent-green)' : undefined }}>
      {/* Rank Badge Header */}
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
        #{candidate.rank} Match
      </div>

      {/* Score / Confirmed Badge */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, background: isConfirmed ? '#10b981' : (scorePct > 80 ? 'rgba(16, 185, 129, 0.9)' : 'rgba(59, 130, 246, 0.9)'), padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {isConfirmed ? (
          <>
            <CheckCircle size={12} />
            <span>Target Confirmed</span>
          </>
        ) : (
          `${scorePct}% Match`
        )}
      </div>

      {/* Synthetic Image Preview */}
      <div style={{ width: '100%', height: '200px', overflow: 'hidden', background: '#0f172a', position: 'relative' }}>
        {!hasFailed ? (
          <img
            src={imageSrc}
            alt={candidate.description}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={handleImageError}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1e1b4b 0%, #311b92 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', textAlign: 'center' }}>
            <ImageIcon size={32} style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{candidate.event || candidate.filename}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Synthetic Prototype Photo</span>
          </div>
        )}
        {/* Subtle top shadow gradient overlay to make rank badges pop */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)', pointerEvents: 'none' }} />
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
            {candidate.event || candidate.filename}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            {candidate.location && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                <MapPin size={12} style={{ color: 'var(--accent-cyan)' }} />
                {candidate.location}
              </span>
            )}
            {candidate.date && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                <Calendar size={12} style={{ color: 'var(--accent-purple)' }} />
                {candidate.date}
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.825rem', color: 'var(--text-main)', marginBottom: '0.85rem', lineHeight: '1.4' }}>
            "{candidate.description}"
          </p>

          {/* Matched Clues Tags */}
          {candidate.matching_clues && candidate.matching_clues.length > 0 && (
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Matched Memory Clues:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {candidate.matching_clues.map((clue, i) => (
                  <span key={i} className="badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.25)', fontSize: '0.7rem' }}>
                    <Tag size={10} />
                    {clue}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Explanation Box */}
          <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.775rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1rem' }}>
            <Info size={12} style={{ display: 'inline', marginRight: '0.35rem', color: 'var(--accent-cyan)' }} />
            "{candidate.explanation}"
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {!isConfirmed ? (
            <>
              <button
                className="btn btn-success"
                onClick={handleConfirmClick}
                style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem' }}
              >
                <CheckCircle size={14} />
                <span>Yes, this is it!</span>
              </button>

              <button
                className="btn btn-secondary"
                onClick={onRefine}
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
                title="Refine retrieval with additional clues"
              >
                <HelpCircle size={14} />
                <span>Refine</span>
              </button>
            </>
          ) : (
            <button
              className="btn btn-success"
              onClick={handleDownload}
              style={{
                flex: 1,
                padding: '0.55rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer'
              }}
            >
              <Download size={16} />
              <span>Download Photo ({candidate.filename})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

