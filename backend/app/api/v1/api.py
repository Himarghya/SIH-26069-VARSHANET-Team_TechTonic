from fastapi import APIRouter
from backend.app.api.v1 import (
    auth, reports, events, analytics, map,
    verification, alerts, citizen, system, sources,
    impact, verification_requests
)

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(reports.router)
api_router.include_router(events.router)
api_router.include_router(analytics.router)
api_router.include_router(map.router)
api_router.include_router(verification.router)
api_router.include_router(alerts.router)
api_router.include_router(citizen.router)
api_router.include_router(system.router)
api_router.include_router(sources.router)
api_router.include_router(impact.router)
api_router.include_router(verification_requests.router)