import math
from typing import Dict, Any, List, Optional

INDIAN_DISTRICT_DEMOGRAPHICS = {
    "bhopal": {"density": 855, "urban_ratio": 0.81, "vulnerable_ratio": 0.28, "total_dist_pop": 2371061},
    "mumbai": {"density": 20980, "urban_ratio": 1.0, "vulnerable_ratio": 0.35, "total_dist_pop": 12442373},
    "delhi": {"density": 11320, "urban_ratio": 0.975, "vulnerable_ratio": 0.32, "total_dist_pop": 16787941},
    "guwahati": {"density": 2010, "urban_ratio": 0.72, "vulnerable_ratio": 0.34, "total_dist_pop": 1253938},
    "dehradun": {"density": 550, "urban_ratio": 0.56, "vulnerable_ratio": 0.26, "total_dist_pop": 1696694},
    "chennai": {"density": 26553, "urban_ratio": 1.0, "vulnerable_ratio": 0.31, "total_dist_pop": 7088000},
    "bengaluru": {"density": 4381, "urban_ratio": 0.91, "vulnerable_ratio": 0.25, "total_dist_pop": 9621551},
    "jaipur": {"density": 598, "urban_ratio": 0.52, "vulnerable_ratio": 0.29, "total_dist_pop": 6626178},
    "bhubaneswar": {"density": 800, "urban_ratio": 0.65, "vulnerable_ratio": 0.30, "total_dist_pop": 1851831},
    "kolkata": {"density": 24252, "urban_ratio": 1.0, "vulnerable_ratio": 0.33, "total_dist_pop": 4496694},
    "thiruvananthapuram": {"density": 1508, "urban_ratio": 0.54, "vulnerable_ratio": 0.24, "total_dist_pop": 3301427}
}

DEFAULT_DEMOGRAPHICS = {"density": 650, "urban_ratio": 0.45, "vulnerable_ratio": 0.28, "total_dist_pop": 1500000}

class PopulationExposureEngine:
    """
    Calculates spatial population exposure and vulnerable counts (elderly, infants, slum settlements)
    around a weather incident polygon or buffer radius.
    """
    def calculate_exposure(
        self,
        city: Optional[str],
        state: str,
        radius_km: float = 10.0,
        severity: str = "HIGH"
    ) -> Dict[str, Any]:
        city_key = city.lower().strip() if city else "unknown"
        demo = INDIAN_DISTRICT_DEMOGRAPHICS.get(city_key, DEFAULT_DEMOGRAPHICS)
        
        # Buffer area = pi * r^2
        area_sqkm = math.pi * (radius_km ** 2)
        
        # Severity scaling factor for active impact zone
        severity_mult = {"CRITICAL": 1.3, "HIGH": 1.0, "MODERATE": 0.7, "LOW": 0.4}.get(severity, 1.0)
        
        raw_exposed = int(area_sqkm * demo["density"] * severity_mult)
        # Cap at district population maximum
        total_exposed = min(raw_exposed, demo["total_dist_pop"])
        
        vulnerable_count = int(total_exposed * demo["vulnerable_ratio"])
        urban_count = int(total_exposed * demo["urban_ratio"])
        rural_count = total_exposed - urban_count
        
        return {
            "total_population_exposed": total_exposed,
            "vulnerable_population_exposed": vulnerable_count,
            "urban_population": urban_count,
            "rural_population": rural_count,
            "population_density_per_sqkm": demo["density"],
            "impact_radius_km": radius_km,
            "data_source_mode": "DEMO / DEMOGRAPHIC BUFFER MODEL"
        }

population_engine = PopulationExposureEngine()