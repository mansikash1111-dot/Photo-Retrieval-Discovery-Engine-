# System Architecture: Photo Retrieval Discovery Engine (Part 1)

## Overview
The **Photo Retrieval Discovery Engine** is a specialized PM research and product analytics platform built to collect, normalize, deduplicate, classify, and visualize publicly available user feedback concerning photo search and photo retrieval problems (specifically targeting Google Photos).

## Component Architecture

```
                                    ┌────────────────────────┐
                                    │    PUBLIC SOURCES      │
                                    │ (Play, AppStore, Reddit│
                                    │  Community, YT, Forums)│
                                    └───────────┬────────────┘
                                                │
                                                ▼
                                    ┌────────────────────────┐
                                    │   SOURCE COLLECTORS    │
                                    │ (BaseCollector Pattern)│
                                    └───────────┬────────────┘
                                                │
                                                ▼
                                    ┌────────────────────────┐
                                    │   DATA NORMALIZATION   │
                                    └───────────┬────────────┘
                                                │
                                                ▼
                                    ┌────────────────────────┐
                                    │ DETERMINISTIC DEDUP    │
                                    │  (SHA-256 Hash Engine) │
                                    └───────────┬────────────┘
                                                │
                                                ▼
                                    ┌────────────────────────┐
                                    │ DATABASE (SQLite/PG)   │
                                    │ (Raw Original Evidence)│
                                    └───────────┬────────────┘
                                                │
                                                ▼
                                    ┌────────────────────────┐
                                    │ AI RELEVANCE FILTER    │
                                    │ (Gemini Flash Provider)│
                                    └───────────┬────────────┘
                                                │
                                                ▼
                                    ┌────────────────────────┐
                                    │  FASTAPI REST SERVICE  │
                                    └───────────┬────────────┘
                                                │
                                                ▼
                                    ┌────────────────────────┐
                                    │ REACT RESEARCH DASHBOARD│
                                    │(Source-Specific Views) │
                                    └────────────────────────┘
```

## Key Architectural Principles
1. **Raw Evidence Preservation**: Original user feedback text (`content`) is stored without modification. AI inferences (retrieval topic, relevance score, reason) are kept in dedicated, isolated fields.
2. **Deterministic Deduplication**: Reviews are checked against `(source_id, external_id)` and SHA-256 hash `SHA256(source + external_id + content)` to prevent duplication across runs or cross-posting.
3. **Graceful Fault Tolerance**: Failure of a single source collector or AI API outage does not stop execution. Job statuses and errors are persisted cleanly.
4. **Source Traceability**: Every collected item retains its direct, clickable `source_url` back to the original public web page.
