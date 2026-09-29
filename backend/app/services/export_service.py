import csv
import io
from typing import List
from app.database.models import Review

class ExportService:
    @staticmethod
    def export_reviews_to_csv(reviews: List[Review]) -> str:
        output = io.StringIO()
        writer = csv.writer(output)

        # Write Header
        writer.writerow([
            "id",
            "source",
            "external_id",
            "title",
            "content",
            "author",
            "rating",
            "published_at",
            "source_url",
            "is_retrieval_related",
            "relevance_score",
            "retrieval_topic",
            "relevance_reason",
            "is_duplicate",
            "is_demo",
            "collected_at"
        ])

        # Write Data Rows
        for r in reviews:
            writer.writerow([
                r.id,
                r.source.slug if r.source else "",
                r.external_id,
                r.title or "",
                r.content,
                r.author or "",
                r.rating if r.rating is not None else "",
                r.published_at.isoformat() if r.published_at else "",
                r.source_url,
                "YES" if r.is_retrieval_related is True else ("NO" if r.is_retrieval_related is False else "PENDING"),
                r.relevance_score if r.relevance_score is not None else "",
                r.retrieval_topic or "",
                r.relevance_reason or "",
                "YES" if r.is_duplicate else "NO",
                "YES" if r.is_demo else "NO",
                r.collected_at.isoformat() if r.collected_at else ""
            ])

        return output.getvalue()
