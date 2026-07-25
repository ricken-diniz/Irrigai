from prisma import Prisma
from prisma.models import Calculation

class CalculationRepository:

    def __init__(self, db: Prisma):
            self.db = db