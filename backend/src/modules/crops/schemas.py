from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

import json
from enum import Enum
from src.constants.crop_keys import CropKey

class CropCreate(BaseModel):
    property_id: UUID
    name: str = Field(min_length=3, max_length=100)
    crop_type: CropKey
    irrigation_system_type: str = Field(min_length=2, max_length=50)
    irrigation_turn: Optional[int] = Field(default=1)
    planting_date: datetime
    area_planted_hectares: float

    model_config = ConfigDict(extra="forbid")


class CropUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=3, max_length=100)
    crop_type: Optional[CropKey] = None
    irrigation_system_type: Optional[str] = Field(default=None, min_length=2, max_length=50)
    irrigation_turn: Optional[int] = None
    planting_date: Optional[datetime] = None
    area_planted_hectares: Optional[float] = Field(default=None, gt=0)

    model_config = ConfigDict(extra="forbid")


class CropRead(BaseModel):
    id: UUID
    property_id: UUID

    name: str
    crop_type: CropKey
    irrigation_system_type: str
    irrigation_turn: int
    planting_date: datetime
    area_planted_hectares: float

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )