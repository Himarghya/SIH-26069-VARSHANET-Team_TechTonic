import sys, os
sys.path.insert(0, os.path.abspath("."))

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

print("=== 1. Testing AI & Google Gemini Live Pipeline ===")
payload = {
    "text": "Cloudburst and severe flash flood in Maldevta Dehradun! Bridge washed away, river water entered houses, SDRF teams deployed on site.",
    "city": "Dehradun",
    "state": "Uttarakhand",
    "source_type": "citizen_report"
}
res = client.post("/api/v1/analytics/test-ai", json=payload)
data = res.json()

print("\n[INPUT]:", data["input_text"])
print("\n[GOOGLE GEMINI LLM STAGE]:")
print("  • Gemini Active:", data["gemini_llm_stage"].get("gemini_active"))
print("  • Model Used:", data["gemini_llm_stage"].get("model"))
print("  • API Execution Latency:", data["gemini_llm_stage"].get("latency_ms"), "ms")
print("  • Gemini Damage Reasoning:", data["gemini_llm_stage"].get("reasoning"))
print("  • Gemini Classified Event:", data["gemini_llm_stage"].get("event_type"))
print("  • Gemini Severity:", data["gemini_llm_stage"].get("severity"))

print("\n[LOCAL ML & NLP STAGE]:")
print("  • Event Type:", data["local_ml_stage"]["event_type"])
print("  • ML Confidence Score:", f"{data['local_ml_stage']['ml_confidence_score']*100:.1f}%")

print("\n[POSTGIS GEO-RESOLVER STAGE]:")
print("  • Resolved Location:", data["geospatial_stage"]["resolved_city"], data["geospatial_stage"]["resolved_state"])
print("  • Coordinates:", data["geospatial_stage"]["latitude"], data["geospatial_stage"]["longitude"])

print("\n[MULTI-FACTOR CREDIBILITY STAGE]:")
print("  • Final Trust Score:", data["credibility_stage"]["final_score"], "/ 100")
print("  • Verification Status:", data["credibility_stage"]["verification_status"])