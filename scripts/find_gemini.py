import asyncio
import httpx
import sys, os
sys.path.insert(0, os.path.abspath("."))
from backend.app.core.config import settings

async def find_working_gemini():
    api_key = settings.GEMINI_API_KEY
    # Try the top available models for generateContent
    models_to_test = [
        "gemini-2.5-flash",
        "gemini-flash-latest",
        "gemini-2.5-pro",
        "gemini-pro-latest",
        "gemma-4-26b-a4b-it",
        "gemini-3.5-flash",
        "gemini-3.7-flash"
    ]
    
    for m in models_to_test:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={api_key}"
        payload = {
            "contents": [{"parts": [{"text": "You are VARSHANET Weather AI. Reply with: GEMINI_READY"}]}]
        }
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.post(url, json=payload)
                print(f"Testing {m} -> Code {resp.status_code}")
                if resp.status_code == 200:
                    text = resp.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
                    print(f"--> [SUCCESS] Working Model: {m}! Output: {text}")
                    return m
        except Exception as e:
            print(f"Error {m}: {e}")
    return None

asyncio.run(find_working_gemini())