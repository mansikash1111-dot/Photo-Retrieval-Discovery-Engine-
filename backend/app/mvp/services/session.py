import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.models import RetrievalSession, RetrievalStep, RetrievalResult, RetrievalFeedback, Photo

logger = logging.getLogger(__name__)

class SessionService:
    def __init__(self, db: Session):
        self.db = db

    def record_feedback(self, session_id: str, photo_id: Optional[str], feedback_type: str, tester_id: Optional[str] = None, task_id: Optional[str] = None) -> Dict[str, Any]:
        session = self.db.query(RetrievalSession).filter(RetrievalSession.id == session_id).first()
        if not session:
            raise ValueError(f"Retrieval session {session_id} not found")

        feedback_entry = RetrievalFeedback(
            session_id=session_id,
            photo_id=photo_id,
            feedback=feedback_type,
            tester_id=tester_id,
            task_id=task_id,
            created_at=datetime.now(timezone.utc)
        )
        self.db.add(feedback_entry)

        if feedback_type == "confirmed":
            session.status = "success"
            session.target_found = True
            session.completed_at = datetime.now(timezone.utc)
        elif feedback_type == "rejected":
            session.status = "failed"
            session.target_found = False
        elif feedback_type == "refine":
            session.status = "active"

        self.db.commit()

        return {
            "session_id": session_id,
            "status": session.status,
            "feedback": feedback_type,
            "message": "Feedback recorded successfully"
        }

    def get_analytics_summary(self) -> Dict[str, Any]:
        total_sessions = self.db.query(func.count(RetrievalSession.id)).scalar() or 0
        successful = self.db.query(func.count(RetrievalSession.id)).filter(RetrievalSession.status == "success").scalar() or 0
        failed = self.db.query(func.count(RetrievalSession.id)).filter(RetrievalSession.status == "failed").scalar() or 0
        active = self.db.query(func.count(RetrievalSession.id)).filter(RetrievalSession.status == "active").scalar() or 0

        avg_steps = self.db.query(func.avg(RetrievalStep.step_number)).scalar() or 1.0
        avg_candidates = self.db.query(func.avg(RetrievalStep.candidate_count)).scalar() or 0.0

        total_photos = self.db.query(func.count(Photo.id)).scalar() or 0

        return {
            "total_sessions": total_sessions,
            "successful_retrievals": successful,
            "failed_retrievals": failed,
            "active_sessions": active,
            "success_rate_percent": round((successful / total_sessions * 100), 1) if total_sessions > 0 else 0.0,
            "average_search_steps": round(float(avg_steps), 1),
            "average_candidates_viewed": round(float(avg_candidates), 1),
            "dummy_photo_count": total_photos
        }
