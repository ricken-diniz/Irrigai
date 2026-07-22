from fastapi import HTTPException, status
from src.modules.properties.repository import PropertyRepository
from src.modules.properties.schemas import PropertyCreate, PropertyUpdate

VALID_STATES = {"PB", "PE", "CE", "RN", "BA", "SP", "MG"}  # TODO: completar com todos os estados


class PropertyService:
    def __init__(self, repository: PropertyRepository):
        self.repository = repository

    async def create_property(self, user_id: str, payload: PropertyCreate):
        if payload.state.upper() not in VALID_STATES:
            raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Estado inválido.")

        if await self.repository.exists_by_name(user_id, payload.name):
            raise HTTPException(status.HTTP_409_CONFLICT, "Você já tem uma propriedade com esse nome.")

        data = payload.model_dump(by_alias=True, exclude_none=True)
        return await self.repository.create(user_id, data)

    async def get_property_or_404(self, property_id: str, user_id: str):
        prop = await self.repository.get_by_id(property_id, user_id)
        if prop is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Propriedade não encontrada.")
        return prop

    async def list_properties(self, user_id: str):
        return await self.repository.list_by_user(user_id)

    async def update_property(self, property_id: str, user_id: str, payload: PropertyUpdate):
        await self.get_property_or_404(property_id, user_id)  # garante posse antes de update
        data = payload.model_dump(by_alias=True, exclude_unset=True)
        return await self.repository.update(property_id, user_id, data)

    async def delete_property(self, property_id: str, user_id: str):
        await self.get_property_or_404(property_id, user_id)
        await self.repository.delete(property_id, user_id)