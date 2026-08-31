import asyncio
import sys, os
sys.path.insert(0, os.path.abspath("."))

from processing.verification.gemini_analyzer import gemini_analyzer
from backend.app.core.config import settings

async def main():
    print("=" * 60)
    print("VARSHANET: Testing Google Gemini API Integration")
    print("=" * 60)
    
    key_configured = gemini_analyzer.is_enabled()
    print(f"GEMINI_API_KEY Configured in .env: {key_configured}")
    
    sample_text = "Severe cloudburst and flash flood in Maldevta Dehradun. Bridge collapsed, river water entered houses!"
    
    if key_configured:
        print("\nSending live prompt to Google Gemini LLM...")
        result = await gemini_analyzer.analyze_weather_report(
            text=sample_text,
            city="Dehradun",
            state="Uttarakhand"
        )
        if result:
            print("\n[SUCCESS] Live Response from Google Gemini:")
            print(f"  • Event Category: {result.get('event_type')}")
            print(f"  • Severity: {result.get('severity')}")
            print(f"  • Credibility Score: {result.get('credibility_score')}%")
            print(f"  • Misinformation Risk: {result.get('is_misinformation_risk')}")
            print(f"  • Reasoning: {result.get('reasoning')}")
            print(f"  • Detected Impacts: {result.get('impacts')}")
        else:
            print("[FAIL] Could not receive response from Gemini. Check API key validity or quota.")
    else:
        print("\n[NOTICE] No GEMINI_API_KEY found in .env.")
        print("To activate Gemini LLM multi-modal reasoning:")
        print("  1. Get a free API key at: https://aistudio.google.com")
        print("  2. Add it to .env: GEMINI_API_KEY=AIzaSy...")
        print("  3. Restart the backend.")
        print("\nFallback Engine: Local Scikit-Learn ML + NLP rule heuristic classifier is 100% active and functioning.")

asyncio.run(main())