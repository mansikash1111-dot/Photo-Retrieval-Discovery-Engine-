import pytest
from fastapi.testclient import TestClient
from app.main import app, init_db
from app.mvp.vector_store.faiss_store import FAISSVectorStore

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    init_db()

def test_vector_store_operations():
    vs = FAISSVectorStore(index_file="data/test_index.json")
    docs = [
        {"id": "doc1", "text": "Goa beach cafe coffee trip", "metadata": {"location": "Goa"}},
        {"id": "doc2", "text": "Mountain trail rainy Manali trek", "metadata": {"location": "Manali"}}
    ]
    vs.add_documents(docs)
    results = vs.search("Goa cafe")
    assert len(results) >= 1
    assert results[0][0] == "doc1"

def test_get_dummy_photos():
    with TestClient(app) as client:
        res = client.get("/api/mvp/photos?limit=5")
        assert res.status_code == 200
        items = res.json()
        assert len(items) > 0
        assert "filename" in items[0]
        assert "image_url" in items[0]

def test_get_tasks():
    with TestClient(app) as client:
        res = client.get("/api/mvp/tasks")
        assert res.status_code == 200
        tasks = res.json()
        assert len(tasks) >= 10
        assert "query" in tasks[0]

def test_retrieval_search_flow():
    with TestClient(app) as client:
        res = client.post("/api/mvp/retrieval/search", json={
            "query": "Find the photo from my Goa trip where we were sitting at a small cafe near the beach."
        })
        assert res.status_code == 200
        data = res.json()
        assert "session_id" in data
        assert "interpretation" in data
        assert "results" in data
        assert len(data["results"]) > 0
        assert "explanation" in data["results"][0]

        session_id = data["session_id"]
        target_photo_id = data["results"][0]["photo_id"]

        # Submit feedback
        fb_res = client.post("/api/mvp/feedback", json={
            "session_id": session_id,
            "photo_id": target_photo_id,
            "feedback": "confirmed"
        })
        assert fb_res.status_code == 200
        assert fb_res.json()["status"] == "success"

def test_analytics_summary():
    with TestClient(app) as client:
        res = client.get("/api/mvp/analytics/summary")
        assert res.status_code == 200
        summary = res.json()
        assert "total_sessions" in summary
        assert "successful_retrievals" in summary
        assert "dummy_photo_count" in summary
