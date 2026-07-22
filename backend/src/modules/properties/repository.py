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
            where={"property_id": property_id, "user_id": user_id, "deleted_at": None}
        )

    async def list_by_user(self, user_id: str) -> list[Property]:
        return await self.db.property.find_many(
            where={"user_id": user_id, "deleted_at": None},
            order={"created_at": "desc"},
        )

    async def exists_by_name(self, user_id: str, name: str) -> bool:
        found = await self.db.property.find_first(
            where={"user_id": user_id, "name": name, "deleted_at": None}
        )
        return found is not None

    async def update(self, property_id: str, user_id: str, data: dict) -> Optional[Property]:
        result = await self.db.property.update_many(
            where={"property_id": property_id, "user_id": user_id}, data=data
        )
        if result == 0:
            return None
        return await self.get_by_id(property_id, user_id)

    async def soft_delete(self, property_id: str, user_id: str) -> bool:
        from datetime import datetime, timezone
        result = await self.db.property.update_many(
            where={"property_id": property_id, "user_id": user_id},
            data={"deleted_at": datetime.now(timezone.utc)},
        )
        return result > 0