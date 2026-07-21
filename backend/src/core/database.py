import logging
from typing import Optional
from supabase._async.client import AsyncClient, create_client
from prisma import Prisma
from src.core.config import settings

logger = logging.getLogger(__name__)

prisma = Prisma()

_supabase: Optional[AsyncClient] = None
_supabase_admin: Optional[AsyncClient] = None


async def connect_db() -> None:
    global _supabase, _supabase_admin

    if not prisma.is_connected():
        logger.info("Connecting to the database via Prisma...")
        await prisma.connect()
        logger.info("Prisma connection established.")

    if _supabase is None:
        _supabase = await create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_PUBLISHABLE_KEY,
        )
        logger.info("Supabase client initialized.")

    if _supabase_admin is None:
        _supabase_admin = await create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SECRET_KEY,
        )
        logger.info("Supabase admin client initialized.")


async def disconnect_db() -> None:
    global _supabase, _supabase_admin

    if prisma.is_connected():
        logger.info("Disconnecting from the database...")
        await prisma.disconnect()
        logger.info("Prisma connection closed.")

    _supabase = None
    _supabase_admin = None


def get_supabase() -> AsyncClient:
    if _supabase is None:
        raise RuntimeError("Supabase client not initialized. Did the app startup run?")
    return _supabase


def get_supabase_admin() -> AsyncClient:
    if _supabase_admin is None:
        raise RuntimeError("Supabase admin client not initialized. Did the app startup run?")
    return _supabase_admin