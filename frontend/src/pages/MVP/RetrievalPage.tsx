import React, { useState } from 'react';
import { Layout } from '../../components/Layout/Layout';
import { SearchInput } from '../../components/MVP/SearchInput';
import { AIUnderstanding } from '../../components/MVP/AIUnderstanding';
import { ResultsGrid } from '../../components/MVP/ResultsGrid';
import { Clarification } from '../../components/MVP/Clarification';
import { RefinementInput } from '../../components/MVP/RefinementInput';
import { CandidateResult } from '../../components/MVP/PhotoResultCard';
import { AlertCircle, CheckCircle, Download } from 'lucide-react';

export const RetrievalPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stepNumber, setStepNumber] = useState(1);
  const [interpretation, setInterpretation] = useState<any>(null);
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [clarification, setClarification] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [confirmedSuccess, setConfirmedSuccess] = useState(false);
  const [confirmedPhoto, setConfirmedPhoto] = useState<CandidateResult | null>(null);

  const executeSearch = async (searchQuery: string, resetSession: boolean = false) => {
    setLoading(true);
    setConfirmedSuccess(false);
    setConfirmedPhoto(null);
    try {
      const activeSession = resetSession ? null : sessionId;
      const nextStep = resetSession ? 1 : stepNumber + 1;

      const res = await fetch('/api/mvp/retrieval/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          session_id: activeSession,
          step_number: resetSession ? 1 : nextStep
        })
      });

      if (!res.ok) throw new Error('Retrieval request failed');
      const data = await res.json();

      setSessionId(data.session_id);
      setStepNumber(data.step_number);
      setInterpretation(data.interpretation);
      setResults(data.results);
      setClarification(data.clarification);
    } catch (err) {
      console.error('Error executing retrieval search:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInitialSearch = () => {
    executeSearch(query, true);
  };

  const handleRefine = (refinementText: string) => {
    const combinedQuery = `${query} (${refinementText})`;
    setQuery(combinedQuery);
    executeSearch(combinedQuery, false);
  };

  const handleClarificationOption = (option: string) => {
    const combinedQuery = `${query} - ${option}`;
    setQuery(combinedQuery);
    executeSearch(combinedQuery, false);
  };

  const handleConfirmPhoto = async (photoId: string) => {
    if (!sessionId) return;
    const target = results.find(r => r.photo_id === photoId) || null;
    setConfirmedPhoto(target);
    try {
      await fetch('/api/mvp/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          photo_id: photoId,
          feedback: 'confirmed'
        })
      });
      setConfirmedSuccess(true);
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };

  return (
    <Layout title="Smart Photo Retrieval (AI-Native MVP)">
      {/* Disclaimer Banner */}
      <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#93c5fd' }}>
        <AlertCircle size={18} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
        <div>
          <strong>Prototype Photo Library:</strong> This prototype uses synthetic dummy photos generated automatically and does NOT connect to your real Google Photos account.
        </div>
      </div>

      {/* Confirmed Target Success Notification */}
      {confirmedSuccess && (
        <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#34d399' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CheckCircle size={20} />
            <div>
              <strong style={{ fontSize: '0.95rem' }}>Target Photo Confirmed!</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Session recorded successfully as a successful retrieval task.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {confirmedPhoto && (
              <button
                className="btn btn-success"
                onClick={() => {
                  const url = confirmedPhoto.image_url;
                  fetch(url)
                    .then((res) => res.blob())
                    .then((blob) => {
                      const blobUrl = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = blobUrl;
                      a.download = confirmedPhoto.filename || 'retrieved_photo.jpg';
                      a.click();
                    })
                    .catch(() => {
                      window.open(url, '_blank');
                    });
                }}
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Download size={14} />
                <span>Download Photo</span>
              </button>
            )}
            <button className="btn btn-secondary" onClick={() => { setQuery(''); setInterpretation(null); setResults([]); setConfirmedSuccess(false); setConfirmedPhoto(null); }}>
              Start New Search
            </button>
          </div>
        </div>
      )}

      {/* Main Natural Language Search Input */}
      <SearchInput
        query={query}
        setQuery={setQuery}
        onSearch={handleInitialSearch}
        loading={loading}
      />

      {/* AI Memory Understanding Breakdown */}
      {interpretation && (
        <AIUnderstanding interpretation={interpretation} />
      )}

      {/* AI Clarification Prompt if candidate count is high or query ambiguous */}
      {results.length > 0 && clarification && clarification.needs_clarification && (
        <Clarification
          question={clarification.question}
          options={clarification.options}
          onSelectOption={handleClarificationOption}
        />
      )}

      {/* Candidate Results Grid */}
      <ResultsGrid
        candidates={results}
        query={query}
        onConfirm={handleConfirmPhoto}
        onRefine={() => {
          const el = document.getElementById('refinement-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        loading={loading}
      />

      {/* Conversational Refinement Bar */}
      {results.length > 0 && (
        <div id="refinement-section">
          <RefinementInput
            onRefine={handleRefine}
            loading={loading}
          />
        </div>
      )}
    </Layout>
  );
};
