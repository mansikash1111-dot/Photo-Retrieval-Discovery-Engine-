import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { FilterBar } from '../components/FilterBar/FilterBar';
import { ReviewTable } from '../components/ReviewTable/ReviewTable';
import { ReviewDetails } from './ReviewDetails';
import { getReviews, getStats } from '../services/api';
import { Review, StatsResponse, FetchReviewsParams } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReviewsProps {
  sourceSlug?: string;
  sourceTitle?: string;
}

export const Reviews: React.FC<ReviewsProps> = ({ sourceSlug, sourceTitle }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterParams, setFilterParams] = useState<FetchReviewsParams>({
    source_slug: sourceSlug,
    page: 1,
    page_size: 15
  });

  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 15,
    total: 0,
    total_pages: 1
  });

  const loadData = async (params: FetchReviewsParams) => {
    setLoading(true);
    try {
      const s = await getStats();
      setStats(s);

      const data = await getReviews({
        ...params,
        source_slug: sourceSlug || params.source_slug
      });
      setReviews(data.items);
      setPagination({
        page: data.page,
        page_size: data.page_size,
        total: data.total,
        total_pages: data.total_pages
      });
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const updatedParams = { ...filterParams, source_slug: sourceSlug, page: 1 };
    setFilterParams(updatedParams);
    loadData(updatedParams);
  }, [sourceSlug]);

  const handleFilterChange = (newParams: FetchReviewsParams) => {
    const updated = { ...filterParams, ...newParams, page: 1 };
    setFilterParams(updated);
    loadData(updated);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.total_pages) return;
    const updated = { ...filterParams, page: newPage };
    setFilterParams(updated);
    loadData(updated);
  };

  const titleText = sourceTitle || (sourceSlug ? `${sourceSlug.replace(/-/g, ' ').toUpperCase()} Reviews` : 'All Collected Reviews');

  return (
    <Layout title={titleText} stats={stats || undefined}>
      <FilterBar
        onFilterChange={handleFilterChange}
        showSourceFilter={!sourceSlug}
        sourceSlug={sourceSlug}
      />

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fff' }}>
              Collected Evidence Records ({pagination.total})
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Page {pagination.page} of {pagination.total_pages}
            </span>
          </div>
        </div>

        <ReviewTable
          reviews={reviews}
          onSelectReview={setSelectedReview}
          sourceSlug={sourceSlug}
          loading={loading}
        />

        {/* Pagination controls */}
        {pagination.total_pages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing {((pagination.page - 1) * pagination.page_size) + 1} to {Math.min(pagination.page * pagination.page_size, pagination.total)} of {pagination.total} records
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary"
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                style={{ opacity: pagination.page <= 1 ? 0.5 : 1 }}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', padding: '0 0.5rem' }}>
                {pagination.page} / {pagination.total_pages}
              </span>

              <button
                className="btn btn-secondary"
                disabled={pagination.page >= pagination.total_pages}
                onClick={() => handlePageChange(pagination.page + 1)}
                style={{ opacity: pagination.page >= pagination.total_pages ? 0.5 : 1 }}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedReview && (
        <ReviewDetails
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </Layout>
  );
};
