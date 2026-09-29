# Part 5 MVP System Architecture Specification

## Overview
The **Smart Photo Retrieval MVP** extends the existing repository architecture by introducing an AI-native retrieval engine that simulates intelligent natural-language photo retrieval over a synthetic photo library.

---

## High-Level Architecture Diagram

```
                              ┌────────────────────────┐
                              │  NATURAL LANGUAGE QUERY│
                              │ ("Find my Goa beach...")│
                              └───────────┬────────────┘
                                          │
                                          ▼
                              ┌────────────────────────┐
                              │  AI QUERY UNDERSTANDING│
                              │ (Groq LLM / Llama-3.3) │
                              └───────────┬────────────┘
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   │                                             │
                   ▼                                             ▼
        ┌─────────────────────┐                       ┌─────────────────────┐
        │  SEMANTIC RETRIEVAL │                       │  METADATA MATCHING  │
        │ (FAISS Vector Store)│                       │ (Location/Scene/Exif│
        └──────────┬──────────┘                       └──────────┬──────────┘
                   │                                             │
                   └──────────────────────┬──────────────────────┘
                                          │
                                          ▼
                              ┌────────────────────────┐
                              │ CANDIDATE RANKING ENGINE│
                              │ Final = 0.50*Sem +     │
                              │ 0.25*Meta + 0.15*Ctx + │
                              │ 0.10*AI_Rank           │
                              └───────────┬────────────┘
                                          │
                                          ▼
                              ┌────────────────────────┐
                              │ CLARIFICATION & RESULTS│
                              │ (UI Cards & Options)   │
                              └───────────┬────────────┘
                                          │
                                          ▼
                              ┌────────────────────────┐
                              │  SESSION & INSTRUMENTATION│
                              │ (RetrievalSession,     │
                              │  Feedback Tracking)    │
                              └────────────────────────┘
```

---

## Core Components

### 1. Vector Store Abstraction (`VectorStore`)
- Base class: `VectorStore` (`backend/app/mvp/vector_store/base.py`)
- Implementation: `FAISSVectorStore` (`backend/app/mvp/vector_store/faiss_store.py`)
- Interface methods: `add_documents()`, `search()`, `delete()`, `rebuild()`, `save()`, `load()`

### 2. Candidate Ranking Formula
The final candidate match score is calculated using configurable weights:
$$\text{Final Score} = (\text{Semantic Score} \times 0.50) + (\text{Metadata Score} \times 0.25) + (\text{Context Score} \times 0.15) + (\text{AI Ranking Score} \times 0.10)$$

*Note: These weights are prototype defaults and are fully configurable via environment variables in `backend/app/config.py`.*

### 3. Database Schema Extensions
- `photos`: Dummy library photos metadata
- `retrieval_sessions`: Session execution logs and status (`active`, `success`, `failed`)
- `retrieval_steps`: Step-by-step conversational user queries & AI interpretations
- `retrieval_results`: Ranked candidate scores & explanations
- `retrieval_feedback`: Tester feedback (`confirmed`, `rejected`, `refine`)
