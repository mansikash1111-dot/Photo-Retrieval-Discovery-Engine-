from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class RedditMetadataSchema(BaseModel):
    subreddit: str
    post_type: str
    post_id: str
    parent_id: Optional[str] = None
    score: int = 0

    model_config = ConfigDict(from_attributes=True)

class YouTubeMetadataSchema(BaseModel):
    video_id: str
    video_title: str
    comment_id: str
    like_count: int = 0

    model_config = ConfigDict(from_attributes=True)

class CommunityMetadataSchema(BaseModel):
    discussion_id: str
    reply_count: int = 0

    model_config = ConfigDict(from_attributes=True)

class ReviewBase(BaseModel):
    external_id: str
    title: Optional[str] = None
    content: str
    author: Optional[str] = None
    rating: Optional[float] = None
    language: Optional[str] = "en"
    source_url: str
    published_at: Optional[datetime] = None
    collection_method: str = "Automated Collector"
    is_demo: bool = False

class ReviewCreate(ReviewBase):
    source_slug: str
    reddit_meta: Optional[RedditMetadataSchema] = None
    youtube_meta: Optional[YouTubeMetadataSchema] = None
    community_meta: Optional[CommunityMetadataSchema] = None

class RelevanceClassificationResponse(BaseModel):
    is_retrieval_related: bool
    relevance_score: float = Field(ge=0.0, le=1.0)
    retrieval_topic: str
    reason: str

class ReviewResponse(ReviewBase):
    id: int
    source_id: int
    source_name: Optional[str] = None
    source_slug: Optional[str] = None
    collected_at: datetime
    content_hash: str
    is_duplicate: bool
    is_retrieval_related: Optional[bool] = None
    relevance_score: Optional[float] = None
    retrieval_topic: Optional[str] = None
    relevance_reason: Optional[str] = None
    relevance_status: str
    created_at: datetime
    updated_at: datetime
    reddit_meta: Optional[RedditMetadataSchema] = None
    youtube_meta: Optional[YouTubeMetadataSchema] = None
    community_meta: Optional[CommunityMetadataSchema] = None

    model_config = ConfigDict(from_attributes=True)

class ReviewListResponse(BaseModel):
    items: list[ReviewResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
