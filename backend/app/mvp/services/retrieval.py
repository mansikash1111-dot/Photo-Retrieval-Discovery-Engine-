import json
import logging
import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.database.models import Photo, RetrievalSession, RetrievalStep, RetrievalResult, RetrievalFeedback
from app.mvp.vector_store.faiss_store import FAISSVectorStore
from app.mvp.services.query_understanding import QueryUnderstandingService
from app.mvp.services.ranking import RankingService
from app.mvp.services.clarification import ClarificationService
from app.ai.groq import GroqProvider

logger = logging.getLogger(__name__)

class RetrievalService:
    def __init__(self, db: Session):
        self.db = db
        self.ai_provider = GroqProvider()
        self.query_service = QueryUnderstandingService(self.ai_provider)
        self.ranking_service = RankingService()
        self.clarification_service = ClarificationService(self.ai_provider)
        
        self.vector_store = FAISSVectorStore()
        self.vector_store.load("data/vector_index.json")

    async def execute_retrieval(self, query: str, session_id: Optional[str] = None, step_number: int = 1) -> Dict[str, Any]:
        """
        Executes complete AI-native photo retrieval pipeline.
        """
        # 1. Session Management
        if not session_id:
            session_id = f"sess_{uuid.uuid4().hex[:10]}"
            session = RetrievalSession(
                id=session_id,
                started_at=datetime.now(timezone.utc),
                initial_query=query,
                status="active"
            )
            self.db.add(session)
            self.db.commit()
        else:
            session = self.db.query(RetrievalSession).filter(RetrievalSession.id == session_id).first()
            if session:
                session.final_query = query
                self.db.commit()

        # 2. Query Understanding (Extract Clues)
        clues = await self.query_service.extract_clues(query)

        # 3. Vector Search (Semantic Retrieval)
        raw_vector_matches = self.vector_store.search(query, top_k=15)
        
        # Enrich metadata from DB photos
        vector_candidates = []
        for photo_id, sem_score, meta in raw_vector_matches:
            db_photo = self.db.query(Photo).filter(Photo.id == photo_id).first()
            if db_photo:
                photo_dict = {
                    "id": db_photo.id,
                    "filename": db_photo.filename,
                    "file_path": db_photo.file_path,
                    "category": db_photo.category,
                    "date_taken": db_photo.date_taken,
                    "location": db_photo.location,
                    "event": db_photo.event,
                    "description": db_photo.description,
                    "people": json.loads(db_photo.people) if db_photo.people else [],
                    "objects": json.loads(db_photo.objects) if db_photo.objects else [],
                    "scene": json.loads(db_photo.scene) if db_photo.scene else [],
                    "activity": json.loads(db_photo.activity) if db_photo.activity else [],
                    "weather": db_photo.weather,
                    "time_of_day": db_photo.time_of_day,
                    "keywords": json.loads(db_photo.keywords) if db_photo.keywords else []
                }
                vector_candidates.append((photo_id, sem_score, photo_dict))

        # 4. AI Candidate Ranking
        ai_rankings = await self.ai_provider.rank_candidates(
            query=query,
            clues=clues,
            candidates=[c[2] for c in vector_candidates]
        )
        rankings_list = ai_rankings.get("rankings", []) if ai_rankings else []

        ranked_results = self.ranking_service.rank_candidates(
            vector_candidates=vector_candidates,
            clues=clues,
            ai_rankings=rankings_list
        )

        # 5. Clarification Engine Evaluation
        clarification = await self.clarification_service.evaluate_clarification(
            query=query,
            candidates=[r["photo"] for r in ranked_results],
            clues=clues
        )

        # 6. Save Step & Results to Database
        step = RetrievalStep(
            session_id=session_id,
            step_number=step_number,
            user_query=query,
            ai_interpretation=json.dumps(clues),
            candidate_count=len(ranked_results),
            clarification_question=clarification.get("question") if clarification.get("needs_clarification") else None
        )
        self.db.add(step)
        self.db.commit()
        self.db.refresh(step)

        for res in ranked_results[:10]:
            r_entry = RetrievalResult(
                session_id=session_id,
                step_id=step.id,
                photo_id=res["photo_id"],
                rank=res["rank"],
                semantic_score=res["semantic_score"],
                metadata_score=res["metadata_score"],
                ai_score=res["ai_score"],
                final_score=res["final_score"],
                matching_clues=json.dumps(res["matching_clues"]),
                explanation=res["explanation"]
            )
            self.db.add(r_entry)

        session.result_count = len(ranked_results)
        self.db.commit()

        # Build response payload
        return {
            "session_id": session_id,
            "step_number": step_number,
            "user_query": query,
            "interpretation": clues,
            "results": [
                {
                    "photo_id": r["photo_id"],
                    "rank": r["rank"],
                    "filename": r["photo"]["filename"],
                    "image_url": f"/api/mvp/photos/file/{r['photo']['file_path']}",
                    "date": r["photo"]["date_taken"],
                    "location": r["photo"]["location"],
                    "event": r["photo"]["event"],
                    "description": r["photo"]["description"],
                    "matching_clues": r["matching_clues"],
                    "semantic_score": r["semantic_score"],
                    "metadata_score": r["metadata_score"],
                    "final_score": r["final_score"],
                    "explanation": r["explanation"]
                }
                for r in ranked_results[:10]
            ],
            "clarification": clarification
        }
