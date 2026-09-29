import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database.database import engine, Base, SessionLocal
from app.database.models import Source, Review, Photo
from app.api.routes import sources, reviews, stats, collection, mvp

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("discovery_engine")

INITIAL_SOURCES = [
    {
        "name": "Google Play Store",
        "slug": "google-play",
        "description": "Publicly available Google Photos app reviews on Google Play Store",
        "base_url": "https://play.google.com/store/apps/details?id=com.google.android.apps.photos",
        "enabled": settings.GOOGLE_PLAY_ENABLED
    },
    {
        "name": "Apple App Store",
        "slug": "apple-app-store",
        "description": "Publicly available Google Photos iOS app reviews on Apple App Store",
        "base_url": "https://apps.apple.com/us/app/google-photos/id544007664",
        "enabled": settings.APP_STORE_ENABLED
    },
    {
        "name": "Reddit",
        "slug": "reddit",
        "description": "Public Reddit posts and comments from r/googlephotos, r/google, and related communities",
        "base_url": "https://www.reddit.com/r/googlephotos",
        "enabled": settings.REDDIT_ENABLED
    },
    {
        "name": "Google Photos Community",
        "slug": "google-photos-community",
        "description": "Public discussions on Google Support Community for Google Photos",
        "base_url": "https://support.google.com/photos/community",
        "enabled": settings.GOOGLE_COMMUNITY_ENABLED
    },
    {
        "name": "YouTube",
        "slug": "youtube",
        "description": "Public comments on Google Photos feature reviews and tutorial videos",
        "base_url": "https://www.youtube.com",
        "enabled": settings.YOUTUBE_ENABLED
    },
    {
        "name": "Public Forums",
        "slug": "forums",
        "description": "Public technology and product review forums discussing photo search",
        "base_url": "https://forum.digitalphotography.example",
        "enabled": settings.FORUMS_ENABLED
    }
]

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Seed sources if not exist
        for s_data in INITIAL_SOURCES:
            existing = db.query(Source).filter(Source.slug == s_data["slug"]).first()
            if not existing:
                source = Source(**s_data)
                db.add(source)
                logger.info(f"Initialized source: {s_data['name']} ({s_data['slug']})")
        db.commit()

        # Check if DB has reviews; if empty, automatically trigger demo data seed
        review_count = db.query(Review).count()
        if review_count == 0:
            logger.info("Database empty on startup. Auto-seeding initial demo dataset...")
            try:
                from app.api.routes.collection import seed_demo_data
                seed_demo_data(db)
            except Exception as e:
                logger.warning(f"Could not auto-seed demo data: {e}")

        # Check photos count for Part 5 MVP
        photo_count = db.query(Photo).count()
        if photo_count == 0:
            logger.info("Photo database empty on startup. Auto-seeding synthetic dummy photo library...")
            try:
                from scripts.seed_photos import seed_photos
                seed_photos()
            except Exception as e:
                logger.warning(f"Could not auto-seed photos: {e}")

    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Photo Retrieval Discovery Engine Backend...")
    init_db()
    yield
    logger.info("Shutting down backend...")

app = FastAPI(
    title="Photo Retrieval Discovery Engine API",
    description="Part 1 Discovery Engine & Part 5 AI-Native Smart Photo Retrieval MVP",
    version="1.0.0",
    lifespan=lifespan
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers (register stats BEFORE reviews so /reviews/stats is not captured by /reviews/{id})
app.include_router(sources.router, prefix="/api")
app.include_router(stats.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")
app.include_router(collection.router, prefix="/api")
app.include_router(mvp.router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "Photo Retrieval Discovery Engine & AI MVP", "version": "1.0.0"}
