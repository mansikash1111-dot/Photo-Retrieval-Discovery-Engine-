import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from app.database.models import (
    Source, Review, CollectionJob, RedditMetadata, YouTubeMetadata, CommunityMetadata
)
from app.collectors.base import BaseCollector
from app.collectors.google_play import GooglePlayCollector
from app.collectors.app_store import AppStoreCollector
from app.collectors.reddit import RedditCollector
from app.collectors.google_community import GooglePhotosCommunityCollector
from app.collectors.youtube import YouTubeCollector
from app.collectors.forums import ForumCollector
from app.services.deduplication_service import DeduplicationService
from app.services.relevance_service import RelevanceService

logger = logging.getLogger(__name__)

class CollectionService:
    def __init__(self, db: Session):
        self.db = db
        self.relevance_service = RelevanceService()
        self.collectors: Dict[str, BaseCollector] = {
            "google-play": GooglePlayCollector(),
            "apple-app-store": AppStoreCollector(),
            "reddit": RedditCollector(),
            "google-photos-community": GooglePhotosCommunityCollector(),
            "youtube": YouTubeCollector(),
            "forums": ForumCollector()
        }

    def get_collector(self, slug: str) -> Optional[BaseCollector]:
        return self.collectors.get(slug)

    async def run_collection_job(self, source_slug: Optional[str] = None, query: str = "photo search", max_items: int = 50) -> List[CollectionJob]:
        """
        Executes collection job(s). If source_slug is provided, runs for that source.
        If None, runs independently across all enabled sources.
        """
        jobs = []
        target_sources = []

        if source_slug:
            src = self.db.query(Source).filter(Source.slug == source_slug).first()
            if src:
                target_sources.append(src)
        else:
            target_sources = self.db.query(Source).filter(Source.enabled == True).all()

        for source in target_sources:
            job = CollectionJob(
                source_id=source.id,
                status="running",
                query=query,
                max_items=max_items,
                started_at=datetime.now(timezone.utc)
            )
            self.db.add(job)
            self.db.commit()
            self.db.refresh(job)

            try:
                await self._collect_for_source(job, source, query, max_items)
                job.status = "completed"
            except Exception as e:
                logger.error(f"Collection job {job.id} for source {source.slug} failed: {str(e)}", exc_info=True)
                job.status = "failed"
                job.error_message = str(e)
            
            job.completed_at = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(job)
            jobs.append(job)

        return jobs

    async def _collect_for_source(self, job: CollectionJob, source: Source, query: str, max_items: int):
        collector = self.get_collector(source.slug)
        if not collector:
            raise ValueError(f"No collector configured for source {source.slug}")

        items = await collector.collect(query=query, limit=max_items)
        job.items_found = len(items)
        self.db.commit()

        for raw_item in items:
            ext_id = raw_item["external_id"]
            content = raw_item["content"]
            
            # Generate deterministic SHA256 content hash
            content_hash = DeduplicationService.generate_content_hash(
                source.slug, ext_id, content
            )

            # Check deduplication
            is_dup, dup_reason = DeduplicationService.is_duplicate(
                self.db, source.id, ext_id, content_hash
            )

            if is_dup:
                job.items_duplicate += 1
                self.db.commit()
                continue

            # Classify relevance using Gemini Flash AI
            classification = await self.relevance_service.classify_review(content)
            if classification["relevance_status"] == "classified":
                job.items_classified += 1
            else:
                job.items_ai_failed += 1

            # Save review
            review = Review(
                source_id=source.id,
                external_id=ext_id,
                title=raw_item.get("title"),
                content=content,
                author=raw_item.get("author"),
                rating=raw_item.get("rating"),
                language=raw_item.get("language", "en"),
                source_url=raw_item.get("source_url", source.base_url or ""),
                published_at=raw_item.get("published_at"),
                content_hash=content_hash,
                is_duplicate=False,
                is_retrieval_related=classification.get("is_retrieval_related"),
                relevance_score=classification.get("relevance_score"),
                retrieval_topic=classification.get("retrieval_topic"),
                relevance_reason=classification.get("relevance_reason"),
                relevance_status=classification.get("relevance_status", "pending"),
                collection_method=f"Automated Collector ({collector.__class__.__name__})",
                is_demo=False
            )
            self.db.add(review)
            self.db.flush()  # assign review.id

            # Save source-specific metadata
            meta = raw_item.get("metadata", {})
            if source.slug == "reddit":
                rmeta = RedditMetadata(
                    review_id=review.id,
                    subreddit=meta.get("subreddit", "googlephotos"),
                    post_type=meta.get("post_type", "post"),
                    post_id=meta.get("post_id", ext_id),
                    parent_id=meta.get("parent_id"),
                    score=meta.get("score", 0)
                )
                self.db.add(rmeta)
            elif source.slug == "youtube":
                ymeta = YouTubeMetadata(
                    review_id=review.id,
                    video_id=meta.get("video_id", "video_1"),
                    video_title=meta.get("video_title", "Google Photos Video"),
                    comment_id=meta.get("comment_id", ext_id),
                    like_count=meta.get("like_count", 0)
                )
                self.db.add(ymeta)
            elif source.slug == "google-photos-community":
                cmeta = CommunityMetadata(
                    review_id=review.id,
                    discussion_id=meta.get("discussion_id", ext_id),
                    reply_count=meta.get("reply_count", 0)
                )
                self.db.add(cmeta)

            job.items_saved += 1
            self.db.commit()
