from datetime import UTC, datetime
from fastapi import HTTPException, status
from src.modules.crops.repository import CropRepository
from src.modules.properties.service import PropertyService
from src.modules.calculation.schemas import CalculationCreate
from src.modules.calculation.service import CalculationService
from src.modules.crops.schemas import CropCreate, CropUpdate

class CropService:
    def __init__(self, repository: CropRepository, property_service: PropertyService, calculation_service: CalculationService):
        self.repository = repository
        self.property_service = property_service
        self.calculation_service = calculation_service

    async def create_crop(self, user_id: str, payload: CropCreate):
        await self.property_service.get_property_or_404(str(payload.property_id), user_id)

        if payload.planting_date > datetime.now(UTC):
            raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Crop date can't be in the future.")

        if await self.repository.exists_by_name(str(payload.property_id), user_id, payload.name):
            raise HTTPException(status.HTTP_409_CONFLICT, "This crop name already exists in this property.")

        data = payload.model_dump(by_alias=True, exclude_none=True)
        crop = await self.repository.create(str(payload.property_id), user_id, data)

        if crop is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Property not found.")

        return crop

    async def get_crop_or_404(self, crop_id: str, user_id: str):
        crop = await self.repository.get_by_id(crop_id, user_id)
        if crop is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Crop not found.")
        return crop

    async def list_crops(self, property_id: str, user_id: str):
        await self.property_service.get_property_or_404(property_id, user_id)
        return await self.repository.list_by_property(property_id, user_id)

    async def update_crop(self, crop_id: str, user_id: str, payload: CropUpdate):
        crop = await self.get_crop_or_404(crop_id, user_id)
        if (payload.planting_date is not None and payload.planting_date > datetime.now(UTC)):
            raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Data de plantio não pode ser futura.")
        if (payload.name is not None and payload.name != crop.name
            and await self.repository.exists_by_name(
                str(crop.property_id),
                user_id,
                payload.name
            )
        ):
            raise HTTPException(status.HTTP_409_CONFLICT, "This crop name already exists in this property.")
        data = payload.model_dump(
            by_alias=True,
            exclude_none=True,
            exclude_unset=True,
        )
        return await self.repository.update(
            crop_id,
            user_id,
            data,
        )

    async def delete_crop(self, crop_id: str, user_id: str):
        await self.get_crop_or_404(crop_id, user_id)
        await self.repository.delete(crop_id, user_id)

    async def count_crops(self, property_id: str, user_id: str) -> int:
        await self.property_service.get_property_or_404(property_id, user_id)
        return await self.repository.count_by_property(property_id, user_id)

    async def get_crop_calculation(self, crop_id: str, user_id: str):
        crop = await self.get_crop_or_404(crop_id, user_id)

        property = await self.property_service.get_property_or_404(
            crop.property_id,
            user_id,
        )

        payload = CalculationCreate(
            crop_id=crop.id,
            municipality=property.municipality,
            state=property.state,
            crop_type=crop.crop_type,
            planting_date=crop.planting_date,
            area_planted_hectares=crop.area_planted_hectares,
            irrigation_system=crop.irrigation_system_type,
        )

        return await self.calculation_service.get_today(payload)