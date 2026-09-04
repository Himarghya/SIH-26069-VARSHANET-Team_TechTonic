import os
from typing import List, Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "VARSHANET - National Weather Big Data Analytics & Citizen Intelligence Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "varshanet-super-secret-national-weather-security-key-2026")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Database (SQLite with spatial emulation fallback or PostgreSQL/PostGIS)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./varshanet.db")
    
    # Redis
    REDIS_URL: Optional[str] = os.getenv("REDIS_URL", None)
    
    # Kafka
    KAFKA_BOOTSTRAP_SERVERS: str = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
    KAFKA_ENABLED: bool = os.getenv("KAFKA_ENABLED", "false").lower() == "true"
    
    # Storage
    STORAGE_DIR: str = os.getenv("STORAGE_DIR", "./data/media")
    RAW_DATA_DIR: str = os.getenv("RAW_DATA_DIR", "./data/raw")
    PARQUET_DIR: str = os.getenv("PARQUET_DIR", "./data/processed/parquet")
    
    # Ingestion & Sync Configuration
    AUTO_SYNC_INTERVAL_SECONDS: int = int(os.getenv("AUTO_SYNC_INTERVAL_SECONDS", "300"))
    NEWS_RETENTION_HOURS: int = int(os.getenv("NEWS_RETENTION_HOURS", "6"))
    NEWS_CHANNELS: str = os.getenv("NEWS_CHANNELS", "google_news,times_of_india,ndtv,india_today,downtoearth,newsapi")
    ENABLE_LIVE_NEWS_API: bool = os.getenv("ENABLE_LIVE_NEWS_API", "true").lower() == "true"

    # External APIs (Configurable via .env)
    WEATHER_API_KEY: Optional[str] = os.getenv("WEATHER_API_KEY", "")
    NEWS_API_KEY: Optional[str] = os.getenv("NEWS_API_KEY", "")
    MAP_API_KEY: Optional[str] = os.getenv("MAP_API_KEY", "")
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", "")
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "allow"

settings = Settings()
