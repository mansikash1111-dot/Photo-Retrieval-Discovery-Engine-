import { Source, Review, ReviewListResponse, CollectionJob, StatsResponse, FetchReviewsParams } from '../types';

const API_BASE = '/api';

export async function getSources(): Promise<Source[]> {
  const res = await fetch(`${API_BASE}/sources`);
  if (!res.ok) throw new Error('Failed to fetch sources');
  return res.json();
}

export async function getStats(): Promise<StatsResponse> {
  const res = await fetch(`${API_BASE}/reviews/stats`);
  if (!res.ok) throw new Error('Failed to fetch statistics');
  return res.json();
}

export async function getReviews(params: FetchReviewsParams = {}): Promise<ReviewListResponse> {
  const query = new URLSearchParams();

  if (params.source_slug) query.set('source_slug', params.source_slug);
  if (params.date_from) query.set('date_from', params.date_from);
  if (params.date_to) query.set('date_to', params.date_to);
  if (params.rating !== undefined && params.rating !== null) query.set('rating', params.rating.toString());
  if (params.min_rating !== undefined && params.min_rating !== null) query.set('min_rating', params.min_rating.toString());
  if (params.max_rating !== undefined && params.max_rating !== null) query.set('max_rating', params.max_rating.toString());
  if (params.retrieval_related !== undefined && params.retrieval_related !== null) {
    query.set('retrieval_related', params.retrieval_related ? 'true' : 'false');
  }
  if (params.search) query.set('search', params.search);
  if (params.language) query.set('language', params.language);
  if (params.is_demo !== undefined && params.is_demo !== null) query.set('is_demo', params.is_demo ? 'true' : 'false');
  if (params.sort_by) query.set('sort_by', params.sort_by);
  if (params.order) query.set('order', params.order);
  query.set('page', (params.page || 1).toString());
  query.set('page_size', (params.page_size || 20).toString());

  const res = await fetch(`${API_BASE}/reviews?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

export async function getReviewById(id: number): Promise<Review> {
  const res = await fetch(`${API_BASE}/reviews/${id}`);
  if (!res.ok) throw new Error('Failed to fetch review details');
  return res.json();
}

export async function getCollectionJobs(): Promise<CollectionJob[]> {
  const res = await fetch(`${API_BASE}/collection/jobs`);
  if (!res.ok) throw new Error('Failed to fetch collection jobs');
  return res.json();
}

export async function triggerCollection(source_slug?: string, query?: string, max_items: number = 50): Promise<CollectionJob[]> {
  const res = await fetch(`${API_BASE}/collection/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source_slug: source_slug || null,
      query: query || 'photo search',
      max_items: max_items
    })
  });
  if (!res.ok) throw new Error('Failed to trigger collection job');
  return res.json();
}

export async function seedDemoData(): Promise<{ status: string; inserted: number; message: string }> {
  const res = await fetch(`${API_BASE}/collection/seed-demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to seed demo data');
  return res.json();
}

export function getExportCsvUrl(source_slug?: string, retrieval_related?: boolean, search?: string): string {
  const query = new URLSearchParams();
  if (source_slug) query.set('source_slug', source_slug);
  if (retrieval_related !== undefined && retrieval_related !== null) query.set('retrieval_related', retrieval_related ? 'true' : 'false');
  if (search) query.set('search', search);
  return `${API_BASE}/reviews/export/csv?${query.toString()}`;
}
