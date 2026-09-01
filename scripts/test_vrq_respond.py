import sys, os
sys.path.insert(0, os.path.abspath("."))
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)
res = client.post("/api/v1/verification-requests/vrq_c8b6b9ad/respond", json={"status": "RESOLVED", "note": "Road is clear"})
print("Response Status:", res.status_code)
print("Response JSON:", res.json())