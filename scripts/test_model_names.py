import asyncio
import httpx
import sys, os
sys.path.insert(0, os.path.abspath("."))
from backend.app.core.config import settings

async def test_models():
    api_key = settings.GEMINI_API_KEY
    candidates = ["gemini-2.5-flash-lite", "gemini-flash-latest", "gemini-pro-latest"]
    for model in candidates:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        payload = {"contents": [{"parts": [{"text": "Hello, confirm you are operational"}]}]}
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(url, json=payload)
            print(f"Model {model} -> Status: {resp.status_code}")
            if resp.status_code == 200:
                print("SUCCESS text:", resp.json()["candidates"][0]["content"]["parts"][0]["text"].strip())
                return model
    return None

asyncio.run(test_models())