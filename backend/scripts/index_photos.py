import json
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.config import METADATA_DIR
from app.mvp.vector_store.faiss_store import FAISSVectorStore

def index_photos():
    metadata_file = METADATA_DIR / "photos.json"

    if not metadata_file.exists():
        print(f"Error: Metadata file {metadata_file} not found. Run generate_dummy_photos.py first.")
        return

    with open(metadata_file, "r", encoding="utf-8") as f:
        items = json.load(f)

    vector_store = FAISSVectorStore(index_file="data/vector_index.json")

    documents = []
    for item in items:
        # Create rich searchable textual representation
        people_str = ", ".join(item.get("people", []))
        scene_str = ", ".join(item.get("scene", []))
        obj_str = ", ".join(item.get("objects", []))
        activity_str = ", ".join(item.get("activity", []))
        kw_str = " ".join(item.get("keywords", []))

        searchable_text = f"""
        Location: {item.get('location', '')}.
        Event: {item.get('event', '')}.
        People: {people_str}.
        Scene: {scene_str}.
        Objects: {obj_str}.
        Activity: {activity_str}.
        Weather: {item.get('weather', '')}.
        Time: {item.get('time_of_day', '')}.
        Description: {item.get('description', '')}.
        Keywords: {kw_str}.
        """.strip()

        documents.append({
            "id": item["id"],
            "text": searchable_text,
            "metadata": item
        })

    vector_store.rebuild(documents)
    vector_store.save("data/vector_index.json")

    print(f"Successfully indexed {len(documents)} photos into FAISSVectorStore (data/vector_index.json).")

if __name__ == "__main__":
    index_photos()
