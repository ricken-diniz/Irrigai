from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.core.config import settings
from src.core.database import connect_db, disconnect_db

# TODO: Import your module routers here as you build them
from src.modules.properties.router import router as properties_router
from src.modules.crops.router import router as crops_router
# from src.modules.irrigation.router import router as irrigation_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await disconnect_db()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    debug=settings.DEBUG,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,  # lista explícita, ex: ["https://app.irrigai.com"]
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


# TODO: Include your routers
app.include_router(properties_router, prefix="/api/v1")
app.include_router(crops_router, prefix="/api/v1")
# app.include_router(irrigation_router, prefix="/api/v1")


@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "ok", 
        "app": settings.APP_NAME, 
        "version": settings.APP_VERSION
    }