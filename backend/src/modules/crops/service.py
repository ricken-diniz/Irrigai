from datetime import date, timedelta
from fastapi import HTTPException, status
from src.modules.crops.repository import CropRepository
from src.modules.properties.service import PropertyService
from src.modules.crops.schemas import CropCreate

# TODO: Validar
FAO56_CYCLE_DAYS = {
    "Bean": 100, "Corn": 130, "Tomato": 120, "Lettuce": 65, "Cane": 365,
}


class CropService:
    def __init__(self, repository: CropRepository, property_service: PropertyService):
        self.repository = repository
        self.property_service = property_service

    # TODO: Implementar lógica para calcular o estágio da planta conforme o tipo de plantio
    def _derive_stage(self, planting_date: date) -> tuple[str, int]:
        days = (date.today() - planting_date).days
        if days < 10:
            return "Germination", days
        elif days < 40:
            return "Growth", days
        elif days < 70:
            return "Flowering", days
        elif days < 90:
            return "Fruiting", days
        return "Maturation", days

    async def create_crop(self, user_id: str, payload: CropCreate):
        await self.property_service.get_property_or_404(str(payload.property_id), user_id)

        if payload.planting_date > date.today():
            raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Data de plantio não pode ser futura.")

        cycle_days = FAO56_CYCLE_DAYS.get(payload.crop_type, 100)
        expected_harvest = payload.planting_date + timedelta(days=cycle_days)
        stage, days_since = self._derive_stage(payload.planting_date)

        crop = await self.repository.create({
            **payload.model_dump(exclude={"property_id"}),
            "property_id": str(payload.property_id),
            "expected_harvest_date": expected_harvest,
            "stage": stage,
            "development_stage_days": days_since,
        })
        return crop

    async def get_crop_or_404(self, crop_id: str, user_id: str):
        crop = await self.repository.get_by_id_with_property(crop_id)
        if crop is None or crop.property.user_id != user_id:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Cultivo não encontrado.")
        return crop

    async def list_crops(self, property_id: str, user_id: str):
        await self.property_service.get_property_or_404(property_id, user_id)
        return await self.repository.list_by_property(property_id)