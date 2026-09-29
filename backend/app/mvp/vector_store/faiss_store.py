import os
import json
import logging
import math
from typing import List, Dict, Any, Tuple
from pathlib import Path
from app.mvp.vector_store.base import VectorStore

logger = logging.getLogger(__name__)

class FAISSVectorStore(VectorStore):
    def __init__(self, index_file: str = "data/vector_index.json"):
        self.index_file = index_file
        self.documents: Dict[str, Dict[str, Any]] = {}
        self.vocab: Dict[str, int] = {}
        self.idf: Dict[str, float] = {}
        self.doc_vectors: Dict[str, Dict[int, float]] = {}
        self.doc_norms: Dict[str, float] = {}

    def _tokenize(self, text: str) -> List[str]:
        cleaned = "".join([c.lower() if c.isalnum() or c.isspace() else " " for c in text])
        return [w for w in cleaned.split() if len(w) > 1]

    def _update_idf(self):
        N = len(self.documents)
        if N == 0:
            return
        df = {}
        all_vocab = set()
        for doc_id, doc in self.documents.items():
            tokens = set(self._tokenize(doc.get("text", "")))
            for t in tokens:
                df[t] = df.get(t, 0) + 1
                all_vocab.add(t)

        self.vocab = {t: i for i, t in enumerate(sorted(list(all_vocab)))}
        self.idf = {t: math.log((N + 1) / (count + 1)) + 1.0 for t, count in df.items()}

        self.doc_vectors = {}
        self.doc_norms = {}
        for doc_id, doc in self.documents.items():
            tokens = self._tokenize(doc.get("text", ""))
            tf = {}
            for t in tokens:
                tf[t] = tf.get(t, 0) + 1

            vec = {}
            norm_sq = 0.0
            for t, freq in tf.items():
                if t in self.vocab and t in self.idf:
                    tid = self.vocab[t]
                    val = freq * self.idf[t]
                    vec[tid] = val
                    norm_sq += val * val

            self.doc_vectors[doc_id] = vec
            self.doc_norms[doc_id] = math.sqrt(norm_sq) if norm_sq > 0 else 1.0

    def add_documents(self, documents: List[Dict[str, Any]]) -> None:
        for doc in documents:
            doc_id = doc["id"]
            self.documents[doc_id] = doc
        self._update_idf()

    def search(self, query_text: str, top_k: int = 10) -> List[Tuple[str, float, Dict[str, Any]]]:
        if not self.documents:
            return []

        tokens = self._tokenize(query_text)
        query_tf = {}
        for t in tokens:
            query_tf[t] = query_tf.get(t, 0) + 1

        q_vec = {}
        q_norm_sq = 0.0
        for t, freq in query_tf.items():
            if t in self.vocab and t in self.idf:
                tid = self.vocab[t]
                val = freq * self.idf[t]
                q_vec[tid] = val
                q_norm_sq += val * val

        q_norm = math.sqrt(q_norm_sq) if q_norm_sq > 0 else 1.0
        if q_norm_sq == 0:
            # Fallback if no vocab terms match query
            return [(doc_id, 0.1, doc.get("metadata", {})) for doc_id, doc in list(self.documents.items())[:top_k]]

        scores = []
        for doc_id, d_vec in self.doc_vectors.items():
            dot = 0.0
            for tid, q_val in q_vec.items():
                if tid in d_vec:
                    dot += q_val * d_vec[tid]

            sim = dot / (q_norm * self.doc_norms.get(doc_id, 1.0))
            scores.append((doc_id, float(sim), self.documents[doc_id].get("metadata", {})))

        scores.sort(key=lambda x: x[1], reverse=True)
        return scores[:top_k]

    def delete(self, doc_id: str) -> bool:
        if doc_id in self.documents:
            del self.documents[doc_id]
            self._update_idf()
            return True
        return False

    def rebuild(self, documents: List[Dict[str, Any]]) -> None:
        self.documents = {}
        self.add_documents(documents)

    def save(self, file_path: str = None) -> None:
        target = file_path or self.index_file
        path = Path(target)
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump({
                "documents": self.documents
            }, f, indent=2)
        logger.info(f"Saved VectorStore index with {len(self.documents)} documents to {target}")

    def load(self, file_path: str = None) -> None:
        target = file_path or self.index_file
        path = Path(target)
        if path.exists():
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.documents = data.get("documents", {})
                self._update_idf()
            logger.info(f"Loaded VectorStore index with {len(self.documents)} documents from {target}")
