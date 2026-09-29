from abc import ABC, abstractmethod
from typing import List, Dict, Any, Tuple

class VectorStore(ABC):
    @abstractmethod
    def add_documents(self, documents: List[Dict[str, Any]]) -> None:
        """
        Adds documents to vector store.
        Each document has 'id', 'text', and 'metadata'.
        """
        pass

    @abstractmethod
    def search(self, query_text: str, top_k: int = 10) -> List[Tuple[str, float, Dict[str, Any]]]:
        """
        Searches vector store for query_text.
        Returns List of tuples: (photo_id, similarity_score, metadata).
        """
        pass

    @abstractmethod
    def delete(self, doc_id: str) -> bool:
        """
        Deletes a document by ID.
        """
        pass

    @abstractmethod
    def rebuild(self, documents: List[Dict[str, Any]]) -> None:
        """
        Rebuilds index completely from document list.
        """
        pass

    @abstractmethod
    def save(self, file_path: str) -> None:
        """
        Saves index state to file.
        """
        pass

    @abstractmethod
    def load(self, file_path: str) -> None:
        """
        Loads index state from file.
        """
        pass
