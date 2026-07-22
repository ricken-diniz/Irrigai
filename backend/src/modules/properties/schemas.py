from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from uuid import UUID


class PropertyCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    state: str = Field(..., min_length=2, max_length=2)  # ex: "PB"
    municipality: str
    soil_type: Optional[str] = None
    soil_texture: Optional[str] = None


class PropertyUpdate(BaseModel):
    name: Optional[str] = None
    soil_type: Optional[str] = None
    soil_texture: Optional[str] = None


class PropertyRead(BaseModel):
    property_id: UUID
    name: str
    state: str
    municipality: str
    soil_type: Optional[str]
    soil_texture: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}