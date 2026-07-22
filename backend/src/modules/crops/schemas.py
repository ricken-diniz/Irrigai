from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel
from uuid import UUID


class CropCreate(BaseModel):
    property_id: UUID
    name: str
    crop_type: str
    planting_date: date
    area_planted_hectares: Optional[float] = None


class CropRead(BaseModel):
    crop_id: UUID
    property_id: UUID
    name: str
    crop_type: str
    planting_date: date
    expected_harvest_date: date
    stage: str
    development_stage_days: int
    area_planted_hectares: Optional[float]
    created_at: datetime

    model_config = {"from_attributes": True}