from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict

class PhotoResponse(BaseModel):
    id: str
    filename: str
    file_path: str
    category: str
    date_taken: Optional[str] = None
    location: Optional[str] = None
    event: Optional[str] = None
    description: str
    people: List[str] = []
    objects: List[str] = []
    scene: List[str] = []
    activity: List[str] = []
    weather: Optional[str] = None
    time_of_day: Optional[str] = None
    keywords: List[str] = []
    image_url: str

    model_config = ConfigDict(from_attributes=True)

class RetrievalSearchRequest(BaseModel):
    query: str
    session_id: Optional[str] = None
    step_number: int = 1

class RefinementRequest(BaseModel):
    session_id: str
    refinement_text: str
    step_number: int = 2

class ClarificationAnswerRequest(BaseModel):
    session_id: str
    selected_option: str
    step_number: int = 2

class RetrievalFeedbackRequest(BaseModel):
    session_id: str
    photo_id: Optional[str] = None
    feedback: str  # confirmed, rejected, refine
    tester_id: Optional[str] = None
    task_id: Optional[str] = None

class CandidateResultSchema(BaseModel):
    photo_id: str
    rank: int
    filename: str
    image_url: str
    date: Optional[str] = None
    location: Optional[str] = None
    event: Optional[str] = None
    description: str
    matching_clues: List[str] = []
    semantic_score: float
    metadata_score: float
    final_score: float
    explanation: str

class ClarificationSchema(BaseModel):
    needs_clarification: bool
    question: Optional[str] = None
    options: List[str] = []

class RetrievalResponse(BaseModel):
    session_id: str
    step_number: int
    user_query: str
    interpretation: Dict[str, Any]
    results: List[CandidateResultSchema]
    clarification: ClarificationSchema

class RetrievalTaskResponse(BaseModel):
    task_id: str
    query: str
    expected_clues: List[str]
    difficulty: str
    target_photo_ids: List[str]

class AnalyticsSummaryResponse(BaseModel):
    total_sessions: int
    successful_retrievals: int
    failed_retrievals: int
    active_sessions: int
    success_rate_percent: float
    average_search_steps: float
    average_candidates_viewed: float
    dummy_photo_count: int
