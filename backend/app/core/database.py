from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.app.core.config import settings

connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

_db_initialized = False

def get_db():
    global _db_initialized
    if not _db_initialized:
        try:
            from backend.app.core.init_db import init_and_refresh_database
            init_and_refresh_database()
            _db_initialized = True
        except Exception as e:
            print(f"[VARSHANET DB AUTO-INIT WARNING] {e}")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
