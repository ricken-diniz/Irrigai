from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

import json
from enum import Enum
from src.constants.crop_keys import CropKey

class CalculationInput(BaseModel):
    crop_id: UUID | None = None

    h3_token: str = Field(min_length=15, max_length=15)

    crop_type: CropKey
    irrigation_system: str = Field(min_length=2, max_length=50)
    irrigation_turn: int = Field(default=1)

    planting_date: datetime
    area_planted_hectares: float = Field(gt=0)

    model_config = ConfigDict(extra="forbid")


class CalculationCreate(BaseModel):
    crop_id: UUID | None = None
    climate_data_id: UUID
    h3_token: str

    etcrop_mm: float
    irrigation_turn: int
    lamina_liquida_mm: float
    lamina_bruta_mm: float
    tempo_irrigacao_hours: float
    volume_total_liters: float

    model_config = ConfigDict(extra="forbid")


class CalculationRead(BaseModel):
    id: UUID

    calculated_at: datetime
    h3_token: str

    etcrop_mm: float
    irrigation_turn: int
    lamina_liquida_mm: float
    lamina_bruta_mm: float
    tempo_irrigacao_hours: float
    volume_total_liters: float

    climate_data_id: UUID
    crop_id: UUID | None

    model_config = ConfigDict(from_attributes=True)