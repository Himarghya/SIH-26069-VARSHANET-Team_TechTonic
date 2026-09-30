from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.app.core.database import get_db

router = APIRouter(prefix="/guidelines", tags=["Disaster Safety Guidelines & Protocols"])

# In-memory storage with optional persistence
CUSTOM_GUIDELINES_STORE: Dict[str, Dict[str, Any]] = {}

class VideoItem(BaseModel):
    title: str
    duration: str = "2:30"
    youtubeId: str
    thumbnailUrl: Optional[str] = None

class GuidelinePayload(BaseModel):
    category: str
    language: str = "English"
    title: str
    beforeTitle: Optional[str] = None
    duringAfterTitle: Optional[str] = None
    before: List[str]
    duringAfter: List[str]
    videos: Optional[List[VideoItem]] = []

@router.get("/dos-donts")
def get_custom_guidelines():
    """Retrieve all admin-published custom guidelines and overrides."""
    return {
        "status": "success",
        "count": len(CUSTOM_GUIDELINES_STORE),
        "guidelines": CUSTOM_GUIDELINES_STORE
    }

@router.post("/dos-donts")
def save_custom_guideline(payload: GuidelinePayload):
    """Publish or update custom Do's & Don'ts for a disaster hazard and language."""
    cat = payload.category.strip()
    lang = payload.language.strip()
    if not cat:
        raise HTTPException(status_code=400, detail="Category name cannot be empty")
    
    if cat not in CUSTOM_GUIDELINES_STORE:
        CUSTOM_GUIDELINES_STORE[cat] = {}

    processed_videos = []
    if payload.videos:
        for v in payload.videos:
            thumbnail = v.thumbnailUrl or f"https://img.youtube.com/vi/{v.youtubeId}/hqdefault.jpg"
            processed_videos.append({
                "title": v.title,
                "duration": v.duration,
                "youtubeId": v.youtubeId,
                "thumbnailUrl": thumbnail
            })

    CUSTOM_GUIDELINES_STORE[cat][lang] = {
        "title": payload.title,
        "beforeTitle": payload.beforeTitle or f"BEFORE {cat.upper()}",
        "duringAfterTitle": payload.duringAfterTitle or f"DURING & AFTER {cat.upper()}",
        "before": payload.before,
        "duringAfter": payload.duringAfter,
        "videos": processed_videos
    }

    return {
        "status": "success",
        "message": f"Successfully published guidelines for {cat} ({lang})",
        "category": cat,
        "language": lang,
        "data": CUSTOM_GUIDELINES_STORE[cat][lang]
    }

@router.delete("/dos-donts/{category}")
def delete_custom_guideline(category: str, language: Optional[str] = None):
    """Delete a custom guideline or reset language override."""
    cat = category.strip()
    if cat in CUSTOM_GUIDELINES_STORE:
        if language and language in CUSTOM_GUIDELINES_STORE[cat]:
            del CUSTOM_GUIDELINES_STORE[cat][language]
            if not CUSTOM_GUIDELINES_STORE[cat]:
                del CUSTOM_GUIDELINES_STORE[cat]
        else:
            del CUSTOM_GUIDELINES_STORE[cat]
        return {"status": "success", "message": f"Guidelines for {cat} reset/removed"}
    
    return {"status": "success", "message": f"No custom override found for {cat}"}
