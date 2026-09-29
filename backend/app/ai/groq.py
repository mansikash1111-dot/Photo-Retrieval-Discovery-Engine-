import json
import logging
import os
import re
import httpx
from typing import Optional, Dict, Any, List
from pathlib import Path
from app.config import settings
from app.ai.base import BaseAIProvider

logger = logging.getLogger(__name__)

PROMPTS_DIR = Path(__file__).parent / "prompts"

def load_prompt_template(filename: str) -> str:
    path = PROMPTS_DIR / filename
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    return ""

class GroqProvider(BaseAIProvider):
    _warned_missing_key: bool = False

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        key = api_key or settings.GROQ_API_KEY or os.environ.get("GROQ_API_KEY", "")
        self.api_key = key.strip() if key else ""
        m = model or settings.GROQ_MODEL or os.environ.get("GROQ_MODEL", "")
        self.model = m.strip() if m else "openai/gpt-oss-20b"

    async def _call_groq_json(self, prompt: str) -> Optional[Dict[str, Any]]:
        if not self.api_key:
            if not GroqProvider._warned_missing_key:
                logger.warning("GROQ_API_KEY is not set in .env. Falling back to rule-based AI processing.")
                GroqProvider._warned_missing_key = True
            return None

        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are a helpful AI assistant that returns strict JSON responses only."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.1,
            "response_format": {"type": "json_object"}
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(url, headers=headers, json=payload)
                if response.status_code == 200:
                    data = response.json()
                    choices = data.get("choices", [])
                    if choices:
                        content = choices[0].get("message", {}).get("content", "")
                        return self._clean_and_parse_json(content)
                else:
                    logger.error(f"Groq API returned status {response.status_code}: {response.text}")
        except Exception as e:
            logger.error(f"Error executing Groq API call: {str(e)}")

        return None

    def _clean_and_parse_json(self, text: str) -> Optional[Dict[str, Any]]:
        try:
            cleaned = text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()
            return json.loads(cleaned)
        except Exception as e:
            logger.error(f"JSON parsing error: {e}. Raw text: {text}")
            return None

    async def classify_relevance(self, content: str) -> Optional[Dict[str, Any]]:
        prompt_tmpl = load_prompt_template("relevance_classification.txt")
        if not prompt_tmpl:
            from app.ai.prompts import RELEVANCE_CLASSIFICATION_PROMPT
            prompt_tmpl = RELEVANCE_CLASSIFICATION_PROMPT
        
        prompt = prompt_tmpl.replace("{content}", content)
        result = await self._call_groq_json(prompt)
        if result and "is_retrieval_related" in result:
            return result
        
        # Rule-based fallback
        return self._heuristic_relevance(content)

    async def understand_memory_query(self, query: str) -> Optional[Dict[str, Any]]:
        prompt_tmpl = load_prompt_template("retrieval_query_understanding.txt")
        prompt = prompt_tmpl.replace("{query}", query)
        
        result = await self._call_groq_json(prompt)
        if result and ("location" in result or "scene" in result):
            return result

        # Rule-based fallback for query understanding
        return self._heuristic_query_understanding(query)

    async def rank_candidates(self, query: str, clues: Dict[str, Any], candidates: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        prompt_tmpl = load_prompt_template("retrieval_ranking.txt")
        prompt = prompt_tmpl.replace("{query}", query).replace("{clues_json}", json.dumps(clues)).replace("{candidates_json}", json.dumps(candidates[:10]))
        
        result = await self._call_groq_json(prompt)
        if result and "rankings" in result:
            return result

        # Fallback ranking explanations
        rankings = []
        for c in candidates:
            matching = [kw for kw in c.get("keywords", []) if kw.lower() in query.lower()]
            rankings.append({
                "photo_id": c["id"],
                "ai_score": 0.85 if matching else 0.60,
                "explanation": f"Possible match because this photo is categorized under {c.get('category')} with scene: {', '.join(c.get('scene', []))}.",
                "matching_clues": matching or c.get("keywords", [])[:3]
            })
        return {"rankings": rankings}

    async def generate_clarification(self, query: str, candidate_count: int, clues: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if candidate_count <= 4:
            return {"needs_clarification": False, "question": None, "options": []}

        prompt_tmpl = load_prompt_template("clarification.txt")
        prompt = prompt_tmpl.replace("{query}", query).replace("{candidate_count}", str(candidate_count)).replace("{clues_json}", json.dumps(clues))
        
        result = await self._call_groq_json(prompt)
        if result and "needs_clarification" in result:
            return result

        # Heuristic clarification question
        if "goa" in query.lower():
            return {
                "needs_clarification": True,
                "question": "Which setting in Goa do you remember?",
                "options": ["Beach cafe", "Street restaurant", "Sunset beach", "I'm not sure"]
            }
        elif "dog" in query.lower() or "pet" in query.lower():
            return {
                "needs_clarification": True,
                "question": "Where was your dog in the photo?",
                "options": ["Near the lake", "In the park", "At home", "I'm not sure"]
            }
        return {
            "needs_clarification": True,
            "question": "Do you remember approximately when or where this was taken?",
            "options": ["Recent trip", "Last year", "Special event", "I'm not sure"]
        }

    def _heuristic_relevance(self, content: str) -> Dict[str, Any]:
        lower = content.lower()
        keywords = ["search", "find", "locate", "query", "missing", "lost photo", "old photo", "remember"]
        is_rel = any(k in lower for k in keywords)
        return {
            "is_retrieval_related": is_rel,
            "relevance_score": 0.85 if is_rel else 0.1,
            "retrieval_topic": "search_query_problem" if is_rel else "not_retrieval_related",
            "reason": "Rule-based heuristic keyword detection."
        }

    def _heuristic_query_understanding(self, query: str) -> Dict[str, Any]:
        lower = query.lower()
        
        locations = []
        if "goa" in lower: locations.append("Goa")
        if "manali" in lower: locations.append("Manali")
        if "jaipur" in lower: locations.append("Jaipur")
        if "paris" in lower: locations.append("Paris")

        events = []
        if "trip" in lower or "vacation" in lower: events.append("trip")
        if "birthday" in lower: events.append("birthday party")
        if "wedding" in lower: events.append("wedding")

        scenes = []
        if "cafe" in lower: scenes.append("cafe")
        if "beach" in lower: scenes.append("beach")
        if "lake" in lower: scenes.append("lake")
        if "park" in lower: scenes.append("park")
        if "table" in lower or "bedside" in lower: scenes.append("room")
        if "mountain" in lower: scenes.append("mountain")

        activities = []
        if "sitting" in lower: activities.append("sitting")
        if "drinking" in lower or "coffee" in lower: activities.append("drinking coffee")
        if "eating" in lower or "dinner" in lower: activities.append("eating dinner")
        if "sick" in lower: activities.append("resting")

        people = []
        if "friend" in lower or "friends" in lower: people.append("friends")
        if "dog" in lower: people.append("dog")
        if "family" in lower: people.append("family")

        objects = []
        if "coffee" in lower: objects.append("coffee")
        if "balloon" in lower or "balloons" in lower: objects.append("balloons")
        if "cake" in lower: objects.append("cake")
        if "medicine" in lower: objects.append("medicine bottle")

        weather = []
        if "sunny" in lower: weather.append("sunny")
        if "rainy" in lower or "rain" in lower: weather.append("rainy")
        if "sunset" in lower: weather.append("sunset")

        return {
            "location": locations,
            "event": events,
            "scene": scenes,
            "activity": activities,
            "people": people,
            "objects": objects,
            "time": ["sunset"] if "sunset" in lower else [],
            "weather": weather,
            "visual_clues": [k for k in (locations + scenes + objects) if k],
            "uncertain_clues": ["exact date", "exact venue"]
        }
