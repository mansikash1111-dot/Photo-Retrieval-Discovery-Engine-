from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class CollectionRunRequest(BaseModel):
    source_slug: Optional[str] = Field(default=None, description="Slug of target source, or None/all for all sources")
    query: Optional[str] = Field(default=None, description="Custom search query override")
    max_items: int = Field(default=50, ge=1, le=500, description="Max items per source")

class CollectionJobResponse(BaseModel):
    id: int
    source_id: Optional[int] = None
    source_name: Optional[str] = None
    source_slug: Optional[str] = None
    status: str
    query: Optional[str] = None
    max_items: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    items_found: int
    items_saved: int
    items_duplicate: int
    items_rejected: int
    items_classified: int
    items_ai_failed: int
    error_message: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class StatsResponse(BaseModel):
    total_sources: int
    total_collected: int
    retrieval_related: int
    non_retrieval_related: int
    pending_classification: int
    last_collection: Optional[datetime] = None
    source_breakdown: dict[str, int]
    retrieval_breakdown: dict[str, int]
