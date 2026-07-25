from uuid import UUID

from fastapi import APIRouter, Depends, Response, status

from src.core.database import prisma
from src.dependencies import get_current_user_id

from src.modules.crops.repository import CropRepository
from src.modules.crops.schemas import (
    CropCreate,
    CropRead,
    CropUpdate,
)
from src.modules.crops.service import CropService

from src.modules.properties.repository import PropertyRepository
from src.modules.properties.service import PropertyService

from src.modules.calculation.repository import CalculationRepository
from src.modules.calculation.service import CalculationService


router = APIRouter(
    prefix="/crops",
    tags=["Crops"],
)


def get_crop_service() -> CropService:
    property_service = PropertyService(PropertyRepository(prisma))
    calculation_service = CalculationService(CalculationRepository(prisma))
    return CropService(CropRepository(prisma), property_service, calculation_service)


@router.post("", response_model=CropRead, status_code=status.HTTP_201_CREATED)
async def create_crop(
    payload: CropCreate,
    user_id: UUID = Depends(get_current_user_id),
    service: CropService = Depends(get_crop_service)
):
    return await service.create_crop(str(user_id), payload)


@router.get("/{crop_id}", response_model=CropRead)
async def get_crop(
    crop_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    service: CropService = Depends(get_crop_service)
):
    return await service.get_crop_or_404(str(crop_id), str(user_id))


@router.get("/property/{property_id}", response_model=list[CropRead])
async def list_crops(
    property_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    service: CropService = Depends(get_crop_service)
):
    return await service.list_crops(str(property_id), str(user_id))


@router.patch("/{crop_id}", response_model=CropRead)
async def update_crop(
    crop_id: UUID,
    payload: CropUpdate,
    user_id: UUID = Depends(get_current_user_id),
    service: CropService = Depends(get_crop_service)
):
    return await service.update_crop(
        str(crop_id),
        str(user_id),
        payload
    )


@router.delete("/{crop_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_crop(
    crop_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    service: CropService = Depends(get_crop_service)
):
    await service.delete_crop(str(crop_id), str(user_id))
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/{crop_id}/calculation") # TODO: add response model
async def get_crop_calculation(
    crop_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    service: CropService = Depends(get_crop_service),
):
    return await service.get_crop_calculation(
        str(crop_id),
        str(user_id),
    )