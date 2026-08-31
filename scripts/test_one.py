import asyncio
import httpx
import sys, os
sys.path.insert(0, os.path.abspath("."))
from backend.app.core.config import settings

async def test_single():
    api_key = settings.GEMINI_API_KEY
    model = "gemini-3.7-flash"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {"contents": [{"parts": [{"text": "Hello, confirm you are operational"}]}]}
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(url, json=payload)
        print(f"Model {model} -> Status: {resp.status_code}")
        if resp.status_code == 200:
            print("Response:", resp.json()["candidates"][0]["content"]["parts"][0]["text"].strip())

asyncio.run(test_single())