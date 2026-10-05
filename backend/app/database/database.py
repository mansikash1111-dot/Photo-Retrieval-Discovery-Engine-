from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from pathlib import Path
from app.config import settings, BACKEND_DIR

# Support SQLite and PostgreSQL
db_url = settings.DATABASE_URL
if db_url.startswith("sqlite:///./"):
    db_file = (BACKEND_DIR / db_url.replace("sqlite:///./", "")).resolve().as_posix()
    db_url = f"sqlite:///{db_file}"
elif db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
