import asyncio
import httpx
import sys, os
sys.path.insert(0, os.path.abspath("."))
from backend.app.core.config import settings

async def list_all():
    api_key = settings.GEMINI_API_KEY
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url)
        data = resp.json()
        for m in data.get("models", []):
            if "generateContent" in m.get("supportedGenerationMethods", []):
                print(m["name"])

asyncio.run(list_all())