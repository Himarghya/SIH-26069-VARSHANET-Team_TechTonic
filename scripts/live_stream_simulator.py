import sys, os
sys.path.insert(0, os.path.abspath("."))

import time
import random
import httpx
from datetime import datetime, timezone

LIVE_EVENTS_FEED = [
    {
        "city": "Bhopal", "state": "Madhya Pradesh", "event_type": "Heavy Rainfall",
        "text": "Water gushing into low-lying residential sectors near Habibganj in Bhopal. Rainfall intensifies! #IMD #BhopalRains",
        "source_type": "citizen_report"
    },
    {
        "city": "Mumbai", "state": "Maharashtra", "event_type": "Urban Flooding",
        "text": "Hindmata flyover underpass waterlogged up to 2 feet. Traffic diversion active #MumbaiRains #IMD",
        "source_type": "social_media"
    },
    {
        "city": "Guwahati", "state": "Assam", "event_type": "Flash Flood",
        "text": "Heavy rainfall causes water stagnation on GS Road Guwahati. State authorities issue advisory #AssamFloods",
        "source_type": "rss_news"
    },
    {
        "city": "Delhi", "state": "Delhi", "event_type": "Thunderstorm",
        "text": "Strong convective thunderstorm and lightning strikes reported across south Delhi and Noida #DelhiRains #Thunderstorm",
        "source_type": "citizen_report"
    },
    {
        "city": "Patna", "state": "Bihar", "event_type": "Lightning",
        "text": "Severe lightning warning issued for Patna and surrounding rural blocks. Farmers advised to take shelter #IMD #Bihar",
        "source_type": "government_open_data"
    },
    {
        "city": "Kolkata", "state": "West Bengal", "event_type": "Heavy Rainfall",
        "text": "Monsoon clouds bring sharp spells over Park Street and Salt Lake Kolkata #KolkataRains #WeatherUpdate",
        "source_type": "weather_api"
    }
]

def run_simulator(api_url="http://localhost:8000/api/v1/reports", interval=4.0):
    print("=" * 60)
    print("VARSHANET - National Live Weather Stream Ingestion Simulator")
    print("Streaming real-time simulated events to backend & WebSocket clients...")
    print("=" * 60)
    
    with httpx.Client(timeout=10.0) as client:
        while True:
            event = random.choice(LIVE_EVENTS_FEED)
            payload = {
                "source_id": f"live_{random.randint(10000, 99999)}",
                "source_type": event["source_type"],
                "source_name": "Live Ingestion Stream",
                "author": f"live_feed_{random.randint(10, 99)}",
                "text": event["text"],
                "city": event["city"],
                "state": event["state"],
                "event_type": event["event_type"],
                "hashtags": ["#IMD", f"#{event['city']}Rains"]
            }
            try:
                res = client.post(api_url, json=payload)
                if res.status_code in [200, 201]:
                    data = res.json()
                    print(f"[{datetime.now().strftime('%H:%M:%S')}] Ingested & Processed: {data['city']} | {data['event_type']} | Score: {data['credibility_score']} | Status: {data['verification_status']}")
                else:
                    print(f"Failed to post: {res.status_code} - {res.text}")
            except Exception as e:
                print(f"Simulator connection error: {e}")
            time.sleep(interval)

if __name__ == "__main__":
    run_simulator()