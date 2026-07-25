from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CalculationCreate(BaseModel):
    ...


class CalculationRead(BaseModel):
    ...