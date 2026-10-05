import json
import logging
import os
import re
import httpx
from typing import Optional, Dict, Any, List
from app.config import settings
from app.ai.base import BaseAIProvider
from app.ai.prompts import RELEVANCE_CLASSIFICATION_PROMPT

logger = logging.getLogger(__name__)

# Keywords for heuristic/rule-based pre-filtering when AI is offline/unconfigured
RETRIEVAL_KEYWORDS = [
    "search", "find", "locate", "query", "missing", "lost photo", "old photo",
    "can't find", "cannot find", "unable to find", "remember", "memory", "vacation",
    "retrieval", "face", "people", "place", "location", "date", "event", "album",
    "no results", "wrong photo", "irrelevant"
]

class GeminiProvider(BaseAIProvider):
    _warned_missing_key: bool = False

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        key = api_key or settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        self.api_key = key.strip() if key else ""
        m = model or settings.GEMINI_MODEL or os.environ.get("GEMINI_MODEL", "")
        self.model = m.strip() if m else "gemini-2.5-flash"

    async def classify_relevance(self, content: str) -> Optional[Dict[str, Any]]:
        """
        Calls Gemini Flash API to classify review relevance.
        If API key is missing or error occurs, falls back to a deterministic heuristic
        so the system remains functional.
        """
        if not self.api_key:
            if not GeminiProvider._warned_missing_key:
                logger.warning("GEMINI_API_KEY is not set in .env. Using rule-based relevance classifier fallback.")
                GeminiProvider._warned_missing_key = True
            return self._heuristic_classification(content)

        try:
            prompt = RELEVANCE_CLASSIFICATION_PROMPT.format(content=content)
        except Exception:
            prompt = RELEVANCE_CLASSIFICATION_PROMPT.replace("{content}", content).replace("{{", "{").replace("}}", "}")

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.1,
                "responseMimeType": "application/json"
            }
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(url, headers=headers, json=payload)
                if response.status_code == 200:
                    data = response.json()
                    candidates = data.get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        if parts and "text" in parts[0]:
                            raw_text = parts[0]["text"]
                            parsed = self._parse_json_response(raw_text)
                            if parsed:
                                return parsed
                else:
                    logger.error(f"Gemini API returned status code {response.status_code}: {response.text}")
        except Exception as e:
            logger.error(f"Error calling Gemini API: {str(e)}")

        # Fallback to Groq AI if available
        try:
            from app.ai.groq import GroqProvider
            groq = GroqProvider()
            if groq.api_key:
                groq_result = await groq.classify_relevance(content)
                if groq_result:
                    return groq_result
        except Exception as groq_err:
            logger.warning(f"Groq fallback also unavailable: {groq_err}")

        logger.info("Falling back to heuristic classifier after Gemini API error/timeout.")
        return self._heuristic_classification(content)

    async def understand_memory_query(self, query: str) -> Optional[Dict[str, Any]]:
        from app.ai.groq import GroqProvider
        groq = GroqProvider()
        return await groq.understand_memory_query(query)

    async def rank_candidates(self, query: str, clues: Dict[str, Any], candidates: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        from app.ai.groq import GroqProvider
        groq = GroqProvider()
        return await groq.rank_candidates(query, clues, candidates)

    async def generate_clarification(self, query: str, candidate_count: int, clues: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        from app.ai.groq import GroqProvider
        groq = GroqProvider()
        return await groq.generate_clarification(query, candidate_count, clues)

    def _parse_json_response(self, text: str) -> Optional[Dict[str, Any]]:
        try:
            cleaned = text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()

            data = json.loads(cleaned)
            is_retrieval = bool(data.get("is_retrieval_related", False))
            score = float(data.get("relevance_score", 0.0))
            topic = str(data.get("retrieval_topic", "other" if is_retrieval else "not_retrieval_related"))
            reason = str(data.get("reason", "Classified by Gemini Flash AI"))

            return {
                "is_retrieval_related": is_retrieval,
                "relevance_score": max(0.0, min(1.0, score)),
                "retrieval_topic": topic,
                "reason": reason
            }
        except Exception as e:
            logger.error(f"Failed to parse Gemini JSON response: {str(e)}. Raw text: {text}")
            return None

    def _heuristic_classification(self, content: str) -> Dict[str, Any]:
        lower = content.lower()
        matched_keywords = [kw for kw in RETRIEVAL_KEYWORDS if kw in lower]
        
        is_related = len(matched_keywords) > 0
        score = min(1.0, 0.4 + 0.15 * len(matched_keywords)) if is_related else 0.1
        
        topic = "search_query_problem"
        if "old" in lower or "years" in lower:
            topic = "old_photo_retrieval"
        elif "remember" in lower or "memory" in lower:
            topic = "memory_based_search"
        elif "vacation" in lower or "trip" in lower:
            topic = "event_search"
        elif "people" in lower or "face" in lower:
            topic = "person_search"
        elif "location" in lower or "place" in lower:
            topic = "location_search"
        elif not is_related:
            topic = "not_retrieval_related"

        return {
            "is_retrieval_related": is_related,
            "relevance_score": round(score, 2),
            "retrieval_topic": topic,
            "reason": f"Heuristic pre-filter matched keywords: {', '.join(matched_keywords)}" if is_related else "No photo retrieval keywords detected in feedback."
        }
