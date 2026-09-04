import os
from typing import List, Optional
from pydantic_settings import BaseSettings

def get_default_db_url() -> str:
    if os.getenv("DATABASE_URL"):
        return os.getenv("DATABASE_URL")
    if os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"):
        return "sqlite:////tmp/varshanet.db"
    return "sqlite:///./varshanet.db"

is_serverless = bool(os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"))

class Settings(BaseSettings):
    PROJECT_NAME: str = "VARSHANET - National Weather Big Data Analytics & Citizen Intelligence Platform"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    APP_ENV: str = os.getenv("APP_ENV", "production" if is_serverless else "development")
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "varshanet-super-secret-national-weather-security-key-2026")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Database (auto-switches to /tmp on Vercel/Serverless)
    DATABASE_URL: str = get_default_db_url()
    
    # Redis
    REDIS_URL: Optional[str] = os.getenv("REDIS_URL", None)
    
    # Kafka
    KAFKA_BOOTSTRAP_SERVERS: str = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
    KAFKA_ENABLED: bool = os.getenv("KAFKA_ENABLED", "false").lower() == "true"
    
    # Storage
    STORAGE_DIR: str = os.getenv("STORAGE_DIR", "/tmp/data/media" if is_serverless else "./data/media")
    RAW_DATA_DIR: str = os.getenv("RAW_DATA_DIR", "/tmp/data/raw" if is_serverless else "./data/raw")
    PARQUET_DIR: str = os.getenv("PARQUET_DIR", "/tmp/data/processed/parquet" if is_serverless else "./data/processed/parquet")
    
    # Ingestion & Sync Configuration
    AUTO_SYNC_INTERVAL_SECONDS: int = int(os.getenv("AUTO_SYNC_INTERVAL_SECONDS", "300"))
    NEWS_RETENTION_HOURS: int = int(os.getenv("NEWS_RETENTION_HOURS", "6"))
    NEWS_CHANNELS: str = os.getenv("NEWS_CHANNELS", "google_news,times_of_india,ndtv,india_today,downtoearth,newsapi")
    ENABLE_LIVE_NEWS_API: bool = os.getenv("ENABLE_LIVE_NEWS_API", "false" if is_serverless else "true").lower() == "true"

    # External APIs
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
