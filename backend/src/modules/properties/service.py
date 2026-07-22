from fastapi import HTTPException, status
from src.modules.properties.repository import PropertyRepository
from src.modules.properties.schemas import PropertyCreate, PropertyUpdate

VALID_STATES = {"PB", "PE", "CE", "RN", "BA", "SP", "MG"}  # TODO: completar com IBGE ou chamar enums


class PropertyService:
    def __init__(self, repository: PropertyRepository):
        self.repository = repository

    async def create_property(self, user_id: str, payload: PropertyCreate):
        if payload.state.upper() not in VALID_STATES:
            raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Invalid state.")

        if await self.repository.exists_by_name(user_id, payload.name):
            raise HTTPException(status.HTTP_409_CONFLICT, "You already have a property with this name.")

        return await self.repository.create(user_id, payload.model_dump())

    async def get_property_or_404(self, property_id: str, user_id: str):
        prop = await self.repository.get_by_id(property_id, user_id)
        if prop is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Property not found.")
        return prop

    async def list_properties(self, user_id: str):
        return await self.repository.list_by_user(user_id)

    async def update_property(self, property_id: str, user_id: str, payload: PropertyUpdate):
        await self.get_property_or_404(property_id, user_id)
        updated = await self.repository.update(
            property_id, user_id, payload.model_dump(exclude_unset=True)
        )
        return updated

    async def delete_property(self, property_id: str, user_id: str):
        await self.get_property_or_404(property_id, user_id)
        await self.repository.soft_delete(property_id, user_id)