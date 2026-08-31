import asyncio
import httpx
import sys, os
sys.path.insert(0, os.path.abspath("."))
from backend.app.core.config import settings

async def list_models():
    api_key = settings.GEMINI_API_KEY
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url)
        print("ListModels Status:", resp.status_code)
        if resp.status_code == 200:
            data = resp.json()
            models = [m["name"] for m in data.get("models", []) if "generateContent" in m.get("supportedGenerationMethods", [])]
            print("Available generation models:", models[:8])
        else:
            print("Error response:", resp.text)

asyncio.run(list_models())