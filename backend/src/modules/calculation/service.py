from src.modules.calculation.repository import CalculationRepository
from src.modules.calculation.schemas import CalculationCreate

class CalculationService:
    def __init__(self, repository: CalculationRepository):
        self.repository = repository

    async def get_today(self, payload: CalculationCreate):
        ...