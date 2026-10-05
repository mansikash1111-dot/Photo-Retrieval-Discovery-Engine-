export interface Source {
  id: number;
  name: string;
  slug: string;
  description?: string;
  base_url?: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface RedditMetadata {
  subreddit: string;
  post_type: string;
  post_id: string;
  parent_id?: string;
  score: number;
}

export interface YouTubeMetadata {
  video_id: string;
  video_title: string;
  comment_id: string;
  like_count: number;
}

export interface CommunityMetadata {
  discussion_id: string;
  reply_count: number;
}

export interface Review {
  id: number;
  source_id: number;
  source_name?: string;
  source_slug?: string;
  external_id: string;
  title?: string;
  content: string; // Original, unaltered user evidence
  author?: string;
  rating?: number;
  language?: string;
  source_url: string;
  published_at?: string;
  collected_at: string;
  content_hash: string;
  is_duplicate: boolean;
  is_retrieval_related?: boolean | null;
  relevance_score?: number | null;
  retrieval_topic?: string | null;
  relevance_reason?: string | null;
  relevance_status: 'pending' | 'classified' | 'failed';
  collection_method: string;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
  reddit_meta?: RedditMetadata;
  youtube_meta?: YouTubeMetadata;
  community_meta?: CommunityMetadata;
}

export interface ReviewListResponse {
  items: Review[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CollectionJob {
  id: number;
  source_id?: number;
  source_name?: string;
  source_slug?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  query?: string;
  max_items: number;
  started_at: string;
  completed_at?: string;
  items_found: number;
  items_saved: number;
  items_duplicate: number;
  items_rejected: number;
  items_classified: number;
  items_ai_failed: number;
  error_message?: string;
  created_at: string;
}

export interface StatsResponse {
  total_sources: number;
  total_collected: number;
  retrieval_related: number;
  non_retrieval_related: number;
  pending_classification: number;
  last_collection?: string;
  source_breakdown: Record<string, number>;
  retrieval_breakdown: Record<string, number>;
}

export interface FetchReviewsParams {
  source_slug?: string;
  date_from?: string;
  date_to?: string;
  rating?: number;
  min_rating?: number;
  max_rating?: number;
  retrieval_related?: boolean;
  search?: string;
  language?: string;
  is_demo?: boolean;
  sort_by?: string;
  order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export interface User {
  id: number;
  email: string;
  full_name?: string;
  created_at: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

