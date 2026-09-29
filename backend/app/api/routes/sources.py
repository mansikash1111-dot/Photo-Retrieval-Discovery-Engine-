from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.database.models import Source
from app.schemas.source import SourceResponse

router = APIRouter(prefix="/sources", tags=["Sources"])

@router.get("", response_model=List[SourceResponse])
def get_sources(db: Session = Depends(get_db)):
    """
    Returns list of all configured public review sources.
    """
    sources = db.query(Source).all()
    return sources
