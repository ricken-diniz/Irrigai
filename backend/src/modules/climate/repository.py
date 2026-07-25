from datetime import datetime, timezone
from typing import Optional
from prisma import Prisma
from prisma.models import ClimateData


class ClimateRepository:
    def __init__(self, db: Prisma):
        self.db = db

    async def get_fresh(self, municipality: str, state: str, month: int, year: int) -> Optional[ClimateData]:
        return await self.db.climatedata.find_first(
            where={
                "municipality": municipality,
                "state": state,
                "reference_month": month,
                "reference_year": year,
                "expires_at": {"gt": datetime.now(timezone.utc)},
            }
        )

    async def upsert(self, municipality: str, state: str, month: int, year: int, data: dict) -> ClimateData:
        return await self.db.climatedata.upsert(
            where={
                "municipality_state_reference_month_reference_year": {
                    "municipality": municipality, "state": state,
                    "reference_month": month, "reference_year": year,
                }
            },
            data={"create": {**data, "municipality": municipality, "state": state,
                              "reference_month": month, "reference_year": year},
                  "update": data},
        )