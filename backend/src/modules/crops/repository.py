from typing import Optional

from prisma import Prisma
from prisma.models import Crop


class CropRepository:
    def __init__(self, db: Prisma):
        self.db = db

    async def create(
        self,
        property_id: str,
        user_id: str,
        data: dict,
    ) -> Optional[Crop]:
        property_exists = await self.db.property.find_first(
            where={
                "id": property_id,
                "user_id": user_id,
            }
        )

        if property_exists is None:
            return None

        return await self.db.crop.create(
            data={
                **data,
                "property_id": property_id,
            }
        )

    async def get_by_id(
        self,
        crop_id: str,
        user_id: str,
    ) -> Optional[Crop]:
        return await self.db.crop.find_first(
            where={
                "id": crop_id,
                "property": {
                    "user_id": user_id,
                },
            },
            include={
                "property": True
            },
        )

    async def list_by_property(
        self,
        property_id: str,
        user_id: str,
    ) -> list[Crop]:
        return await self.db.crop.find_many(
            where={
                "property_id": property_id,
                "property": {
                    "user_id": user_id,
                },
            },
            order={
                "planting_date": "desc",
            },
        )

    async def exists_by_name(
        self,
        property_id: str,
        user_id: str,
        name: str,
    ) -> bool:
        crop = await self.db.crop.find_first(
            where={
                "property_id": property_id,
                "name": name,
                "property": {
                    "user_id": user_id,
                },
            }
        )

        return crop is not None

    async def update(
        self,
        crop_id: str,
        user_id: str,
        data: dict,
    ) -> Optional[Crop]:
        result = await self.db.crop.update_many(
            where={
                "id": crop_id,
                "property": {
                    "user_id": user_id,
                },
            },
            data=data,
        )

        if result == 0:
            return None

        return await self.get_by_id(crop_id, user_id)

    async def delete(
        self,
        crop_id: str,
        user_id: str,
    ) -> bool:
        result = await self.db.crop.delete_many(
            where={
                "id": crop_id,
                "property": {
                    "user_id": user_id,
                },
            }
        )

        return result > 0

    async def count_by_property(
        self,
        property_id: str,
        user_id: str,
    ) -> int:
        return await self.db.crop.count(
            where={
                "property_id": property_id,
                "property": {
                    "user_id": user_id,
                },
            }
        )