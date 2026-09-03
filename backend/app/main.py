import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.database import engine, Base
from backend.app.api.v1.api import api_router
from backend.app.api.websocket import ws_manager
from ingestion.automation.live_ingestion_service import live_ingestion_service

# Ensure tables are created
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start live weather & news ingestion automation service
    live_ingestion_service.start()
    yield
    # Shutdown: Cleanly stop background tasks
    live_ingestion_service.stop()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="VARSHANET: National Weather Big Data Analytics, Real-Time AI Verification and Citizen Intelligence Platform for India.",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)

# Robust CORS Configuration supporting all localhost/Vite ports
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"]
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.websocket("/ws/weather")
async def websocket_weather_feed(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text('{"type": "PONG"}')
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

@app.get("/")
def root():
    return {
        "platform": "VARSHANET 2.0 National Meteorological Decision Support Grid",
        "status": "OPERATIONAL",
        "api_docs": "/api/docs",
        "active_automation_interval_seconds": 300
    }