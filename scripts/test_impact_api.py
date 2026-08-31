import sys, os
sys.path.insert(0, os.path.abspath("."))

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

events = client.get("/api/v1/events").json()
if events:
    evt_id = events[0]["id"]
    print("Testing Impact Nowcasting for Event:", evt_id, events[0]["title"])
    
    impact_res = client.get(f"/api/v1/impact/{evt_id}")
    print("Impact Status Code:", impact_res.status_code)
    data = impact_res.json()["impact_evaluation"]
    
    print("\n[1. THREE DISTINCT SCORES]:")
    print("  • Evidence Confidence:", data["scores"]["evidence_confidence"], "/ 100")
    print("  • Impact Risk Score:", data["scores"]["impact_risk"], "/ 100")
    print("  • Response Priority:", data["scores"]["response_priority"])
    
    print("\n[2. POPULATION EXPOSURE]:")
    print("  • Total Exposed:", f"{data['population_exposure']['total_population_exposed']:,}")
    print("  • Vulnerable Count:", f"{data['population_exposure']['vulnerable_population_exposed']:,}")
    
    print("\n[3. NOWCAST TRAJECTORY]:")
    for step in data["nowcast_trajectory"]:
        print(f"  • {step['time_label']}: Risk {step['predicted_risk_score']} ({step['predicted_severity']})")
        
    print("\n[4. RESPONSE RECOMMENDATIONS]:")
    for rec in data["response_recommendations"][:2]:
        print(f"  • [{rec['priority_label']}] {rec['action']}")
        
    print("\n[5. INFORMATION GAPS]:")
    for gap in data["information_gaps"]:
        print(f"  • Gap: {gap['missing_information']}")

print("\nIMPACT API TEST SUCCESSFUL!")