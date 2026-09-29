# REST API Reference Manual

Base URL: `http://localhost:8000/api`

## Core Endpoints

### 1. `GET /api/sources`
Returns all configured public collection channels.

### 2. `GET /api/reviews`
Query Parameters:
- `source_slug` (string, optional): e.g. `google-play`, `reddit`
- `retrieval_related` (boolean, optional): `true` or `false`
- `search` (string, optional): Full-text keyword search
- `rating` (float, optional): Exact rating match
- `is_demo` (boolean, optional): `true` for synthetic demo data, `false` for live data
- `page` (integer, default: 1): Page number
- `page_size` (integer, default: 20): Items per page

### 3. `GET /api/reviews/{id}`
Returns full review details including metadata and AI relevance classification.

### 4. `GET /api/reviews/stats`
Returns aggregate statistics calculated dynamically from database counts.

### 5. `GET /api/reviews/export/csv`
Downloads CSV file of filtered reviews.

### 6. `GET /api/collection/jobs`
Returns history of collector execution jobs.

### 7. `POST /api/collection/run`
Triggers collection execution for specified or all enabled sources.

### 8. `POST /api/collection/seed-demo`
Seeds realistic synthetic demo dataset for offline evaluation.
