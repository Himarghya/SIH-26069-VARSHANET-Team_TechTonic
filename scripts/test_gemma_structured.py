import asyncio
import httpx
import json
import sys, os
sys.path.insert(0, os.path.abspath("."))
from backend.app.core.config import settings

async def test():
    api_key = settings.GEMINI_API_KEY
    model = "gemma-4-26b-a4b-it"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    
    prompt = """You are VARSHANET AI for India. Analyze this weather statement:
"Heavy waterlogging and cloudburst in Dehradun Sahastradhara, SDRF rescue teams deployed!"
Location: Dehradun, Uttarakhand

Return ONLY a JSON object:
{"event_type": "Cloudburst", "severity": "CRITICAL", "credibility_score": 92, "reasoning": "Severe localized precipitation event triggering emergency SDRF deployment."}
"""
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(url, json=payload)
        print("Status:", resp.status_code)
        if resp.status_code == 200:
            print("Model Output:\n", resp.json()["candidates"][0]["content"]["parts"][0]["text"])

asyncio.run(test())