from datetime import date, datetime, timedelta, timezone
from src.modules.climate.repository import ClimateRepository


class ClimateService:
    def __init__(self, repository: ClimateRepository):
        self.repository = repository

    async def get_climate_for(self, municipality: str, state: str) -> dict:
        # TODO: Implementar
        today = date.today()
        cached = await self.repository.get_fresh(municipality, state, today.month, today.year)
        if cached:
            return cached.model_dump()

        fresh_data = await self._fetch_external(municipality, state)  # INMET/MERRA2
        fresh_data["last_fetched_at"] = datetime.now(timezone.utc)
        fresh_data["expires_at"] = datetime.now(timezone.utc) + timedelta(days=30)

        saved = await self.repository.upsert(municipality, state, today.month, today.year, fresh_data)
        return saved.model_dump()

    async def _fetch_external(self, municipality: str, state: str) -> dict:
        # TODO: integração real com INMET/MERRA2
        raise NotImplementedError