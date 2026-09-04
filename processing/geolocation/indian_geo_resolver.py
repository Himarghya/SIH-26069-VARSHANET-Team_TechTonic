import re
from typing import Dict, Optional, Tuple

INDIAN_STATES_DATA = {
    "Madhya Pradesh": {"lat": 23.2599, "lon": 77.4126, "cities": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Rewa", "Satna"]},
    "Assam": {"lat": 26.1445, "lon": 91.7362, "cities": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Nagaon", "Tezpur", "Kaziranga"]},
    "Maharashtra": {"lat": 19.0760, "lon": 72.8777, "cities": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur", "Kolhapur", "Navi Mumbai"]},
    "Delhi": {"lat": 28.6139, "lon": 77.2090, "cities": ["New Delhi", "Delhi", "Dwarka", "Rohini", "Connaught Place", "Saket", "Noida", "Gurugram", "Faridabad"]},
    "Karnataka": {"lat": 12.9716, "lon": 77.5946, "cities": ["Bengaluru", "Bangalore", "Mysuru", "Mangaluru", "Hubballi", "Belagavi", "Udupi"]},
    "Tamil Nadu": {"lat": 13.0827, "lon": 80.2707, "cities": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore"]},
    "West Bengal": {"lat": 22.5726, "lon": 88.3639, "cities": ["Kolkata", "Howrah", "Siliguri", "Durgapur", "Asansol", "Darjeeling", "Kharagpur"]},
    "Bihar": {"lat": 25.5941, "lon": 85.1376, "cities": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif"]},
    "Uttar Pradesh": {"lat": 26.8467, "lon": 80.9462, "cities": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Meerut", "Ghaziabad", "Gorakhpur", "Bareilly", "Ayodhya"]},
    "Rajasthan": {"lat": 26.9124, "lon": 75.7873, "cities": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Jaisalmer", "Alwar"]},
    "Gujarat": {"lat": 23.0225, "lon": 72.5714, "cities": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Kutch"]},
    "Odisha": {"lat": 20.2961, "lon": 85.8245, "cities": ["Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur", "Balasore", "Berhampur"]},
    "Kerala": {"lat": 8.5241, "lon": 76.9366, "cities": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Kannur", "Wayanad", "Idukki"]},
    "Uttarakhand": {"lat": 30.3165, "lon": 78.0322, "cities": ["Dehradun", "Haridwar", "Rishikesh", "Nainital", "Haldwani", "Roorkee", "Chamoli", "Kedarnath", "Badrinath"]},
    "Jammu and Kashmir": {"lat": 34.0837, "lon": 74.7973, "cities": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Gulmarg", "Pahalgam", "Udhampur"]},
    "Telangana": {"lat": 17.3850, "lon": 78.4867, "cities": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Secunderabad"]},
    "Andhra Pradesh": {"lat": 16.5062, "lon": 80.6480, "cities": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kakinada", "Kurnool"]},
    "Punjab": {"lat": 31.6340, "lon": 74.8723, "cities": ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda", "Mohali"]},
    "Haryana": {"lat": 30.7333, "lon": 76.7794, "cities": ["Chandigarh", "Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Hisar"]},
    "Himachal Pradesh": {"lat": 31.1048, "lon": 77.1734, "cities": ["Shimla", "Manali", "Dharamshala", "Kullu", "Mandi", "Solan", "Kangra"]},
    "Jharkhand": {"lat": 23.3441, "lon": 85.3096, "cities": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh"]},
    "Chhattisgarh": {"lat": 21.2514, "lon": 81.6296, "cities": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Jagdalpur"]},
    "Goa": {"lat": 15.2993, "lon": 74.1240, "cities": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"]},
    "Tripura": {"lat": 23.8315, "lon": 91.2868, "cities": ["Agartala", "Udaipur", "Dharmanagar"]},
    "Meghalaya": {"lat": 25.5788, "lon": 91.8933, "cities": ["Shillong", "Tura", "Cherrapunji", "Mawsynram", "Jowai"]},
    "Manipur": {"lat": 24.8170, "lon": 93.9368, "cities": ["Imphal", "Churachandpur", "Thoubal"]},
    "Nagaland": {"lat": 25.6751, "lon": 94.1086, "cities": ["Kohima", "Dimapur", "Mokokchung"]},
    "Arunachal Pradesh": {"lat": 27.0844, "lon": 93.6053, "cities": ["Itanagar", "Tawang", "Pasighat", "Ziro"]},
    "Mizoram": {"lat": 23.7271, "lon": 92.7176, "cities": ["Aizawl", "Lunglei", "Champhai"]},
    "Sikkim": {"lat": 27.3389, "lon": 88.6065, "cities": ["Gangtok", "Namchi", "Pelling", "Mangan"]}
}

CITY_TO_STATE_MAP = {}
CITY_COORDINATES = {}

for state, data in INDIAN_STATES_DATA.items():
    for city in data["cities"]:
        CITY_TO_STATE_MAP[city.lower()] = state
        # Slight deterministic variation for city centroid if not root
        CITY_COORDINATES[city.lower()] = {
            "city": city,
            "state": state,
            "latitude": data["lat"],
            "longitude": data["lon"]
        }

# Exact specific coordinates for prominent cities
PROMINENT_CITY_COORDS = {
    "delhi": (28.6139, 77.2090),
    "new delhi": (28.6139, 77.2090),
    "mumbai": (19.0760, 72.8777),
    "bengaluru": (12.9716, 77.5946),
    "bangalore": (12.9716, 77.5946),
    "kolkata": (22.5726, 88.3639),
    "chennai": (13.0827, 80.2707),
    "hyderabad": (17.3850, 78.4867),
    "bhopal": (23.2599, 77.4126),
    "guwahati": (26.1445, 91.7362),
    "patna": (25.5941, 85.1376),
    "lucknow": (26.8467, 80.9462),
    "jaipur": (26.9124, 75.7873),
    "ahmedabad": (23.0225, 72.5714),
    "bhubaneswar": (20.2961, 85.8245),
    "kochi": (9.9312, 76.2673),
    "srinagar": (34.0837, 74.7973),
    "dehradun": (30.3165, 78.0322),
    "thiruvananthapuram": (8.5241, 76.9366),
    "chandigarh": (30.7333, 76.7794),
    "shimla": (31.1048, 77.1734),
    "ranchi": (23.3441, 85.3096),
    "raipur": (21.2514, 81.6296),
    "pune": (18.5204, 73.8567),
    "nagpur": (21.1458, 79.0882),
    "varanasi": (25.3176, 82.9739),
    "amritsar": (31.6340, 74.8723),
    "indore": (22.7196, 75.8577),
    "visakhapatnam": (17.6868, 83.2185),
    "surat": (21.1702, 72.8311)
}

class IndianGeoResolver:
    @staticmethod
    def is_within_india_bounds(lat: float, lon: float) -> bool:
        # India geographic bounding box roughly: 6.0 N to 37.5 N, 68.0 E to 97.5 E
        return (6.0 <= lat <= 37.5) and (68.0 <= lon <= 97.5)

    def extract_location_from_text(self, text: str) -> Optional[Dict]:
        clean_lower = text.lower()
        
        # 1. Match Prominent Cities
        for city_name, (lat, lon) in PROMINENT_CITY_COORDS.items():
            pattern = rf"\b{re.escape(city_name)}\b"
            if re.search(pattern, clean_lower):
                state = CITY_TO_STATE_MAP.get(city_name, "India")
                formatted_city = city_name.title()
                return {
                    "city": formatted_city,
                    "district": formatted_city,
                    "state": state,
                    "latitude": lat,
                    "longitude": lon,
                    "location_confidence": 0.95
                }
                
        # 2. Match All Other Cities
        for city_lower, data in CITY_COORDINATES.items():
            pattern = rf"\b{re.escape(city_lower)}\b"
            if re.search(pattern, clean_lower):
                return {
                    "city": data["city"],
                    "district": data["city"],
                    "state": data["state"],
                    "latitude": data["latitude"],
                    "longitude": data["longitude"],
                    "location_confidence": 0.90
                }
                
        # 3. Match State names
        for state_name, data in INDIAN_STATES_DATA.items():
            pattern = rf"\b{re.escape(state_name.lower())}\b"
            if re.search(pattern, clean_lower):
                return {
                    "city": data["cities"][0],
                    "district": data["cities"][0],
                    "state": state_name,
                    "latitude": data["lat"],
                    "longitude": data["lon"],
                    "location_confidence": 0.75
                }
                
        return None

    def resolve(self, text: str, lat: Optional[float] = None, lon: Optional[float] = None, city: Optional[str] = None, state: Optional[str] = None) -> Dict:
        # If valid GPS coordinates are already provided
        if lat is not None and lon is not None and self.is_within_india_bounds(lat, lon):
            resolved_state = state or "Madhya Pradesh"
            resolved_city = city or "Bhopal"
            if city and city.lower() in CITY_TO_STATE_MAP:
                resolved_state = CITY_TO_STATE_MAP[city.lower()]
            return {
                "latitude": round(lat, 4),
                "longitude": round(lon, 4),
                "city": resolved_city.title() if resolved_city else "Unknown",
                "district": resolved_city.title() if resolved_city else "Unknown",
                "state": resolved_state,
                "location_confidence": 0.98
            }
            
        # Try extracting from text
        extracted = self.extract_location_from_text(text)
        if extracted:
            return extracted
            
        # Fallback to provided city or state
        if city and city.lower() in PROMINENT_CITY_COORDS:
            c_lat, c_lon = PROMINENT_CITY_COORDS[city.lower()]
            return {
                "latitude": c_lat,
                "longitude": c_lon,
                "city": city.title(),
                "district": city.title(),
                "state": CITY_TO_STATE_MAP.get(city.lower(), state or "India"),
                "location_confidence": 0.85
            }
            
        if state and state in INDIAN_STATES_DATA:
            data = INDIAN_STATES_DATA[state]
            return {
                "latitude": data["lat"],
                "longitude": data["lon"],
                "city": data["cities"][0],
                "district": data["cities"][0],
                "state": state,
                "location_confidence": 0.70
            }
            
        # Default National Center (Bhopal, Madhya Pradesh - Center of India)
        return {
            "latitude": 23.2599,
            "longitude": 77.4126,
            "city": "Bhopal",
            "district": "Bhopal",
            "state": "Madhya Pradesh",
            "location_confidence": 0.50
        }

geo_resolver = IndianGeoResolver()
