# Synthetic Dummy Photo Dataset Specification

## Overview
The Part 5 MVP uses an automatically generated, reproducible synthetic photo library of **150 photos** across **10 realistic scenarios** and **5 main categories**.

> **Disclaimer**: This dataset consists of programmatically generated illustrative images and synthetic metadata. It does NOT connect to or access real Google Photos account data.

---

## Dataset Breakdown

| Category | Scenarios | Photo Count | Distractor Variations Included |
| :--- | :--- | :--- | :--- |
| **Travel** | Goa beach trip, Manali mountain trek, Jaipur heritage tour | 45 photos | Afternoon cafe, sunset beach, rainy trail, street markets |
| **Family** | Family dinner reunion | 15 photos | Dining room table, indoor lighting, large group |
| **Events** | Birthday party, College graduation | 30 photos | Birthday cake, balloons, party hall, graduation gowns |
| **Pets** | Dog near lake park, Cat on couch | 30 photos | Lake sunset, park grass, fluffy cat on sofa |
| **Objects** | Medicine on bedside table, Packing luggage | 30 photos | Prescription bottles, pill bottle, packed red suitcase |

---

## Metadata Schema Example (`data/metadata/photos.json`)
```json
{
  "id": "photo_001",
  "filename": "travel_01_01.jpg",
  "file_path": "photos/travel/travel_01_01.jpg",
  "category": "travel",
  "date_taken": "2025-06-14",
  "location": "Goa, India",
  "event": "Goa trip",
  "description": "Friends sitting at a small cafe near the beach in Goa. (afternoon beach cafe view).",
  "people": ["friends"],
  "objects": ["cafe", "coffee"],
  "scene": ["beach", "cafe"],
  "activity": ["sitting", "drinking coffee"],
  "weather": "sunny",
  "time_of_day": "afternoon",
  "keywords": ["Goa", "beach", "cafe", "coffee", "friends", "trip", "ocean", "afternoon"]
}
```

---

## Retrieval Task Suite (`data/tasks/retrieval_tasks.json`)
The dataset includes **20 pre-defined retrieval tasks** with target photo mappings, expected clues, and difficulty ratings to facilitate automated user testing.

Example Task:
```json
{
  "task_id": "TASK_001",
  "query": "Find the photo from my Goa trip where we were sitting at a small cafe near the beach.",
  "expected_clues": ["Goa", "beach", "cafe", "sitting"],
  "difficulty": "medium",
  "target_photo_ids": ["photo_001", "photo_002"]
}
```

---

## Dataset Generation Pipeline
```bash
# 1. Generate synthetic JPEG images & metadata JSON
python backend/scripts/generate_dummy_photos.py

# 2. Seed photos into database
python backend/scripts/seed_photos.py

# 3. Index vector embeddings into FAISSVectorStore
python backend/scripts/index_photos.py
```
