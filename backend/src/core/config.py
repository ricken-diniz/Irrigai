from pathlib import Path
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).parent.parent.parent

class Settings(BaseSettings):
    DEBUG: bool
    BASE_DIR: Path = BASE_DIR
    SRC_DIR: Path = BASE_DIR / "src"
    APP_NAME: str = "Irrigaí"
    APP_VERSION: str = "1.0.0"
    PORT: int

    # Supabase
    SUPABASE_URL: str
    SUPABASE_PUBLISHABLE_KEY: str
    SUPABASE_SECRET_KEY: SecretStr
    DATABASE_URL: SecretStr

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

settings = Settings()