from uuid import UUID

from fastapi import APIRouter, Depends, Response, status

from src.core.database import prisma
from src.dependencies import get_current_user_id

from src.modules.calculation.schemas import CalculationInput, CalculationRead
from src.modules.calculation.repository import CalculationRepository
from src.modules.calculation.service import CalculationService

router = APIRouter(prefix="/calculations", tags=["Calculations"])

def get_calculation_service() -> CalculationService:
    return CalculationService(CalculationRepository(prisma))

@router.get("", response_model=CalculationRead, status_code=status.HTTP_201_CREATED)
async def get_or_create_calculation(
    payload: CalculationInput,
    user_id: UUID = Depends(get_current_user_id), # TODO: Avaliar necessidade de autenticação
    service: CalculationService = Depends(get_calculation_service)
):
    return await service.get_today(payload)

@router.get("/force", response_model=CalculationRead, status_code=status.HTTP_201_CREATED)
async def get_or_create_calculation(
    payload: CalculationInput,
    user_id: UUID = Depends(get_current_user_id), # TODO: Avaliar necessidade de autenticação
    service: CalculationService = Depends(get_calculation_service)
):
    return await service.forced_get_today(payload)