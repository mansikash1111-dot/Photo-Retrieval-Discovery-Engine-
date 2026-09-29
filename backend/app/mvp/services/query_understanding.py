import logging
from typing import Dict, Any, Optional
from app.ai.groq import GroqProvider

logger = logging.getLogger(__name__)

class QueryUnderstandingService:
    def __init__(self, ai_provider: Optional[GroqProvider] = None):
        self.ai_provider = ai_provider or GroqProvider()

    async def extract_clues(self, query: str) -> Dict[str, Any]:
        """
        Transforms natural-language memory query into structured clues.
        """
        result = await self.ai_provider.understand_memory_query(query)
        if result:
            return {
                "location": result.get("location", []),
                "event": result.get("event", []),
                "scene": result.get("scene", []),
                "activity": result.get("activity", []),
                "people": result.get("people", []),
                "objects": result.get("objects", []),
                "time": result.get("time", []),
                "weather": result.get("weather", []),
                "visual_clues": result.get("visual_clues", []),
                "uncertain_clues": result.get("uncertain_clues", [])
            }

        return {
            "location": [],
            "event": [],
            "scene": [],
            "activity": [],
            "people": [],
            "objects": [],
            "time": [],
            "weather": [],
            "visual_clues": [query],
            "uncertain_clues": ["exact venue", "exact date"]
        }
