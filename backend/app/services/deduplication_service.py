import hashlib
from typing import Tuple
from sqlalchemy.orm import Session
from app.database.models import Review

class DeduplicationService:
    @staticmethod
    def generate_content_hash(source_slug: str, external_id: str, content: str) -> str:
        """
        Calculates deterministic SHA256 content hash based on:
        SHA256(normalized_source + normalized_external_id + normalized_content)
        """
        norm_source = (source_slug or "").strip().lower()
        norm_id = (external_id or "").strip().lower()
        norm_content = " ".join((content or "").strip().lower().split())
        
        raw_string = f"{norm_source}::{norm_id}::{norm_content}"
        return hashlib.sha256(raw_string.encode('utf-8')).hexdigest()

    @staticmethod
    def is_duplicate(db: Session, source_id: int, external_id: str, content_hash: str) -> Tuple[bool, str]:
        """
        Checks if a review already exists in the database by (source_id, external_id) or content_hash.
        Returns (is_duplicate: bool, reason: str).
        """
        # Check by external ID on same source
        existing_by_id = db.query(Review).filter(
            Review.source_id == source_id,
            Review.external_id == external_id
        ).first()

        if existing_by_id:
            return True, "duplicate_external_id"

        # Check by content hash (cross-post or duplicate content)
        existing_by_hash = db.query(Review).filter(
            Review.content_hash == content_hash
        ).first()

        if existing_by_hash:
            return True, "duplicate_content_hash"

        return False, "unique"
