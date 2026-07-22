from fastapi import APIRouter, Depends, status
from src.dependencies import get_current_user_id
from src.core.database import prisma
from src.modules.crops.repository import CropRepository
from src.modules.crops.service import CropService
from src.modules.crops.schemas import CropCreate, CropRead
from src.modules.properties.repository import PropertyRepository
from src.modules.properties.service import PropertyService

router = APIRouter(prefix="/crops", tags=["Crops"])


def get_crop_service() -> CropService:
    property_service = PropertyService(PropertyRepository(prisma))
    return CropService(CropRepository(prisma), property_service)


@router.post("", response_model=CropRead, status_code=status.HTTP_201_CREATED)
async def create_crop(
    payload: CropCreate,
    user_id: str = Depends(get_current_user_id),
    service: CropService = Depends(get_crop_service),
):
    return await service.create_crop(user_id, payload)


@router.get("/{crop_id}", response_model=CropRead)
async def get_crop(
    crop_id: str,
    user_id: str = Depends(get_current_user_id),
    service: CropService = Depends(get_crop_service),
):
    return await service.get_crop_or_404(crop_id, user_id)


@router.get("/property/{property_id}", response_model=list[CropRead])
async def list_crops_by_property(
    property_id: str,
    user_id: str = Depends(get_current_user_id),
    service: CropService = Depends(get_crop_service),
):
    return await service.list_crops(property_id, user_id)