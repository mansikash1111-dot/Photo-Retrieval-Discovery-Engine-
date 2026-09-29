import React, { useState } from 'react';
import { Search, Download, RotateCcw, Filter } from 'lucide-react';
import { FetchReviewsParams } from '../../types';
import { getExportCsvUrl } from '../../services/api';

interface FilterBarProps {
  onFilterChange: (params: FetchReviewsParams) => void;
  showSourceFilter?: boolean;
  sourceSlug?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onFilterChange,
  showSourceFilter = true,
  sourceSlug
}) => {
  const [search, setSearch] = useState('');
  const [selectedSource, setSelectedSource] = useState(sourceSlug || '');
  const [retrievalRelated, setRetrievalRelated] = useState<string>('all');
  const [rating, setRating] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const params: FetchReviewsParams = {
      search: search.trim() || undefined,
      source_slug: showSourceFilter ? (selectedSource || undefined) : sourceSlug,
      date_from: dateFrom ? new Date(dateFrom).toISOString() : undefined,
      date_to: dateTo ? new Date(dateTo).toISOString() : undefined,
      page: 1
    };

    if (retrievalRelated === 'yes') params.retrieval_related = true;
    if (retrievalRelated === 'no') params.retrieval_related = false;

    if (rating !== 'all') {
      params.rating = parseFloat(rating);
    }

    onFilterChange(params);
  };

  const handleReset = () => {
    setSearch('');
    setSelectedSource(sourceSlug || '');
    setRetrievalRelated('all');
    setRating('all');
    setDateFrom('');
    setDateTo('');

    onFilterChange({
      source_slug: sourceSlug,
      page: 1
    });
  };

  const exportUrl = getExportCsvUrl(
    showSourceFilter ? (selectedSource || undefined) : sourceSlug,
    retrievalRelated === 'yes' ? true : (retrievalRelated === 'no' ? false : undefined),
    search || undefined
  );

  return (
    <form onSubmit={handleApply} className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>
        {/* Search input */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
            Search Evidence Content
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="input"
              placeholder="Search keyword e.g. 'find photo', 'vacation', 'receipt'..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.4rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          </div>
        </div>

        {/* Source Filter */}
        {showSourceFilter && (
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Public Source
            </label>
            <select
              className="select"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">All Sources (All)</option>
              <option value="google-play">Google Play Store</option>
              <option value="apple-app-store">Apple App Store</option>
              <option value="reddit">Reddit</option>
              <option value="google-photos-community">Google Photos Community</option>
              <option value="youtube">YouTube</option>
              <option value="forums">Public Forums</option>
            </select>
          </div>
        )}

        {/* Retrieval Related Filter */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
            Retrieval Related
          </label>
          <select
            className="select"
            value={retrievalRelated}
            onChange={(e) => setRetrievalRelated(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="all">All Feedback</option>
            <option value="yes">Yes (Retrieval Issues)</option>
            <option value="no">No (Other Topics)</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
            Rating Filter
          </label>
          <select
            className="select"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="all">All Ratings</option>
            <option value="1">1★ Star Only</option>
            <option value="2">2★ Stars Only</option>
            <option value="3">3★ Stars Only</option>
            <option value="4">4★ Stars Only</option>
            <option value="5">5★ Stars Only</option>
          </select>
        </div>

        {/* Date From */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
            From Date
          </label>
          <input
            type="date"
            className="input"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {/* Date To */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
            To Date
          </label>
          <input
            type="date"
            className="input"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            <Filter size={14} />
            <span>Apply</span>
          </button>
          
          <button type="button" className="btn btn-secondary" onClick={handleReset} title="Reset filters">
            <RotateCcw size={14} />
          </button>

          <a href={exportUrl} download className="btn btn-secondary" title="Export filtered CSV">
            <Download size={14} />
            <span>Export</span>
          </a>
        </div>
      </div>
    </form>
  );
};
