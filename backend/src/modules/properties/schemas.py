from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID


class PropertyCreate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    state: str = Field(..., min_length=2, max_length=2)
    municipality: str

    model_config = ConfigDict(extra="forbid")

class PropertyUpdate(BaseModel):
    name: Optional[str] = None

    model_config = ConfigDict(extra='forbid')


class PropertyRead(BaseModel):
    id: UUID
    name: str
    state: str
    municipality: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)