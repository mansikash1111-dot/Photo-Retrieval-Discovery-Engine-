import pytest
from fastapi.testclient import TestClient
from app.main import app, init_db

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    init_db()

def test_health_check():
    with TestClient(app) as client:
        response = client.get("/api/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"

def test_get_sources():
    with TestClient(app) as client:
        response = client.get("/api/sources")
        assert response.status_code == 200
        sources = response.json()
        assert len(sources) >= 6
        slugs = [s["slug"] for s in sources]
        assert "google-play" in slugs
        assert "apple-app-store" in slugs
        assert "reddit" in slugs
        assert "google-photos-community" in slugs
        assert "youtube" in slugs
        assert "forums" in slugs

def test_get_reviews_pagination_and_filters():
    with TestClient(app) as client:
        response = client.get("/api/reviews?page=1&page_size=5")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data
        assert data["page"] == 1
        assert data["page_size"] == 5

def test_get_stats():
    with TestClient(app) as client:
        response = client.get("/api/reviews/stats")
        assert response.status_code == 200
        stats = response.json()
        assert "total_sources" in stats
        assert "total_collected" in stats
        assert "retrieval_related" in stats
        assert "source_breakdown" in stats

def test_export_csv():
    with TestClient(app) as client:
        response = client.get("/api/reviews/export/csv")
        assert response.status_code == 200
        assert response.headers["content-type"].startswith("text/csv")
        assert "id,source,external_id" in response.text
