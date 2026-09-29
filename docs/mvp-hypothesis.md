# Part 5 MVP Product Hypothesis & Traceability Document

## Product Vision & Narrative

> **Traditional Retrieval**: "What exact keywords, dates, or tags do you know?"  
> **AI-Native Retrieval**: "What do you remember about the photo memory?"

Users often remember context, situations, and visual fragments (e.g., "sitting at a cafe near the beach in Goa", "medicine on the bedside table", "dog sitting near the lake at sunset") rather than exact searchable metadata like dates, folder names, or EXIF tags.

---

## Research Evidence to MVP Capability Traceability Chain

```
Observed User Problem (Part 1 Evidence)
        ↓
Retrieval Journey Stage (Query Formulation & Ranking)
        ↓
Where Intelligence is Needed
        ↓
MVP Capability (Smart Photo Retrieval)
        ↓
Expected Behavior
        ↓
Success Signal
```

### Traceability Mapping Table

| Observed Problem (Part 1) | Retrieval Stage | Intelligence Needed | MVP Capability | Expected Behavior | Success Signal |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Users remember visual context (e.g., "red car in front of blue house") but search yields thousands of photos. | Query Formulation & Intent Extraction | Translate natural language memory into multi-concept retrieval clues | Memory-Aware Query Understanding (`QueryUnderstandingService`) | User describes remembered situation in plain text | System extracts location, scene, activity, objects, and weather clues |
| Traditional keyword queries fail for vague or multi-condition memory fragments. | Semantic Search & Candidate Ranking | Multi-signal candidate ranking combining vector similarity & metadata matching | Hybrid Semantic + Metadata Candidate Ranking (`RankingService`) | Photos are ranked by weighted semantic, metadata, and context scores | Target photo appears in top-3 candidates |
| High result counts overwhelm users when search terms are ambiguous. | Disambiguation & Refinement | Formulate non-intrusive clarification questions & conversational refinement | Interactive Clarification & Refinement Engine (`ClarificationService`) | System asks targeted clarification question or accepts refinement | Candidate list narrows from 20+ down to 1–3 strong matches |

> **Hypothesis Disclaimer**: These mappings represent prototype product hypotheses and implementation assumptions designed for Part 5 MVP testing. Final product validation will be performed in subsequent research phases (Parts 6 & 7).
