import httpx
from datetime import datetime, timezone
from typing import List, Dict, Optional

class WeatherAPIConnector:
    """
    Integrates OpenWeather / OpenMeteo live observation data across Indian coordinates.
    """
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
        
    async def fetch_live_weather(self, lat: float, lon: float, city_name: str, state_name: str) -> Optional[Dict]:
        try:
            # Free open-meteo endpoint requiring zero API keys
            url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m"
            async with httpx.AsyncClient(timeout=4.0) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    data = resp.json()
                    curr = data.get("current", {})
                    rain = curr.get("rain", 0.0)
                    temp = curr.get("temperature_2m", 28.0)
                    wind = curr.get("wind_speed_10m", 12.0)
                    
                    event_type = "Rainfall" if rain > 0.5 else "Other"
                    if rain > 15.0:
                        event_type = "Heavy Rainfall"
                    elif temp > 40.0:
                        event_type = "Heatwave"
                        
                    return {
                        "source_id": f"openmeteo_{city_name.lower()}",
                        "source_type": "weather_api",
                        "source_name": "Open-Meteo Meteorological API",
                        "author": "IMD_Synoptic_Feed",
                        "text": f"Automated Weather Station in {city_name}, {state_name} recorded temp {temp}°C, rainfall {rain}mm/hr, wind speed {wind} km/h.",
                        "timestamp": datetime.now(timezone.utc),
                        "latitude": lat,
                        "longitude": lon,
                        "city": city_name,
                        "state": state_name,
                        "event_type": event_type,
                        "raw_payload": curr
                    }
        except Exception:
            pass
        return None

weather_connector = WeatherAPIConnector()
