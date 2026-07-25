from typing import Optional
from prisma import Prisma
from prisma.models import Property


class PropertyRepository:
    def __init__(self, db: Prisma):
        self.db = db

    async def create(self, user_id: str, data: dict) -> Property:
        return await self.db.property.create(data={**data, "user_id": user_id})

    async def get_by_id(self, property_id: str, user_id: str) -> Optional[Property]:
        return await self.db.property.find_first(
            where={"id": property_id, "user_id": user_id}
        )

    async def list_by_user(self, user_id: str) -> list[Property]:
        return await self.db.property.find_many(
            where={"user_id": user_id},
            order={"created_at": "desc"},
        )

    async def get_by_name(self, user_id: str, name: str) -> Optional[Property]:
        found = await self.db.property.find_first(
            where={"user_id": user_id, "name": name}
        )
        return found
    
    async def exists_by_name(self, user_id: str, name: str) -> bool:
        count = await self.db.property.count(
            where={"user_id": user_id, "name": name}
        )
        return count > 0

    async def update(self, property_id: str, user_id: str, data: dict) -> Optional[Property]:
        result = await self.db.property.update_many(
            where={"id": property_id, "user_id": user_id}, data=data
        )
        if result == 0:
            return None
        return await self.get_by_id(property_id, user_id)

    async def delete(self, property_id: str, user_id: str) -> bool:
        result = await self.db.property.delete_many(
            where={"id": property_id, "user_id": user_id}
        )
        return result > 0