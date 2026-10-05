import sys
import os

# Add backend directory to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database.database import SessionLocal, Base, engine
from app.database.models import User
from app.utils.security import hash_password

def seed_demo_user():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        email = "demo@googlephotos.com"
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"[+] Demo user already exists: {email}")
            return

        demo_user = User(
            email=email,
            hashed_password=hash_password("Password123"),
            full_name="Demo User"
        )
        db.add(demo_user)
        db.commit()
        print(f"[✓] Demo user created successfully!")
        print(f"    Email: {email}")
        print(f"    Password: Password123")
    except Exception as e:
        print(f"[!] Failed to seed demo user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_demo_user()
