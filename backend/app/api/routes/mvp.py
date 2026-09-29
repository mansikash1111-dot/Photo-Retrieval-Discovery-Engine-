import json
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Photo
from app.config import DATA_DIR, TASKS_DIR
from app.schemas.mvp import (
    PhotoResponse, RetrievalSearchRequest, RefinementRequest, ClarificationAnswerRequest,
    RetrievalFeedbackRequest, RetrievalResponse, RetrievalTaskResponse, AnalyticsSummaryResponse
)
from app.mvp.services.retrieval import RetrievalService
from app.mvp.services.session import SessionService

router = APIRouter(prefix="/mvp", tags=["AI Photo Retrieval MVP"])

def _build_photo_response(photo: Photo) -> PhotoResponse:
    return PhotoResponse(
        id=photo.id,
        filename=photo.filename,
        file_path=photo.file_path,
        category=photo.category,
        date_taken=photo.date_taken,
        location=photo.location,
        event=photo.event,
        description=photo.description,
        people=json.loads(photo.people) if photo.people else [],
        objects=json.loads(photo.objects) if photo.objects else [],
        scene=json.loads(photo.scene) if photo.scene else [],
        activity=json.loads(photo.activity) if photo.activity else [],
        weather=photo.weather,
        time_of_day=photo.time_of_day,
        keywords=json.loads(photo.keywords) if photo.keywords else [],
        image_url=f"/api/mvp/photos/file/{photo.file_path}"
    )

@router.get("/photos", response_model=List[PhotoResponse])
def get_dummy_photos(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search description or location"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    query = db.query(Photo)
    if category:
        query = query.filter(Photo.category == category)
    if search:
        pattern = f"%{search}%"
        query = query.filter(Photo.description.ilike(pattern) | Photo.location.ilike(pattern) | Photo.event.ilike(pattern))
    
    photos = query.limit(limit).all()
    return [_build_photo_response(p) for p in photos]

@router.get("/photos/{photo_id}", response_model=PhotoResponse)
def get_photo_by_id(photo_id: str, db: Session = Depends(get_db)):
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail=f"Photo {photo_id} not found")
    return _build_photo_response(photo)

@router.get("/photos/file/{file_path:path}")
def get_photo_image_file(file_path: str):
    """
    Serves generated synthetic JPEG/PNG image file.
    Resilient to leading slashes, 'photos/' prefixes, and relative path variations.
    """
    clean_path = file_path.lstrip('/')
    full_path = DATA_DIR / clean_path
    if not full_path.exists():
        full_path = DATA_DIR / "photos" / clean_path
    if not full_path.exists() and clean_path.startswith("photos/"):
        full_path = DATA_DIR / clean_path[7:]
    if not full_path.exists() and clean_path.startswith("data/"):
        full_path = DATA_DIR / clean_path[5:]
    if not full_path.exists():
        raise HTTPException(status_code=404, detail=f"Image file not found at {full_path}")
    
    return FileResponse(full_path, media_type="image/jpeg")

@router.post("/retrieval/search", response_model=RetrievalResponse)
async def execute_search(req: RetrievalSearchRequest, db: Session = Depends(get_db)):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
    
    retrieval_service = RetrievalService(db)
    result = await retrieval_service.execute_retrieval(
        query=req.query.strip(),
        session_id=req.session_id,
        step_number=req.step_number
    )
    return result

@router.post("/retrieval/refine", response_model=RetrievalResponse)
async def refine_search(req: RefinementRequest, db: Session = Depends(get_db)):
    if not req.refinement_text.strip():
        raise HTTPException(status_code=400, detail="Refinement text cannot be empty")
    
    retrieval_service = RetrievalService(db)
    # Combine original query with conversational refinement
    result = await retrieval_service.execute_retrieval(
        query=req.refinement_text.strip(),
        session_id=req.session_id,
        step_number=req.step_number
    )
    return result

@router.post("/retrieval/clarify", response_model=RetrievalResponse)
async def clarify_search(req: ClarificationAnswerRequest, db: Session = Depends(get_db)):
    retrieval_service = RetrievalService(db)
    query = f"Focus search on option: {req.selected_option}"
    result = await retrieval_service.execute_retrieval(
        query=query,
        session_id=req.session_id,
        step_number=req.step_number
    )
    return result

@router.post("/feedback")
def submit_feedback(req: RetrievalFeedbackRequest, db: Session = Depends(get_db)):
    session_service = SessionService(db)
    res = session_service.record_feedback(
        session_id=req.session_id,
        photo_id=req.photo_id,
        feedback_type=req.feedback,
        tester_id=req.tester_id,
        task_id=req.task_id
    )
    return res

@router.get("/analytics/summary", response_model=AnalyticsSummaryResponse)
def get_analytics_summary(db: Session = Depends(get_db)):
    session_service = SessionService(db)
    return session_service.get_analytics_summary()

@router.get("/tasks", response_model=List[RetrievalTaskResponse])
def get_retrieval_tasks():
    tasks_file = TASKS_DIR / "retrieval_tasks.json"
    if not tasks_file.exists():
        return []
    with open(tasks_file, "r", encoding="utf-8") as f:
        return json.load(f)
