import os
import yaml
from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent
BACKEND_DIR = Path(__file__).resolve().parent.parent

# Explicitly load .env files if present (Root directory, Backend directory, or CWD)
for env_path in [BASE_DIR / ".env", BACKEND_DIR / ".env", Path.cwd() / ".env"]:
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=True)

CONFIG_DIR = BASE_DIR / "config"
DATA_DIR = BASE_DIR / "data"
PHOTOS_DIR = DATA_DIR / "photos"
METADATA_DIR = DATA_DIR / "metadata"
TASKS_DIR = DATA_DIR / "tasks"
SEARCH_QUERIES_FILE = CONFIG_DIR / "search_queries.yaml"

class Settings(BaseSettings):
    APP_ENV: str = "development"
    DATABASE_URL: str = "sqlite:///./discovery.db"
    
    # AI Provider Configuration
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "openai/gpt-oss-20b"
    
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"
    
    # MVP Dataset Settings
    DUMMY_PHOTO_COUNT: int = 150
    
    # Ranking Weights (Implementation Defaults / Configurable Prototype Assumptions)
    SEMANTIC_WEIGHT: float = 0.50
    METADATA_WEIGHT: float = 0.25
    CONTEXT_WEIGHT: float = 0.15
    AI_RANKING_WEIGHT: float = 0.10
    
    REDDIT_CLIENT_ID: str = ""
    REDDIT_CLIENT_SECRET: str = ""
    REDDIT_USER_AGENT: str = "PhotoRetrievalDiscoveryEngine/1.0"
    
    YOUTUBE_API_KEY: str = ""
    
    GOOGLE_PLAY_ENABLED: bool = True
    APP_STORE_ENABLED: bool = True
    REDDIT_ENABLED: bool = True
    GOOGLE_COMMUNITY_ENABLED: bool = True
    YOUTUBE_ENABLED: bool = True
    FORUMS_ENABLED: bool = True

    model_config = SettingsConfigDict(
        env_file=(str(BASE_DIR / ".env"), str(BACKEND_DIR / ".env"), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

def load_search_queries() -> list[str]:
    if SEARCH_QUERIES_FILE.exists():
        with open(SEARCH_QUERIES_FILE, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
            return data.get("queries", [])
    return [
        "photo search",
        "find photos",
        "can't find photo",
        "cannot find picture",
        "search photos",
        "old photos",
        "find old photo",
        "Google Photos search",
        "Google Photos can't find photo",
        "finding a specific photo",
        "photo retrieval",
        "search memories",
        "find vacation photo"
    ]
