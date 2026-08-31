import math
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from backend.app.models.models import InfrastructureAsset

SEED_INDIAN_INFRASTRUCTURE = [
    # Bhopal
    {"name": "AIIMS Bhopal", "type": "HOSPITAL", "city": "Bhopal", "district": "Bhopal", "state": "Madhya Pradesh", "latitude": 23.2064, "longitude": 77.4589, "vulnerability_score": 0.2, "capacity": 1000},
    {"name": "Hamidia Hospital", "type": "HOSPITAL", "city": "Bhopal", "district": "Bhopal", "state": "Madhya Pradesh", "latitude": 23.2568, "longitude": 77.3995, "vulnerability_score": 0.75, "capacity": 850},
    {"name": "Bhopal Junction Railway Station", "type": "RAILWAY_STATION", "city": "Bhopal", "district": "Bhopal", "state": "Madhya Pradesh", "latitude": 23.2678, "longitude": 77.4121, "vulnerability_score": 0.8, "capacity": 5000},
    {"name": "Raja Bhoj International Airport", "type": "AIRPORT", "city": "Bhopal", "district": "Bhopal", "state": "Madhya Pradesh", "latitude": 23.2875, "longitude": 77.3374, "vulnerability_score": 0.3, "capacity": 2000},
    {"name": "MP Nagar Overbridge & Link Road", "type": "BRIDGE", "city": "Bhopal", "district": "Bhopal", "state": "Madhya Pradesh", "latitude": 23.2335, "longitude": 77.4332, "vulnerability_score": 0.85, "capacity": 12000},
    {"name": "MANIT Central Shelter & Campus", "type": "EMERGENCY_SHELTER", "city": "Bhopal", "district": "Bhopal", "state": "Madhya Pradesh", "latitude": 23.2163, "longitude": 77.4068, "vulnerability_score": 0.15, "capacity": 3500},

    # Mumbai
    {"name": "KEM Hospital Parel", "type": "HOSPITAL", "city": "Mumbai", "district": "Mumbai", "state": "Maharashtra", "latitude": 19.0024, "longitude": 72.8423, "vulnerability_score": 0.8, "capacity": 1800},
    {"name": "Hindmata Flyover & Submersible Road", "type": "HIGHWAY", "city": "Mumbai", "district": "Mumbai", "state": "Maharashtra", "latitude": 19.0125, "longitude": 72.8415, "vulnerability_score": 0.95, "capacity": 25000},
    {"name": "Chhatrapati Shivaji Maharaj Terminus", "type": "RAILWAY_STATION", "city": "Mumbai", "district": "Mumbai", "state": "Maharashtra", "latitude": 18.9401, "longitude": 72.8354, "vulnerability_score": 0.6, "capacity": 15000},
    {"name": "Bandra-Worli Sea Link", "type": "BRIDGE", "city": "Mumbai", "district": "Mumbai", "state": "Maharashtra", "latitude": 19.0330, "longitude": 72.8180, "vulnerability_score": 0.4, "capacity": 30000},

    # Dehradun
    {"name": "Max Super Speciality Hospital Dehradun", "type": "HOSPITAL", "city": "Dehradun", "district": "Dehradun", "state": "Uttarakhand", "latitude": 30.3441, "longitude": 78.0772, "vulnerability_score": 0.35, "capacity": 500},
    {"name": "Maldevta Song River Bridge", "type": "BRIDGE", "city": "Dehradun", "district": "Dehradun", "state": "Uttarakhand", "latitude": 30.3120, "longitude": 78.1150, "vulnerability_score": 0.95, "capacity": 4000},
    {"name": "Dehradun Railway Station", "type": "RAILWAY_STATION", "city": "Dehradun", "district": "Dehradun", "state": "Uttarakhand", "latitude": 30.3150, "longitude": 78.0310, "vulnerability_score": 0.5, "capacity": 3000},

    # Guwahati
    {"name": "Gauhati Medical College Hospital", "type": "HOSPITAL", "city": "Guwahati", "district": "Kamrup Metro", "state": "Assam", "latitude": 26.1550, "longitude": 91.7760, "vulnerability_score": 0.6, "capacity": 1200},
    {"name": "Saraighat Brahmaputra Bridge", "type": "BRIDGE", "city": "Guwahati", "district": "Kamrup Metro", "state": "Assam", "latitude": 26.1280, "longitude": 91.6880, "vulnerability_score": 0.7, "capacity": 15000},
    {"name": "Guwahati Railway Junction", "type": "RAILWAY_STATION", "city": "Guwahati", "district": "Kamrup Metro", "state": "Assam", "latitude": 26.1850, "longitude": 91.7510, "vulnerability_score": 0.85, "capacity": 8000}
]

class InfrastructureRiskEngine:
    @staticmethod
    def calculate_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        R = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    def evaluate_infrastructure_risk(
        self,
        lat: float,
        lon: float,
        radius_km: float = 15.0,
        db_assets: Optional[List[Any]] = None
    ) -> Dict[str, Any]:
        assets_pool = db_assets if db_assets else SEED_INDIAN_INFRASTRUCTURE
        
        at_risk_assets = []
        hospitals_count = 0
        schools_count = 0
        bridges_roads_count = 0
        total_risk_sum = 0.0

        for asset in assets_pool:
            a_lat = asset.latitude if hasattr(asset, "latitude") else asset["latitude"]
            a_lon = asset.longitude if hasattr(asset, "longitude") else asset["longitude"]
            a_type = asset.type if hasattr(asset, "type") else asset["type"]
            a_name = asset.name if hasattr(asset, "name") else asset["name"]
            a_vuln = asset.vulnerability_score if hasattr(asset, "vulnerability_score") else asset.get("vulnerability_score", 0.5)

            dist = self.calculate_distance_km(lat, lon, a_lat, a_lon)
            if dist <= radius_km:
                proximity_weight = max(0.2, 1.0 - (dist / radius_km))
                risk_val = a_vuln * proximity_weight * 100.0
                total_risk_sum += risk_val

                at_risk_assets.append({
                    "name": a_name,
                    "type": a_type,
                    "distance_km": round(dist, 1),
                    "vulnerability": a_vuln,
                    "asset_risk_score": round(risk_val, 1)
                })

                if "HOSPITAL" in a_type:
                    hospitals_count += 1
                elif "SCHOOL" in a_type:
                    schools_count += 1
                elif a_type in ["BRIDGE", "HIGHWAY", "RAILWAY_STATION"]:
                    bridges_roads_count += 1

        overall_infra_score = min(98.0, round(total_risk_sum / max(1, len(at_risk_assets)) * 1.1, 1)) if at_risk_assets else 25.0

        return {
            "infrastructure_risk_score": overall_infra_score,
            "at_risk_assets": sorted(at_risk_assets, key=lambda x: x["asset_risk_score"], reverse=True),
            "hospitals_at_risk_count": hospitals_count,
            "schools_at_risk_count": schools_count,
            "bridges_roads_at_risk_count": bridges_roads_count,
            "total_assets_in_zone": len(at_risk_assets)
        }

infrastructure_engine = InfrastructureRiskEngine()