from datetime import date
from fastapi import HTTPException, status
from src.modules.crops.repository import CropRepository
from src.modules.properties.service import PropertyService
from src.modules.crops.schemas import CropCreate, CropUpdate

# TODO: Validar
class CropService:
    def __init__(self, repository: CropRepository, property_service: PropertyService):
        self.repository = repository
        self.property_service = property_service

    async def create_crop(self, user_id: str, payload: CropCreate):
        # garante posse da property antes de qualquer outra validação de negócio
        await self.property_service.get_property_or_404(str(payload.property_id), user_id)

        if payload.planting_date > date.today():
            raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Data de plantio não pode ser futura.")

        if await self.repository.exists_by_name(str(payload.property_id), user_id, payload.name):
            raise HTTPException(status.HTTP_409_CONFLICT, "Já existe um cultivo com esse nome nessa propriedade.")

        data = payload.model_dump(by_alias=True, exclude_none=True, exclude={"property_id"})
        crop = await self.repository.create(str(payload.property_id), user_id, data)

        if crop is None:
            # segunda camada de defesa: o repository também valida a posse da property
            # no `where`, então isso só dispara em condição de corrida (property
            # deletada entre a checagem acima e o create)
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Propriedade não encontrada.")

        return crop

    async def get_crop_or_404(self, crop_id: str, user_id: str):
        crop = await self.repository.get_by_id(crop_id, user_id)
        if crop is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Cultivo não encontrado.")
        return crop

    async def list_crops(self, property_id: str, user_id: str):
        await self.property_service.get_property_or_404(property_id, user_id)
        return await self.repository.list_by_property(property_id, user_id)

    async def update_crop(self, crop_id: str, user_id: str, payload: CropUpdate):
        await self.get_crop_or_404(crop_id, user_id)  # garante posse antes de update
        data = payload.model_dump(by_alias=True, exclude_unset=True)
        updated = await self.repository.update(crop_id, user_id, data)
        if updated is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Cultivo não encontrado.")
        return updated

    async def delete_crop(self, crop_id: str, user_id: str):
        await self.get_crop_or_404(crop_id, user_id)
        await self.repository.delete(crop_id, user_id)

    async def count_crops(self, property_id: str, user_id: str) -> int:
        await self.property_service.get_property_or_404(property_id, user_id)
        return await self.repository.count_by_property(property_id, user_id)