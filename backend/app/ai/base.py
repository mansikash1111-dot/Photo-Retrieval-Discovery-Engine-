from abc import ABC, abstractmethod
from typing import Optional, Dict, Any, List

class BaseAIProvider(ABC):
    @abstractmethod
    async def classify_relevance(self, content: str) -> Optional[Dict[str, Any]]:
        """
        Classifies whether content is retrieval-related (Part 1).
        """
        pass

    @abstractmethod
    async def understand_memory_query(self, query: str) -> Optional[Dict[str, Any]]:
        """
        Interprets natural language memory description into structured clues (Part 5).
        """
        pass

    @abstractmethod
    async def rank_candidates(self, query: str, clues: Dict[str, Any], candidates: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        """
        Ranks candidate photos and provides user-facing explanations (Part 5).
        """
        pass

    @abstractmethod
    async def generate_clarification(self, query: str, candidate_count: int, clues: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Generates clarification question and options if query is ambiguous (Part 5).
        """
        pass
