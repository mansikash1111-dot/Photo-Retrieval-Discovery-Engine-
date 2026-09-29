from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone

class BaseCollector(ABC):
    """
    Abstract Base Class for public feedback collectors.
    All collectors return normalized records:
    {
        "source": "source-slug",
        "external_id": "unique-id-from-source",
        "title": "Optional Title",
        "content": "Raw User Evidence Text",
        "author": "Public Author Name",
        "rating": 1-5 or None,
        "language": "en",
        "published_at": datetime object,
        "source_url": "Clickable direct URL",
        "metadata": {
            # Source specific fields (reddit subreddit, youtube video_id, etc)
        }
    }
    """
    def __init__(self, source_slug: str):
        self.source_slug = source_slug

    @abstractmethod
    async def collect(self, query: str = "photo search", limit: int = 50) -> List[Dict[str, Any]]:
        """
        Collect public feedback matching the search query up to limit items.
        """
        pass

    def _normalize_date(self, date_val: Any) -> datetime:
        if isinstance(date_val, datetime):
            if date_val.tzinfo is None:
                return date_val.replace(tzinfo=timezone.utc)
            return date_val
        if isinstance(date_val, (int, float)):
            return datetime.fromtimestamp(date_val, tz=timezone.utc)
        if isinstance(date_val, str):
            try:
                dt = datetime.fromisoformat(date_val.replace('Z', '+00:00'))
                if dt.tzinfo is None:
                    return dt.replace(tzinfo=timezone.utc)
                return dt
            except Exception:
                pass
        return datetime.now(timezone.utc)
