import logging
from typing import Optional, Dict, Any
from app.ai.gemini import GeminiProvider

logger = logging.getLogger(__name__)

class RelevanceService:
    def __init__(self, ai_provider: Optional[GeminiProvider] = None):
        self.ai_provider = ai_provider or GeminiProvider()

    async def classify_review(self, content: str) -> Dict[str, Any]:
        """
        Classifies a review's relevance to photo retrieval using Gemini Flash.
        Returns dictionary with:
        is_retrieval_related, relevance_score, retrieval_topic, reason, relevance_status
        """
        result = await self.ai_provider.classify_relevance(content)
        if result:
            return {
                "is_retrieval_related": result.get("is_retrieval_related"),
                "relevance_score": result.get("relevance_score"),
                "retrieval_topic": result.get("retrieval_topic"),
                "relevance_reason": result.get("reason"),
                "relevance_status": "classified"
            }
        
        return {
            "is_retrieval_related": None,
            "relevance_score": None,
            "retrieval_topic": None,
            "relevance_reason": "AI classification failed or pending API connection.",
            "relevance_status": "failed"
        }
