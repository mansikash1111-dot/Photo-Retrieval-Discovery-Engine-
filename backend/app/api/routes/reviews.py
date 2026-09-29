from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc

from app.database.database import get_db
from app.database.models import Review, Source, RedditMetadata, YouTubeMetadata, CommunityMetadata
from app.schemas.review import ReviewResponse, ReviewListResponse, RedditMetadataSchema, YouTubeMetadataSchema, CommunityMetadataSchema
from app.services.export_service import ExportService

router = APIRouter(prefix="/reviews", tags=["Reviews"])

def _build_review_response(review: Review) -> ReviewResponse:
    res = ReviewResponse.model_validate(review)
    if review.source:
        res.source_name = review.source.name
        res.source_slug = review.source.slug
    if review.reddit_meta:
        res.reddit_meta = RedditMetadataSchema.model_validate(review.reddit_meta)
    if review.youtube_meta:
        res.youtube_meta = YouTubeMetadataSchema.model_validate(review.youtube_meta)
    if review.community_meta:
        res.community_meta = CommunityMetadataSchema.model_validate(review.community_meta)
    return res

@router.get("", response_model=ReviewListResponse)
def get_reviews(
    db: Session = Depends(get_db),
    source_slug: Optional[str] = Query(None, description="Filter by source slug"),
    date_from: Optional[datetime] = Query(None, description="Published on or after date"),
    date_to: Optional[datetime] = Query(None, description="Published on or before date"),
    rating: Optional[float] = Query(None, description="Filter by exact rating"),
    min_rating: Optional[float] = Query(None, description="Filter by min rating"),
    max_rating: Optional[float] = Query(None, description="Filter by max rating"),
    retrieval_related: Optional[bool] = Query(None, description="Filter by retrieval relevance"),
    search: Optional[str] = Query(None, description="Search review title or content"),
    language: Optional[str] = Query(None, description="Filter by language"),
    is_demo: Optional[bool] = Query(None, description="Filter demo vs real data"),
    sort_by: str = Query("created_at", description="Field to sort by: created_at, published_at, rating, relevance_score"),
    order: str = Query("desc", description="asc or desc"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    query = db.query(Review)

    if source_slug:
        query = query.join(Source).filter(Source.slug == source_slug)

    if date_from:
        query = query.filter(Review.published_at >= date_from)
    if date_to:
        query = query.filter(Review.published_at <= date_to)

    if rating is not None:
        query = query.filter(Review.rating == rating)
    if min_rating is not None:
        query = query.filter(Review.rating >= min_rating)
    if max_rating is not None:
        query = query.filter(Review.rating <= max_rating)

    if retrieval_related is not None:
        query = query.filter(Review.is_retrieval_related == retrieval_related)

    if language:
        query = query.filter(Review.language == language)

    if is_demo is not None:
        query = query.filter(Review.is_demo == is_demo)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Review.title.ilike(search_pattern),
                Review.content.ilike(search_pattern),
                Review.author.ilike(search_pattern),
                Review.retrieval_topic.ilike(search_pattern)
            )
        )

    # Sorting
    sort_attr = getattr(Review, sort_by, Review.created_at)
    if order.lower() == "asc":
        query = query.order_by(asc(sort_attr))
    else:
        query = query.order_by(desc(sort_attr))

    total = query.count()
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1

    reviews = query.offset((page - 1) * page_size).limit(page_size).all()
    items = [_build_review_response(r) for r in reviews]

    return ReviewListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

@router.get("/export/csv")
def export_reviews_csv(
    db: Session = Depends(get_db),
    source_slug: Optional[str] = None,
    retrieval_related: Optional[bool] = None,
    search: Optional[str] = None
):
    query = db.query(Review)
    if source_slug:
        query = query.join(Source).filter(Source.slug == source_slug)
    if retrieval_related is not None:
        query = query.filter(Review.is_retrieval_related == retrieval_related)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(Review.title.ilike(search_pattern), Review.content.ilike(search_pattern))
        )

    reviews = query.order_by(desc(Review.created_at)).all()
    csv_content = ExportService.export_reviews_to_csv(reviews)

    filename = f"reviews_export_{source_slug or 'all'}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/search", response_model=ReviewListResponse)
def search_reviews(
    q: str = Query(..., min_length=1),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    return get_reviews(db=db, search=q, page=page, page_size=page_size)

@router.get("/source/{source_slug}", response_model=ReviewListResponse)
def get_reviews_by_source(
    source_slug: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    retrieval_related: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return get_reviews(
        db=db,
        source_slug=source_slug,
        retrieval_related=retrieval_related,
        search=search,
        page=page,
        page_size=page_size
    )

@router.get("/{id}", response_model=ReviewResponse)
def get_review_by_id(id: int, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return _build_review_response(review)
