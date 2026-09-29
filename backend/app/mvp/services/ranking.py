import logging
from typing import List, Dict, Any
from app.config import settings

logger = logging.getLogger(__name__)

class RankingService:
    def __init__(self):
        self.w_semantic = settings.SEMANTIC_WEIGHT
        self.w_metadata = settings.METADATA_WEIGHT
        self.w_context = settings.CONTEXT_WEIGHT
        self.w_ai = settings.AI_RANKING_WEIGHT

    def compute_metadata_score(self, clues: Dict[str, Any], photo: Dict[str, Any]) -> Tuple_Score:
        """
        Computes overlap score between extracted clues and photo metadata.
        """
        matches = []
        score_accum = 0.0
        total_possible = 0.0

        p_keywords = [k.lower() for k in photo.get("keywords", [])]
        p_location = (photo.get("location") or "").lower()
        p_event = (photo.get("event") or "").lower()
        p_scene = [s.lower() for s in photo.get("scene", [])]
        p_activity = [a.lower() for a in photo.get("activity", [])]
        p_desc = (photo.get("description") or "").lower()

        # Check locations
        for loc in clues.get("location", []):
            total_possible += 1.0
            if loc.lower() in p_location or loc.lower() in p_desc or any(loc.lower() in k for k in p_keywords):
                score_accum += 1.0
                matches.append(loc)

        # Check events
        for evt in clues.get("event", []):
            total_possible += 1.0
            if evt.lower() in p_event or evt.lower() in p_desc or any(evt.lower() in k for k in p_keywords):
                score_accum += 1.0
                matches.append(evt)

        # Check scenes
        for sc in clues.get("scene", []):
            total_possible += 1.0
            if any(sc.lower() in s for s in p_scene) or sc.lower() in p_desc or any(sc.lower() in k for k in p_keywords):
                score_accum += 1.0
                matches.append(sc)

        # Check objects & people
        for obj in clues.get("objects", []) + clues.get("people", []):
            total_possible += 1.0
            if any(obj.lower() in k for k in p_keywords) or obj.lower() in p_desc:
                score_accum += 1.0
                matches.append(obj)

        # Check activities & visual clues
        for act in clues.get("activity", []) + clues.get("visual_clues", []):
            total_possible += 1.0
            if any(act.lower() in a for a in p_activity) or any(act.lower() in k for k in p_keywords) or act.lower() in p_desc:
                score_accum += 1.0
                matches.append(act)

        m_score = score_accum / total_possible if total_possible > 0 else 0.5
        return round(m_score, 3), list(set(matches))

    def rank_candidates(
        self,
        vector_candidates: List[Tuple[str, float, Dict[str, Any]]],
        clues: Dict[str, Any],
        ai_rankings: List[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        ai_map = {r["photo_id"]: r for r in (ai_rankings or [])}

        ranked_results = []
        has_explicit_clues = any(clues.get(k) for k in ["location", "event", "scene", "objects", "people"])

        for photo_id, sem_score, photo_meta in vector_candidates:
            meta_score, matched_clues = self.compute_metadata_score(clues, photo_meta)
            
            # Context score (weather, time of day match)
            context_score = 0.5
            if clues.get("weather") and photo_meta.get("weather") in clues.get("weather", []):
                context_score += 0.25
            if clues.get("time") and photo_meta.get("time_of_day") in clues.get("time", []):
                context_score += 0.25

            # AI Score
            ai_data = ai_map.get(photo_id, {})
            ai_score = ai_data.get("ai_score", 0.70)
            explanation = ai_data.get("explanation")

            if not explanation:
                matched_str = ", ".join(matched_clues) if matched_clues else "visual context"
                explanation = f"Possible match because this photo matches key clues: {matched_str} in {photo_meta.get('location', 'the library')}."

            # Weighted final score calculation
            final_score = (
                (sem_score * self.w_semantic) +
                (meta_score * self.w_metadata) +
                (context_score * self.w_context) +
                (ai_score * self.w_ai)
            )

            # Relevance Gate: Filter out noise matches when query clues have 0 overlap with photo metadata
            # and semantic similarity is below minimum threshold (< 0.45)
            is_relevant = True
            if has_explicit_clues and len(matched_clues) == 0 and sem_score < 0.45:
                is_relevant = False
            elif len(matched_clues) == 0 and final_score < 0.38 and sem_score < 0.40:
                is_relevant = False

            # Deduplication Check: Filter out duplicate images or identical base event descriptions
            img_key = photo_meta.get("file_path", "")
            base_desc_key = (photo_meta.get("description") or "").split("(")[0].strip()

            is_duplicate = False
            for prev in ranked_results:
                if prev["photo"].get("file_path") == img_key:
                    is_duplicate = True
                    break
                if (prev["photo"].get("description") or "").split("(")[0].strip() == base_desc_key:
                    is_duplicate = True
                    break

            if is_relevant and not is_duplicate:
                ranked_results.append({
                    "photo_id": photo_id,
                    "photo": photo_meta,
                    "semantic_score": round(sem_score, 3),
                    "metadata_score": round(meta_score, 3),
                    "context_score": round(context_score, 3),
                    "ai_score": round(ai_score, 3),
                    "final_score": round(final_score, 3),
                    "matching_clues": matched_clues,
                    "explanation": explanation
                })

        ranked_results.sort(key=lambda x: x["final_score"], reverse=True)
        for i, item in enumerate(ranked_results):
            item["rank"] = i + 1

        return ranked_results

Tuple_Score = Any
