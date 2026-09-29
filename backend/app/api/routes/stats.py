from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.database.models import Source, Review, CollectionJob
from app.schemas.collection import StatsResponse

router = APIRouter(prefix="/reviews/stats", tags=["Statistics"])

@router.get("", response_model=StatsResponse)
def get_collection_stats(db: Session = Depends(get_db)):
    """
    Returns aggregated statistics calculated from actual database values.
    """
    total_sources = db.query(func.count(Source.id)).scalar() or 0
    total_collected = db.query(func.count(Review.id)).scalar() or 0
    
    retrieval_related = db.query(func.count(Review.id)).filter(Review.is_retrieval_related == True).scalar() or 0
    non_retrieval_related = db.query(func.count(Review.id)).filter(Review.is_retrieval_related == False).scalar() or 0
    pending_classification = db.query(func.count(Review.id)).filter(Review.is_retrieval_related.is_(None)).scalar() or 0
    
    last_job = db.query(CollectionJob).order_by(CollectionJob.created_at.desc()).first()
    last_collection = last_job.completed_at or last_job.started_at if last_job else None

    # Source breakdown
    source_counts = db.query(
        Source.slug, func.count(Review.id)
    ).outerjoin(Review, Source.id == Review.source_id).group_by(Source.slug).all()
    
    source_breakdown = {slug: count for slug, count in source_counts}

    # Retrieval related breakdown per source
    retrieval_counts = db.query(
        Source.slug, func.count(Review.id)
    ).join(Review, Source.id == Review.source_id).filter(Review.is_retrieval_related == True).group_by(Source.slug).all()
    
    retrieval_breakdown = {slug: 0 for slug in source_breakdown.keys()}
    for slug, count in retrieval_counts:
        retrieval_breakdown[slug] = count

    return StatsResponse(
        total_sources=total_sources,
        total_collected=total_collected,
        retrieval_related=retrieval_related,
        non_retrieval_related=non_retrieval_related,
        pending_classification=pending_classification,
        last_collection=last_collection,
        source_breakdown=source_breakdown,
        retrieval_breakdown=retrieval_breakdown
    )
