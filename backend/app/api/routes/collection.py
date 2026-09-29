import json
from datetime import datetime
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.database import get_db
from app.database.models import CollectionJob, Source, Review, RedditMetadata, YouTubeMetadata, CommunityMetadata
from app.schemas.collection import CollectionJobResponse, CollectionRunRequest
from app.services.collection_service import CollectionService

router = APIRouter(prefix="/collection", tags=["Collection Jobs"])

def _build_job_response(job: CollectionJob) -> CollectionJobResponse:
    res = CollectionJobResponse.model_validate(job)
    if job.source:
        res.source_name = job.source.name
        res.source_slug = job.source.slug
    return res

@router.get("/jobs", response_model=List[CollectionJobResponse])
def get_collection_jobs(limit: int = 50, db: Session = Depends(get_db)):
    jobs = db.query(CollectionJob).order_by(desc(CollectionJob.created_at)).limit(limit).all()
    return [_build_job_response(j) for j in jobs]

@router.get("/jobs/{job_id}", response_model=CollectionJobResponse)
def get_collection_job_by_id(job_id: int, db: Session = Depends(get_db)):
    job = db.query(CollectionJob).filter(CollectionJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Collection job not found")
    return _build_job_response(job)

@router.post("/run", response_model=List[CollectionJobResponse])
async def trigger_collection_run(
    req: CollectionRunRequest,
    db: Session = Depends(get_db)
):
    service = CollectionService(db)
    query = req.query or "photo search"
    jobs = await service.run_collection_job(
        source_slug=req.source_slug,
        query=query,
        max_items=req.max_items
    )
    return [_build_job_response(j) for j in jobs]

@router.post("/run/{source_slug}", response_model=CollectionJobResponse)
async def trigger_source_collection(
    source_slug: str,
    query: Optional[str] = "photo search",
    max_items: int = 50,
    db: Session = Depends(get_db)
):
    service = CollectionService(db)
    jobs = await service.run_collection_job(
        source_slug=source_slug,
        query=query,
        max_items=max_items
    )
    if not jobs:
        raise HTTPException(status_code=400, detail=f"Failed to start collection for source: {source_slug}")
    return _build_job_response(jobs[0])

@router.post("/seed-demo")
def seed_demo_data(db: Session = Depends(get_db)):
    """
    Seeds realistic synthetic demo data clearly marked with is_demo=True.
    """
    base_dir = Path(__file__).resolve().parent.parent.parent.parent
    demo_file = base_dir / "demo_data" / "seed_reviews.json"
    if not demo_file.exists():
        demo_file = Path("demo_data/seed_reviews.json").resolve()
    
    if not demo_file.exists():
        raise HTTPException(status_code=404, detail=f"Seed demo data file not found at {demo_file}")

    with open(demo_file, "r", encoding="utf-8") as f:
        items = json.load(f)

    inserted = 0
    duplicates = 0

    for item in items:
        source_slug = item["source_slug"]
        source = db.query(Source).filter(Source.slug == source_slug).first()
        if not source:
            continue

        ext_id = item["external_id"]
        content_hash = item["content_hash"]

        existing = db.query(Review).filter(
            Review.source_id == source.id, Review.external_id == ext_id
        ).first()
        if existing:
            duplicates += 1
            continue

        review = Review(
            source_id=source.id,
            external_id=ext_id,
            title=item.get("title"),
            content=item["content"],
            author=item.get("author"),
            rating=item.get("rating"),
            language="en",
            source_url=item["source_url"],
            published_at=datetime.fromisoformat(item["published_at"].replace("Z", "+00:00")) if item.get("published_at") else None,
            content_hash=content_hash,
            is_duplicate=False,
            is_retrieval_related=item.get("is_retrieval_related"),
            relevance_score=item.get("relevance_score"),
            retrieval_topic=item.get("retrieval_topic"),
            relevance_reason=item.get("relevance_reason"),
            relevance_status="classified",
            collection_method="Synthetic Seed Dataset",
            is_demo=True
        )
        db.add(review)
        db.flush()

        meta = item.get("metadata", {})
        if source_slug == "reddit":
            db.add(RedditMetadata(
                review_id=review.id,
                subreddit=meta.get("subreddit", "googlephotos"),
                post_type=meta.get("post_type", "post"),
                post_id=meta.get("post_id", ext_id),
                score=meta.get("score", 10)
            ))
        elif source_slug == "youtube":
            db.add(YouTubeMetadata(
                review_id=review.id,
                video_id=meta.get("video_id", "v1"),
                video_title=meta.get("video_title", "Video Title"),
                comment_id=meta.get("comment_id", ext_id),
                like_count=meta.get("like_count", 5)
            ))
        elif source_slug == "google-photos-community":
            db.add(CommunityMetadata(
                review_id=review.id,
                discussion_id=meta.get("discussion_id", ext_id),
                reply_count=meta.get("reply_count", 3)
            ))

        inserted += 1

    db.commit()

    return {
        "status": "success",
        "inserted": inserted,
        "duplicates_skipped": duplicates,
        "message": f"Successfully seeded {inserted} demo records (DEMO DATA)."
    }
