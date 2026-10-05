import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.database import Base, engine, SessionLocal
from app.database.models import User

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    db.query(User).filter(User.email.like("test_%@example.com")).delete(synchronize_session=False)
    db.commit()
    db.close()
    yield
    db = SessionLocal()
    db.query(User).filter(User.email.like("test_%@example.com")).delete(synchronize_session=False)
    db.commit()
    db.close()

def test_signup_success():
    payload = {
        "email": "test_signup@example.com",
        "password": "Password123",
        "full_name": "Test User"
    }
    response = client.post("/api/auth/signup", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "token" in data
    assert data["user"]["email"] == "test_signup@example.com"
    assert data["user"]["full_name"] == "Test User"

def test_signup_invalid_email():
    payload = {
        "email": "invalid_email_format",
        "password": "Password123"
    }
    response = client.post("/api/auth/signup", json=payload)
    assert response.status_code == 400
    assert "Invalid email" in response.json()["detail"]

def test_signup_weak_password():
    payload = {
        "email": "test_weak@example.com",
        "password": "123"
    }
    response = client.post("/api/auth/signup", json=payload)
    assert response.status_code == 400
    assert "at least 6 characters" in response.json()["detail"]

def test_login_success():
    # First sign up
    signup_res = client.post("/api/auth/signup", json={
        "email": "test_login_success@example.com",
        "password": "Password123",
        "full_name": "Login Tester"
    })
    assert signup_res.status_code == 201

    # Now login
    response = client.post("/api/auth/login", json={
        "email": "test_login_success@example.com",
        "password": "Password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["user"]["email"] == "test_login_success@example.com"

def test_login_invalid_password():
    client.post("/api/auth/signup", json={
        "email": "test_invalid_pwd@example.com",
        "password": "Password123"
    })
    response = client.post("/api/auth/login", json={
        "email": "test_invalid_pwd@example.com",
        "password": "WrongPassword999"
    })
    assert response.status_code == 401

def test_get_me_profile():
    signup_res = client.post("/api/auth/signup", json={
        "email": "test_profile@example.com",
        "password": "Password123"
    })
    assert signup_res.status_code == 201
    token = signup_res.json()["token"]

    response = client.get("/api/auth/me", headers={"Authorization": token})
    assert response.status_code == 200
    assert response.json()["email"] == "test_profile@example.com"
