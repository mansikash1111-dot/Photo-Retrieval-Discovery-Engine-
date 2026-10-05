import json
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.database.database import SessionLocal, engine, Base
from app.database.models import Photo, RetrievalResult, RetrievalFeedback, RetrievalStep, RetrievalSession
from app.config import METADATA_DIR

def seed_photos(clear_existing: bool = True):
    Base.metadata.create_all(bind=engine)
    metadata_file = METADATA_DIR / "photos.json"

    if not metadata_file.exists():
        print(f"Error: Metadata file {metadata_file} not found. Run generate_dummy_photos.py first.")
        return

    with open(metadata_file, "r", encoding="utf-8") as f:
        items = json.load(f)

    db = SessionLocal()
    inserted = 0
    errors = 0

    try:
        if clear_existing:
            print("Removing existing photos and prior session logs...")
            db.query(RetrievalFeedback).delete()
            db.query(RetrievalResult).delete()
            db.query(RetrievalStep).delete()
            db.query(RetrievalSession).delete()
            db.query(Photo).delete()
            db.commit()

        for item in items:
            p_id = item["id"]
            photo = Photo(
                id=p_id,
                filename=item["filename"],
                file_path=item["file_path"],
                category=item.get("category", "travel"),
                date_taken=item.get("date_taken"),
                location=item.get("location"),
                event=item.get("event"),
                description=item["description"],
                people=json.dumps(item.get("people", [])),
                objects=json.dumps(item.get("objects", [])),
                scene=json.dumps(item.get("scene", [])),
                activity=json.dumps(item.get("activity", [])),
                weather=item.get("weather"),
                time_of_day=item.get("time_of_day"),
                keywords=json.dumps(item.get("keywords", []))
            )
            db.add(photo)
            inserted += 1

        db.commit()
        print(f"Successfully seeded {inserted} real photos into database.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding photo database: {e}")
        errors += 1
    finally:
        db.close()

if __name__ == "__main__":
    seed_photos(clear_existing=True)
