from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID


class PropertyCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    state: str = Field(..., min_length=2, max_length=2)  # ex: "PB"
    municipality: str
    soil_type: Optional[str] = Field(default=None, serialization_alias="soilType")
    soil_texture: Optional[str] = Field(default=None, serialization_alias="soilTexture")

    model_config = ConfigDict(populate_by_name=True)


class PropertyUpdate(BaseModel):
    name: Optional[str] = None
    soil_type: Optional[str] = Field(default=None, serialization_alias="soilType")
    soil_texture: Optional[str] = Field(default=None, serialization_alias="soilTexture")

    model_config = ConfigDict(populate_by_name=True)


class PropertyRead(BaseModel):
    property_id: UUID = Field(validation_alias="id")
    name: str
    state: str
    municipality: str
    soil_type: Optional[str] = Field(default=None, validation_alias="soilType")
    soil_texture: Optional[str] = Field(default=None, validation_alias="soilTexture")
    created_at: datetime = Field(validation_alias="createdAt")
    updated_at: datetime = Field(validation_alias="updatedAt")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)