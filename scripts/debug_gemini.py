import asyncio
import httpx
import sys, os
sys.path.insert(0, os.path.abspath("."))
from backend.app.core.config import settings

async def debug():
    api_key = settings.GEMINI_API_KEY
    model = "gemma-4-26b-a4b-it"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {"contents": [{"parts": [{"text": "Summarize weather in 5 words"}]}]}
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload)
            print("Status:", resp.status_code)
            print("Response text:", resp.text)
    except Exception as e:
        print("Error exception:", repr(e))

asyncio.run(debug())