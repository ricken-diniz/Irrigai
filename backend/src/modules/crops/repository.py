from typing import Optional
from prisma import Prisma
from prisma.models import Crop


class CropRepository:
    def __init__(self, db: Prisma):
        self.db = db

    async def create(self, data: dict) -> Crop:
        return await self.db.crop.create(data=data)

    async def get_by_id_with_property(self, crop_id: str) -> Optional[Crop]:
        return await self.db.crop.find_first(
            where={"crop_id": crop_id, "deleted_at": None},
            include={"property": True},
        )

    async def list_by_property(self, property_id: str) -> list[Crop]:
        return await self.db.crop.find_many(
            where={"property_id": property_id, "deleted_at": None},
            order={"planting_date": "desc"},
        )