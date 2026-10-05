from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, UniqueConstraint, Index
)
from sqlalchemy.orm import relationship
from app.database.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class Source(Base):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    base_url = Column(String(255), nullable=True)
    enabled = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    reviews = relationship("Review", back_populates="source", cascade="all, delete-orphan")
    jobs = relationship("CollectionJob", back_populates="source", cascade="all, delete-orphan")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=False, index=True)
    external_id = Column(String(255), nullable=False, index=True)
    title = Column(String(500), nullable=True)
    content = Column(Text, nullable=False)  # Raw, original user evidence
    author = Column(String(255), nullable=True)
    rating = Column(Float, nullable=True)
    language = Column(String(50), nullable=True)
    source_url = Column(String(1000), nullable=False)
    published_at = Column(DateTime, nullable=True)
    collected_at = Column(DateTime, default=utc_now, nullable=False)
    
    content_hash = Column(String(64), nullable=False, index=True)
    is_duplicate = Column(Boolean, default=False, nullable=False, index=True)
    
    is_retrieval_related = Column(Boolean, nullable=True, index=True)
    relevance_score = Column(Float, nullable=True)
    retrieval_topic = Column(String(100), nullable=True)
    relevance_reason = Column(Text, nullable=True)
    relevance_status = Column(String(50), default="pending", nullable=False)  # pending, classified, failed
    
    collection_method = Column(String(100), nullable=False, default="Automated Collector")
    is_demo = Column(Boolean, default=False, nullable=False, index=True)
    
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    source = relationship("Source", back_populates="reviews")
    reddit_meta = relationship("RedditMetadata", uselist=False, back_populates="review", cascade="all, delete-orphan")
    youtube_meta = relationship("YouTubeMetadata", uselist=False, back_populates="review", cascade="all, delete-orphan")
    community_meta = relationship("CommunityMetadata", uselist=False, back_populates="review", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint("source_id", "external_id", name="uix_source_external_id"),
    )

class RedditMetadata(Base):
    __tablename__ = "reddit_metadata"

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id"), unique=True, nullable=False)
    subreddit = Column(String(100), nullable=False)
    post_type = Column(String(50), nullable=False)  # 'post' or 'comment'
    post_id = Column(String(100), nullable=False)
    parent_id = Column(String(100), nullable=True)
    score = Column(Integer, default=0, nullable=False)

    review = relationship("Review", back_populates="reddit_meta")

class YouTubeMetadata(Base):
    __tablename__ = "youtube_metadata"

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id"), unique=True, nullable=False)
    video_id = Column(String(100), nullable=False)
    video_title = Column(String(500), nullable=False)
    comment_id = Column(String(100), nullable=False)
    like_count = Column(Integer, default=0, nullable=False)

    review = relationship("Review", back_populates="youtube_meta")

class CommunityMetadata(Base):
    __tablename__ = "community_metadata"

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id"), unique=True, nullable=False)
    discussion_id = Column(String(100), nullable=False)
    reply_count = Column(Integer, default=0, nullable=False)

    review = relationship("Review", back_populates="community_meta")

class CollectionJob(Base):
    __tablename__ = "collection_jobs"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=True, index=True)
    status = Column(String(50), default="pending", nullable=False)  # pending, running, completed, failed, partially_failed
    query = Column(String(255), nullable=True)
    max_items = Column(Integer, default=100, nullable=False)
    started_at = Column(DateTime, default=utc_now, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    
    items_found = Column(Integer, default=0, nullable=False)
    items_saved = Column(Integer, default=0, nullable=False)
    items_duplicate = Column(Integer, default=0, nullable=False)
    items_rejected = Column(Integer, default=0, nullable=False)
    items_classified = Column(Integer, default=0, nullable=False)
    items_ai_failed = Column(Integer, default=0, nullable=False)
    
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    source = relationship("Source", back_populates="jobs")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

# =========================================================
# PART 5: AI-NATIVE PHOTO RETRIEVAL MVP MODELS
# =========================================================

class Photo(Base):
    __tablename__ = "photos"

    id = Column(String(100), primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    category = Column(String(100), nullable=False, default="travel", index=True)
    date_taken = Column(String(50), nullable=True)
    location = Column(String(255), nullable=True)
    event = Column(String(255), nullable=True)
    description = Column(Text, nullable=False)
    
    people = Column(Text, nullable=True)      # JSON list of people
    objects = Column(Text, nullable=True)     # JSON list of objects
    scene = Column(Text, nullable=True)       # JSON list of scene attributes
    activity = Column(Text, nullable=True)    # JSON list of activities
    weather = Column(String(100), nullable=True)
    time_of_day = Column(String(100), nullable=True)
    keywords = Column(Text, nullable=True)    # JSON list of keywords
    
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    results = relationship("RetrievalResult", back_populates="photo", cascade="all, delete-orphan")

class RetrievalSession(Base):
    __tablename__ = "retrieval_sessions"

    id = Column(String(100), primary_key=True, index=True)
    started_at = Column(DateTime, default=utc_now, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    initial_query = Column(Text, nullable=False)
    final_query = Column(Text, nullable=True)
    status = Column(String(50), default="active", nullable=False, index=True)  # active, success, failed, abandoned
    result_count = Column(Integer, default=0, nullable=False)
    target_found = Column(Boolean, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    steps = relationship("RetrievalStep", back_populates="session", cascade="all, delete-orphan")
    results = relationship("RetrievalResult", back_populates="session", cascade="all, delete-orphan")
    feedback = relationship("RetrievalFeedback", back_populates="session", cascade="all, delete-orphan")

class RetrievalStep(Base):
    __tablename__ = "retrieval_steps"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), ForeignKey("retrieval_sessions.id"), nullable=False, index=True)
    step_number = Column(Integer, default=1, nullable=False)
    user_query = Column(Text, nullable=False)
    ai_interpretation = Column(Text, nullable=True)  # JSON string
    candidate_count = Column(Integer, default=0, nullable=False)
    selected_photo_id = Column(String(100), nullable=True)
    clarification_question = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    session = relationship("RetrievalSession", back_populates="steps")
    results = relationship("RetrievalResult", back_populates="step", cascade="all, delete-orphan")

class RetrievalResult(Base):
    __tablename__ = "retrieval_results"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), ForeignKey("retrieval_sessions.id"), nullable=False, index=True)
    step_id = Column(Integer, ForeignKey("retrieval_steps.id"), nullable=False, index=True)
    photo_id = Column(String(100), ForeignKey("photos.id"), nullable=False, index=True)
    rank = Column(Integer, nullable=False)
    
    semantic_score = Column(Float, default=0.0, nullable=False)
    metadata_score = Column(Float, default=0.0, nullable=False)
    ai_score = Column(Float, default=0.0, nullable=False)
    final_score = Column(Float, default=0.0, nullable=False)
    
    matching_clues = Column(Text, nullable=True)  # JSON string
    explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    session = relationship("RetrievalSession", back_populates="results")
    step = relationship("RetrievalStep", back_populates="results")
    photo = relationship("Photo", back_populates="results")

class RetrievalFeedback(Base):
    __tablename__ = "retrieval_feedback"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), ForeignKey("retrieval_sessions.id"), nullable=False, index=True)
    photo_id = Column(String(100), nullable=True)
    feedback = Column(String(50), nullable=False)  # confirmed, rejected, refine
    tester_id = Column(String(100), nullable=True)
    task_id = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    session = relationship("RetrievalSession", back_populates="feedback")
