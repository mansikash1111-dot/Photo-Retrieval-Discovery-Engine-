from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class SourceBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    base_url: Optional[str] = None
    enabled: bool = True

class SourceCreate(SourceBase):
    pass

class SourceResponse(SourceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
