import logging
from typing import Dict, Any, Optional, List
from app.ai.groq import GroqProvider

logger = logging.getLogger(__name__)

class ClarificationService:
    def __init__(self, ai_provider: Optional[GroqProvider] = None):
        self.ai_provider = ai_provider or GroqProvider()

    async def evaluate_clarification(self, query: str, candidates: List[Dict[str, Any]], clues: Dict[str, Any]) -> Dict[str, Any]:
        """
        Determines whether the retrieval candidates require a clarification question.
        """
        cand_count = len(candidates)

        # Do not ask unnecessary questions if candidate count is already small and refined (1-4 candidates)
        if cand_count <= 4:
            return {
                "needs_clarification": False,
                "question": None,
                "options": []
            }

        result = await self.ai_provider.generate_clarification(query, cand_count, clues)
        if result and "needs_clarification" in result:
            return result

        # Rule-based fallback clarification
        if "goa" in query.lower():
            return {
                "needs_clarification": True,
                "question": "Which specific setting in Goa do you remember?",
                "options": ["Beach cafe", "Street market", "Sunset view", "I'm not sure"]
            }
        
        return {
            "needs_clarification": True,
            "question": f"I found {cand_count} possible matches. Can you remember anything specific about the location or activity?",
            "options": ["Beach or Nature", "Indoor or Restaurant", "Family or Friends", "I'm not sure"]
        }
