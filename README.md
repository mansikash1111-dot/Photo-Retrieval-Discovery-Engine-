# Photo Retrieval Discovery Engine & AI-Native MVP (Google Photos PM Assignment)

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff.svg)](https://vitejs.dev/)
[![Groq AI](https://img.shields.io/badge/AI-Groq%20%2F%20Llama%203.3-f39c12.svg)](https://groq.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%20Flash-8e44ad.svg)](https://deepmind.google/technologies/gemini/)

## 1. Executive Summary & Project Vision

This repository (`google-photos-pm-assignment`) contains a unified Product Management case study project addressing **Google Photos photo retrieval problems**:

- **Part 1 — AI-Powered Discovery Engine**: Collects, normalizes, deduplicates, and visualizes public user reviews/discussions concerning photo retrieval failures across 6 public sources (Google Play, Apple App Store, Reddit, Google Support, YouTube, and Forums).
- **Part 5 — AI-Native Smart Photo Retrieval MVP**: A functional AI-native retrieval prototype that translates natural-language human memory descriptions (e.g., *"Find the photo from my Goa trip where we were sitting at a small cafe near the beach"*) into structured clues, semantic vector embeddings, candidate rankings, and conversational search refinements over an automatically generated synthetic dummy photo library.

> **Synthetic Data & API Disclaimer**: This project uses a synthetic dummy photo library generated automatically for demonstration purposes. It does NOT connect to real Google Photos API accounts or real private photographs.

---

## 2. Part 5 AI-Native Retrieval MVP Features

1. **Natural-Language Memory Query Understanding**:
   Uses **Groq API** (`llama-3.3-70b-versatile` via shared AI abstraction) to transform human memory descriptions into structured clues (`location`, `event`, `scene`, `activity`, `people`, `objects`, `weather`, `time_of_day`, `visual_clues`, `uncertain_clues`).

2. **Vector Store & Hybrid Candidate Ranking**:
   Uses `FAISSVectorStore` for semantic search combined with metadata matching and context scoring:
   $$\text{Final Score} = (\text{Semantic Score} \times 0.50) + (\text{Metadata Score} \times 0.25) + (\text{Context Score} \times 0.15) + (\text{AI Ranking Score} \times 0.10)$$

3. **Result Explanations & Match Reasons**:
   Every retrieved candidate photo card explains *why* it matched (e.g. *"Possible match because this photo shows a cafe near the beach during a Goa trip."*).

4. **Conversational Refinement & AI Clarification**:
   Supports multi-turn search refinement (e.g. adding *"around sunset"*) and displays AI clarification questions with selectable option chips when queries are ambiguous.

5. **Synthetic Photo Dataset Generation Pipeline**:
   - `backend/scripts/generate_dummy_photos.py`: Generates 150 synthetic JPEG images across 10 realistic scenarios (Goa cafe, Manali mountain trek, dog near lake sunset, medicine on bedside table, birthday balloons, etc.) with structured `photos.json` and 20 `retrieval_tasks.json`.
   - `backend/scripts/seed_photos.py`: Inserts photos into SQLite/PostgreSQL `photos` database table.
   - `backend/scripts/index_photos.py`: Indexes vector embeddings into `FAISSVectorStore` (`data/vector_index.json`).

6. **Retrieval Session Instrumentation & Prototype Analytics**:
   Logs search steps, user selections, and confirmation feedback (`confirmed`, `rejected`, `refine`) to capture session analytics for Part 6/7 testing.

---

## 3. Technology Stack

- **Backend**: Python 3.10+, FastAPI, SQLAlchemy 2.0 ORM, Alembic Migrations, Pydantic v2, PyTest, `httpx`, `groq`, `pillow`, `numpy`, `google-play-scraper`.
- **AI Providers**: Groq API (`GROQ_API_KEY`, `GROQ_MODEL=llama-3.3-70b-versatile`) & Gemini Flash (`GEMINI_API_KEY`) via `BaseAIProvider` with rule-based heuristic fallbacks.
- **Vector Index**: `FAISSVectorStore` with cosine similarity vector indexing.
- **Database**: SQLite (default for zero-config local dev) or PostgreSQL via `DATABASE_URL`.
- **Frontend**: React 18, TypeScript 5, Vite, Vanilla Modern CSS (glassmorphism cards, responsive grid), Lucide Icons.

---

## 4. Project Directory Structure

```
google-photos-pm-assignment/
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI entrypoint & auto-startup
│   │   ├── config.py                  # App settings & search queries
│   │   ├── api/routes/
│   │   │   ├── sources.py             # Part 1: GET /api/sources
│   │   │   ├── reviews.py             # Part 1: GET /api/reviews, /export/csv
│   │   │   ├── stats.py               # Part 1: GET /api/reviews/stats
│   │   │   ├── collection.py          # Part 1: POST /api/collection/run
│   │   │   └── mvp.py                 # Part 5: /api/mvp/retrieval, /photos, /feedback, /analytics
│   │   ├── database/
│   │   │   ├── database.py            # SQLAlchemy engine & session setup
│   │   │   └── models.py              # Part 1 Review & Part 5 Photo/Session models
│   │   ├── collectors/                # 6 Part 1 public review collectors
│   │   ├── ai/
│   │   │   ├── base.py                # BaseAIProvider interface
│   │   │   ├── groq.py                # Groq API provider (Llama-3.3-70b)
│   │   │   ├── gemini.py              # Gemini Flash provider
│   │   │   └── prompts/               # Structured JSON prompts
│   │   └── mvp/
│   │       ├── vector_store/          # VectorStore & FAISSVectorStore
│   │       └── services/              # Query understanding, retrieval, ranking, clarification, sessions
│   ├── scripts/
│   │   ├── generate_dummy_photos.py   # Generates 150 synthetic photos & 20 tasks
│   │   ├── seed_photos.py             # Seeds photos into SQLite/PG database
│   │   └── index_photos.py            # Indexes vector embeddings into FAISS store
│   ├── tests/
│   │   ├── test_api.py                # Part 1 API tests
│   │   ├── test_hashing.py            # Part 1 SHA-256 deduplication tests
│   │   ├── test_relevance.py          # Relevance classifier tests
│   │   └── test_mvp.py                # Part 5 MVP API, retrieval, & vector tests
│   ├── requirements.txt
│   └── conftest.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/                # Sidebar navigation & Top Header
│   │   │   ├── MVP/                   # SearchInput, AIUnderstanding, PhotoResultCard, ResultsGrid, Clarification
│   │   │   └── ReviewTable/           # Part 1 review tables
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx          # Part 1 discovery dashboard
│   │   │   ├── Reviews.tsx            # Part 1 review pages
│   │   │   ├── MVP/RetrievalPage.tsx  # Part 5 Smart Photo Retrieval page (/mvp/retrieval)
│   │   │   └── MVP/AnalyticsPage.tsx  # Part 5 Prototype Analytics page (/mvp/analytics)
│   │   ├── services/api.ts
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
├── data/
│   ├── photos/                        # Synthetic JPEG photos by category
│   ├── metadata/photos.json           # Structured photo metadata
│   ├── tasks/retrieval_tasks.json     # 20 pre-defined retrieval tasks
│   └── vector_index.json              # Vector index store
├── docs/                              # Research & MVP Architecture documentation
├── .env.example
├── docker-compose.yml
└── README.md
```

---

---

## 5. Local Setup & Quick Start Guide

### Step 1: Environment Setup
Copy `.env.example` to create `.env`:
```bash
cp .env.example .env
```

Configure your environment variables in `.env`:
```env
APP_ENV=development
DATABASE_URL=sqlite:///./discovery.db

# Groq API for Part 5 MVP Query Understanding & Ranking
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Gemini API for Part 1 Review Classification
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Synthetic Dataset Settings
DUMMY_PHOTO_COUNT=150
```

---

### Step 2: Generate & Seed Synthetic Photo Dataset
Run the python setup scripts to initialize synthetic photo assets, database entries, and vector embeddings:
```bash
# 1. Generate 150 synthetic JPEG photos, metadata JSON, and 20 retrieval tasks
python backend/scripts/generate_dummy_photos.py

# 2. Seed photo records into SQLite database
python backend/scripts/seed_photos.py

# 3. Build & index vector embeddings into FAISSVectorStore
python backend/scripts/index_photos.py
```

---

### Step 3: Run Backend API Server
1. Install Python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
2. Start the FastAPI backend server:
   ```bash
   python -m uvicorn app.main:app --app-dir backend --reload --port 8000
   ```
- **Backend Service URL**: `http://localhost:8000`
- **Interactive Swagger Documentation**: `http://localhost:8000/docs`

---

### Step 4: Run Frontend Development Application
Open a new terminal window/tab:
```bash
# Navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Start Vite development server
npm run dev
```
- **Frontend Dashboard URL**: `http://localhost:3000`
- **Smart Photo Retrieval UI**: `http://localhost:3000/mvp/retrieval`
- **Prototype Analytics Dashboard**: `http://localhost:3000/mvp/analytics`

---

## 6. Running Automated Tests
Run the PyTest test suite (14 passing test cases):
```bash
pytest backend
```
Test coverage includes:
- SHA-256 content deduplication
- Gemini Flash & Groq JSON response parsing
- Part 1 Review collection APIs & CSV export
- Part 5 FAISS vector store operations, retrieval search pipeline, feedback recording, and prototype analytics.

---

## 7. Example Retrieval Memory Queries

Try searching these natural-language memory queries in `/mvp/retrieval`:
1. *"Find the photo from my Goa trip where we were sitting at a small cafe near the beach."*
2. *"Find the picture of my dog near the lake during sunset."*
3. *"Find the birthday photo with balloons and cake."*
4. *"Find the medicine photo I took when I was sick last year."*
5. *"Find the rainy photo from my mountain trek trip in Manali."*

---

## 8. Documentation References
- [docs/mvp-hypothesis.md](file:///c:/Users/hp/Desktop/Google%20Photos/docs/mvp-hypothesis.md): Research problem to MVP capability hypothesis mapping.
- [docs/mvp-architecture.md](file:///c:/Users/hp/Desktop/Google%20Photos/docs/mvp-architecture.md): Full Part 5 system architecture.
- [docs/dummy-dataset.md](file:///c:/Users/hp/Desktop/Google%20Photos/docs/dummy-dataset.md): Synthetic dummy dataset & retrieval task suite.
- [docs/architecture.md](file:///c:/Users/hp/Desktop/Google%20Photos/docs/architecture.md): Part 1 Discovery Engine architecture.
- [docs/api.md](file:///c:/Users/hp/Desktop/Google%20Photos/docs/api.md): REST API reference.
