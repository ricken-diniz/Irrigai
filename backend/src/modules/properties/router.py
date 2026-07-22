from fastapi import APIRouter, Depends, status
from src.dependencies import get_current_user_id
from src.core.database import prisma
from src.modules.properties.repository import PropertyRepository
from src.modules.properties.service import PropertyService
from src.modules.properties.schemas import PropertyCreate, PropertyUpdate, PropertyRead

router = APIRouter(prefix="/properties", tags=["Properties"])


def get_property_service() -> PropertyService:
    return PropertyService(PropertyRepository(prisma))


@router.post("", response_model=PropertyRead, status_code=status.HTTP_201_CREATED)
async def create_property(
    payload: PropertyCreate,
    user_id: str = Depends(get_current_user_id),
    service: PropertyService = Depends(get_property_service),
):
    return await service.create_property(user_id, payload)


@router.get("", response_model=list[PropertyRead])
async def list_properties(
    user_id: str = Depends(get_current_user_id),
    service: PropertyService = Depends(get_property_service),
):
    return await service.list_properties(user_id)


@router.get("/{property_id}", response_model=PropertyRead)
async def get_property(
    property_id: str,
    user_id: str = Depends(get_current_user_id),
    service: PropertyService = Depends(get_property_service),
):
    return await service.get_property_or_404(property_id, user_id)


@router.patch("/{property_id}", response_model=PropertyRead)
async def update_property(
    property_id: str,
    payload: PropertyUpdate,
    user_id: str = Depends(get_current_user_id),
    service: PropertyService = Depends(get_property_service),
):
    return await service.update_property(property_id, user_id, payload)


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property(
    property_id: str,
    user_id: str = Depends(get_current_user_id),
    service: PropertyService = Depends(get_property_service),
):
    await service.delete_property(property_id, user_id)