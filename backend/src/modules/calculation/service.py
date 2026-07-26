from fastapi import HTTPException, status

from src.modules.calculation.repository import CalculationRepository
from src.modules.calculation.schemas import CalculationCreate, CalculationInput, CalculationRead
from src.modules.climate.service import ClimateService


class CalculationService:
    def __init__(
        self,
        calculation_repository: CalculationRepository,
        climate_service: ClimateService,
    ):
        self.repository = calculation_repository
        self.climate_service = climate_service

    async def get_today(self, payload: CalculationInput, force: bool = False) -> CalculationRead:
        """
        Returns today's irrigation recommendation for the given crop and location.
        Raises:
            HTTPException(409): If a valid recommendation already exists and
            the calculation is not forced.
        """

        if not force:
            await self._validate_existing(payload)

        eto = await self.climate_service.get_eto_today(
            h3_token=payload.h3_token
        )
        calculation = await self._calculate(payload, eto)

        created = await self.repository.create(calculation)

        return CalculationRead.model_validate(created)

    async def forced_get_today(self, payload: CalculationInput) -> CalculationRead:
        """
        Forces the creation of a new irrigation recommendation.
        """
        return await self.get_today(payload, force=True)

    async def _validate_existing(self, payload: CalculationInput) -> None:
        """
        Checks whether a valid irrigation recommendation already exists within the current irrigation interval.
        """
        existing = await self.repository.find_valid(
            h3_token=payload.h3_token,
            irrigation_interval_days=payload.irrigation_interval_days,
        )

        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A valid irrigation recommendation already exists for this location. Use the force calculation endpoint if you want to recalculate.",
            )

    async def _calculate(self, payload: CalculationInput, climate) -> CalculationCreate: # TODO: adicionar documetação do ClimateEtoRead no parametro climate
        kc = self._map_crop_kc(payload.crop_type)

        eto = climate.et0
        etc = eto * kc

        lamina_liquida = etc * payload.irrigation_interval_days

        efficiency = self._map_system_efficiency(payload.irrigation_system)

        lamina_bruta = lamina_liquida / efficiency

        area_m2 = payload.area_planted_hectares * 10000
        volume_total = lamina_bruta * area_m2

        return CalculationCreate(
            crop_id=payload.crop_id,
            climate_data_id=climate.id,
            irrigation_interval_days=payload.irrigation_interval_days,
            etcrop_mm=etc,
            lamina_liquida_mm=lamina_liquida,
            lamina_bruta_mm=lamina_bruta,
            tempo_irrigacao_hours=0,
            volume_total_liters=volume_total,
        )

    def _map_crop_kc(self, crop_type: str) -> float:
        """
        TODO:
        Map a crop type to its crop coefficient (Kc).
        """
        raise NotImplementedError

    def _map_system_efficiency(self, irrigation_system: str) -> float:
        """
        TODO:
        Map an irrigation system type to its application efficiency.
        """
        raise NotImplementedError