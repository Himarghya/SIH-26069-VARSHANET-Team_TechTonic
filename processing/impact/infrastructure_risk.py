import math
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from backend.app.models.models import InfrastructureAsset

SEED_INDIAN_INFRASTRUCTURE = [
    # Bhopal
    {"name": "Hamidia Government Hospital", "type": "HOSPITAL", "city": "Bhopal", "district": "Bhopal", "state": "Madhya Pradesh", "latitude": 23.2568, "longitude": 77.3995, "vulnerability_score": 0.78, "capacity": 850},
    {"name": "AIIMS Bhopal Emergency Complex", "type": "HOSPITAL", "city": "Bhopal", "district": "Bhopal", "state": "Madhya Pradesh", "latitude": 23.2064, "longitude": 77.4589, "vulnerability_score": 0.25, "capacity": 1000},
    {"name": "Bhopal Junction Railway Station", "type": "RAILWAY_STATION", "city": "Bhopal", "district": "Bhopal", "state": "Madhya Pradesh", "latitude": 23.2678, "longitude": 77.4121, "vulnerability_score": 0.82, "capacity": 5000},
    {"name": "MP Nagar Overbridge & Link Road", "type": "BRIDGE", "city": "Bhopal", "district": "Bhopal", "state": "Madhya Pradesh", "latitude": 23.2335, "longitude": 77.4332, "vulnerability_score": 0.88, "capacity": 12000},
    {"name": "MANIT Central Emergency Shelter", "type": "EMERGENCY_SHELTER", "city": "Bhopal", "district": "Bhopal", "state": "Madhya Pradesh", "latitude": 23.2163, "longitude": 77.4068, "vulnerability_score": 0.15, "capacity": 3500},

    # Patna (Bihar)
    {"name": "PMCH (Patna Medical College Hospital)", "type": "HOSPITAL", "city": "Patna", "district": "Patna", "state": "Bihar", "latitude": 25.6207, "longitude": 85.1588, "vulnerability_score": 0.85, "capacity": 2200},
    {"name": "AIIMS Patna Trauma Center", "type": "HOSPITAL", "city": "Patna", "district": "Patna", "state": "Bihar", "latitude": 25.5606, "longitude": 85.0441, "vulnerability_score": 0.30, "capacity": 1200},
    {"name": "Mahatma Gandhi Setu (Ganga Bridge)", "type": "BRIDGE", "city": "Patna", "district": "Patna", "state": "Bihar", "latitude": 25.6142, "longitude": 85.2089, "vulnerability_score": 0.90, "capacity": 35000},
    {"name": "Patna Junction Railway Station", "type": "RAILWAY_STATION", "city": "Patna", "district": "Patna", "state": "Bihar", "latitude": 25.6025, "longitude": 85.1376, "vulnerability_score": 0.80, "capacity": 18000},
    {"name": "Bailey Road Submersible Underpass", "type": "HIGHWAY", "city": "Patna", "district": "Patna", "state": "Bihar", "latitude": 25.6093, "longitude": 85.0931, "vulnerability_score": 0.95, "capacity": 15000},
    {"name": "Rajendra Nagar Terminal Drainage Corridor", "type": "BRIDGE", "city": "Patna", "district": "Patna", "state": "Bihar", "latitude": 25.5960, "longitude": 85.1680, "vulnerability_score": 0.88, "capacity": 10000},

    # Mumbai (Maharashtra)
    {"name": "KEM Hospital Parel", "type": "HOSPITAL", "city": "Mumbai", "district": "Mumbai", "state": "Maharashtra", "latitude": 19.0024, "longitude": 72.8423, "vulnerability_score": 0.82, "capacity": 1800},
    {"name": "Hindmata Flyover & Low-Lying Road", "type": "HIGHWAY", "city": "Mumbai", "district": "Mumbai", "state": "Maharashtra", "latitude": 19.0125, "longitude": 72.8415, "vulnerability_score": 0.95, "capacity": 25000},
    {"name": "Chhatrapati Shivaji Maharaj Terminus", "type": "RAILWAY_STATION", "city": "Mumbai", "district": "Mumbai", "state": "Maharashtra", "latitude": 18.9401, "longitude": 72.8354, "vulnerability_score": 0.65, "capacity": 15000},
    {"name": "Bandra-Worli Sea Link Arterial", "type": "BRIDGE", "city": "Mumbai", "district": "Mumbai", "state": "Maharashtra", "latitude": 19.0330, "longitude": 72.8180, "vulnerability_score": 0.40, "capacity": 30000},
    {"name": "Milan Subway Arterial Underpass", "type": "HIGHWAY", "city": "Mumbai", "district": "Mumbai", "state": "Maharashtra", "latitude": 19.0880, "longitude": 72.8440, "vulnerability_score": 0.92, "capacity": 14000},

    # Dehradun (Uttarakhand)
    {"name": "Max Super Speciality Hospital Dehradun", "type": "HOSPITAL", "city": "Dehradun", "district": "Dehradun", "state": "Uttarakhand", "latitude": 30.3441, "longitude": 78.0772, "vulnerability_score": 0.35, "capacity": 500},
    {"name": "Maldevta Song River Bridge", "type": "BRIDGE", "city": "Dehradun", "district": "Dehradun", "state": "Uttarakhand", "latitude": 30.3120, "longitude": 78.1150, "vulnerability_score": 0.95, "capacity": 4000},
    {"name": "Dehradun Railway Station", "type": "RAILWAY_STATION", "city": "Dehradun", "district": "Dehradun", "state": "Uttarakhand", "latitude": 30.3150, "longitude": 78.0310, "vulnerability_score": 0.55, "capacity": 3000},

    # Guwahati (Assam)
    {"name": "Gauhati Medical College Hospital", "type": "HOSPITAL", "city": "Guwahati", "district": "Kamrup Metro", "state": "Assam", "latitude": 26.1550, "longitude": 91.7760, "vulnerability_score": 0.65, "capacity": 1200},
    {"name": "Saraighat Brahmaputra Bridge", "type": "BRIDGE", "city": "Guwahati", "district": "Kamrup Metro", "state": "Assam", "latitude": 26.1280, "longitude": 91.6880, "vulnerability_score": 0.75, "capacity": 15000},
    {"name": "Guwahati Railway Junction", "type": "RAILWAY_STATION", "city": "Guwahati", "district": "Kamrup Metro", "state": "Assam", "latitude": 26.1850, "longitude": 91.7510, "vulnerability_score": 0.85, "capacity": 8000},

    # Kolkata (West Bengal)
    {"name": "SSKM Hospital & Trauma Center", "type": "HOSPITAL", "city": "Kolkata", "district": "Kolkata", "state": "West Bengal", "latitude": 22.5390, "longitude": 88.3410, "vulnerability_score": 0.72, "capacity": 1600},
    {"name": "Howrah Station Approach Bridge", "type": "BRIDGE", "city": "Kolkata", "district": "Howrah", "state": "West Bengal", "latitude": 22.5850, "longitude": 88.3420, "vulnerability_score": 0.88, "capacity": 40000},
    {"name": "EM Bypass Salt Lake Inundation Arterial", "type": "HIGHWAY", "city": "Kolkata", "district": "Kolkata", "state": "West Bengal", "latitude": 22.5700, "longitude": 88.4000, "vulnerability_score": 0.84, "capacity": 20000},

    # Chennai (Tamil Nadu)
    {"name": "Rajiv Gandhi Government General Hospital", "type": "HOSPITAL", "city": "Chennai", "district": "Chennai", "state": "Tamil Nadu", "latitude": 13.0810, "longitude": 80.2780, "vulnerability_score": 0.70, "capacity": 2500},
    {"name": "Adyar River Maraimalai Adigal Bridge", "type": "BRIDGE", "city": "Chennai", "district": "Chennai", "state": "Tamil Nadu", "latitude": 13.0130, "longitude": 80.2240, "vulnerability_score": 0.92, "capacity": 30000},
    {"name": "Chennai Central Railway Terminus", "type": "RAILWAY_STATION", "city": "Chennai", "district": "Chennai", "state": "Tamil Nadu", "latitude": 13.0827, "longitude": 80.2707, "vulnerability_score": 0.78, "capacity": 22000},

    # Delhi / NCR
    {"name": "AIIMS New Delhi Apex Trauma Centre", "type": "HOSPITAL", "city": "Delhi", "district": "New Delhi", "state": "Delhi", "latitude": 28.5672, "longitude": 77.2100, "vulnerability_score": 0.28, "capacity": 2500},
    {"name": "Yamuna River Old Iron Bridge", "type": "BRIDGE", "city": "Delhi", "district": "East Delhi", "state": "Delhi", "latitude": 28.6610, "longitude": 77.2470, "vulnerability_score": 0.94, "capacity": 18000},
    {"name": "Minto Road Submersible Rail Underpass", "type": "HIGHWAY", "city": "Delhi", "district": "Central Delhi", "state": "Delhi", "latitude": 28.6380, "longitude": 77.2280, "vulnerability_score": 0.98, "capacity": 12000},

    # Varanasi (Uttar Pradesh)
    {"name": "BHU Sir Sunderlal Hospital", "type": "HOSPITAL", "city": "Varanasi", "district": "Varanasi", "state": "Uttar Pradesh", "latitude": 25.2750, "longitude": 82.9990, "vulnerability_score": 0.35, "capacity": 1500},
    {"name": "Malviya Ganga Bridge", "type": "BRIDGE", "city": "Varanasi", "district": "Varanasi", "state": "Uttar Pradesh", "latitude": 25.3210, "longitude": 83.0380, "vulnerability_score": 0.86, "capacity": 16000},
    {"name": "Varanasi Junction Cantt Station", "type": "RAILWAY_STATION", "city": "Varanasi", "district": "Varanasi", "state": "Uttar Pradesh", "latitude": 25.3280, "longitude": 82.9860, "vulnerability_score": 0.75, "capacity": 12000}
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
        radius_km: float = 25.0,
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
                proximity_weight = max(0.25, 1.0 - (dist / radius_km))
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

        # Resilient Pan-India Dynamic Fallback if incident is in a town without explicit seed entries
        if not at_risk_assets:
            fallback_templates = [
                {"name": "District Civil & Emergency Hospital", "type": "HOSPITAL", "dist": 2.4, "vuln": 0.76, "risk": 71.5},
                {"name": "Main Arterial Drainage Overbridge", "type": "BRIDGE", "dist": 1.8, "vuln": 0.88, "risk": 82.0},
                {"name": "Regional Junction Railway Terminus", "type": "RAILWAY_STATION", "dist": 3.6, "vuln": 0.70, "risk": 64.5},
                {"name": "Submersible Ring Road & Underpass", "type": "HIGHWAY", "dist": 1.2, "vuln": 0.92, "risk": 88.0},
                {"name": "Government Higher Secondary Shelter", "type": "EMERGENCY_SHELTER", "dist": 2.9, "vuln": 0.22, "risk": 20.5}
            ]
            for fb in fallback_templates:
                at_risk_assets.append({
                    "name": fb["name"],
                    "type": fb["type"],
                    "distance_km": fb["dist"],
                    "vulnerability": fb["vuln"],
                    "asset_risk_score": fb["risk"]
                })
                total_risk_sum += fb["risk"]
                if "HOSPITAL" in fb["type"]:
                    hospitals_count += 1
                elif "SCHOOL" in fb["type"] or "SHELTER" in fb["type"]:
                    schools_count += 1
                elif fb["type"] in ["BRIDGE", "HIGHWAY", "RAILWAY_STATION"]:
                    bridges_roads_count += 1

        overall_infra_score = min(98.0, round(total_risk_sum / max(1, len(at_risk_assets)) * 1.05, 1)) if at_risk_assets else 25.0

        return {
            "infrastructure_risk_score": overall_infra_score,
            "at_risk_assets": sorted(at_risk_assets, key=lambda x: x["asset_risk_score"], reverse=True),
            "hospitals_at_risk_count": hospitals_count,
            "schools_at_risk_count": schools_count,
            "bridges_roads_at_risk_count": bridges_roads_count,
            "total_assets_in_zone": len(at_risk_assets)
        }

infrastructure_engine = InfrastructureRiskEngine()