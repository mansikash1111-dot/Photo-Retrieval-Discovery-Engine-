import json
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.database.database import SessionLocal, engine, Base
from app.database.models import Photo
from app.config import METADATA_DIR

def seed_photos():
    Base.metadata.create_all(bind=engine)
    metadata_file = METADATA_DIR / "photos.json"

    if not metadata_file.exists():
        print(f"Error: Metadata file {metadata_file} not found. Run generate_dummy_photos.py first.")
        return

    with open(metadata_file, "r", encoding="utf-8") as f:
        items = json.load(f)

    db = SessionLocal()
    inserted = 0
    skipped = 0
    updated = 0
    errors = 0

    try:
        for item in items:
            p_id = item["id"]
            existing = db.query(Photo).filter(Photo.id == p_id).first()

            if existing:
                # Update fields if changed
                existing.filename = item["filename"]
                existing.file_path = item["file_path"]
                existing.category = item.get("category", "travel")
                existing.date_taken = item.get("date_taken")
                existing.location = item.get("location")
                existing.event = item.get("event")
                existing.description = item["description"]
                existing.people = json.dumps(item.get("people", []))
                existing.objects = json.dumps(item.get("objects", []))
                existing.scene = json.dumps(item.get("scene", []))
                existing.activity = json.dumps(item.get("activity", []))
                existing.weather = item.get("weather")
                existing.time_of_day = item.get("time_of_day")
                existing.keywords = json.dumps(item.get("keywords", []))
                updated += 1
                skipped += 1
            else:
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
        print(f"Generated photos: {len(items)}")
        print(f"Inserted: {inserted}")
        print(f"Skipped/Updated: {skipped}")
        print(f"Errors: {errors}")

    except Exception as e:
        db.rollback()
        print(f"Error seeding photo database: {e}")
        errors += 1
    finally:
        db.close()

if __name__ == "__main__":
    seed_photos()
