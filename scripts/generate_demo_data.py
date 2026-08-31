import sys, os
sys.path.insert(0, os.path.abspath("."))

import random
import uuid
from datetime import datetime, timedelta, timezone
from backend.app.core.database import SessionLocal, engine, Base
from backend.app.models.models import WeatherReport, EventCluster, Alert, WeatherObservation, User
from backend.app.core.security import hash_password
from processing.geolocation.indian_geo_resolver import PROMINENT_CITY_COORDS, CITY_TO_STATE_MAP

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Seed default users
if not db.query(User).filter(User.username == "admin").first():
    admin_user = User(
        id="usr_admin_1",
        username="admin",
        email="admin@varshanet.gov.in",
        full_name="National Operations Director",
        role="admin",
        hashed_password=hash_password("admin123")
    )
    analyst_user = User(
        id="usr_analyst_1",
        username="analyst",
        email="analyst@varshanet.gov.in",
        full_name="Lead Meteorological Analyst",
        role="analyst",
        hashed_password=hash_password("analyst123")
    )
    db.add(admin_user)
    db.add(analyst_user)
    db.commit()

INDIAN_SCENARIOS = [
    {
        "city": "Bhopal", "state": "Madhya Pradesh", "event_type": "Urban Flooding", "severity": "HIGH", "rainfall": 84.0, "temp": 24.5,
        "texts": [
            "Severe waterlogging reported near MP Nagar Zone-2, Bhopal. Vehicles struggling to move, knee-deep water!",
            "Heavy rain in Bhopal since 2 PM. Link Road 1 completely inundated, drain overflowing near 7 No. Stop",
            "Continuous downpour in Bhopal leads to water accumulation in low lying colonies near Kolar Road",
            "Bhopal AWS station recorded 84mm rainfall in the last 3 hours. Red alert issued by Met office",
            "Heavy thunderstorm shower causing waterlogging near Bhopal railway station underpass"
        ],
        "sources": ["citizen_report", "citizen_report", "rss_news", "weather_api", "social_media"]
    },
    {
        "city": "Guwahati", "state": "Assam", "event_type": "Flash Flood", "severity": "CRITICAL", "rainfall": 112.0, "temp": 23.0,
        "texts": [
            "Flash floods hit Anil Nagar and Rukminigaon in Guwahati after non-stop torrential downpour",
            "Brahmaputra water level rising rapidly in Guwahati. Water entered residential areas near Zoo Road",
            "Minor landslide reported on hills near Khanapara Guwahati due to heavy rainfall",
            "Guwahati Met Centre issues heavy rain alert for Kamrup Metro and neighbouring districts"
        ],
        "sources": ["citizen_report", "social_media", "citizen_report", "government_open_data"]
    },
    {
        "city": "Mumbai", "state": "Maharashtra", "event_type": "Heavy Rainfall", "severity": "HIGH", "rainfall": 98.0, "temp": 26.2,
        "texts": [
            "High tide coupled with torrential rains causing waterlogging at Hindmata and Gandhi Market Dadar",
            "Local train services on Central line running 15 mins late due to water on tracks at Kurla",
            "Santacruz observatory records 98mm rain in 6 hours. BMC deploys water pumps in low-lying zones",
            "Heavy downpour and reduced visibility on Western Express Highway near Bandra"
        ],
        "sources": ["rss_news", "social_media", "weather_api", "citizen_report"]
    },
    {
        "city": "Delhi", "state": "Delhi", "event_type": "Thunderstorm", "severity": "MODERATE", "rainfall": 35.0, "temp": 28.0,
        "texts": [
            "Squall and heavy thunderstorm hit Delhi NCR. Strong winds gusting up to 65 km/h",
            "Tree uprooted near Connaught Place Outer Circle due to sudden squall and rain",
            "Safdarjung station recorded sudden temperature drop of 7 degrees during evening thunderstorm"
        ],
        "sources": ["social_media", "citizen_report", "weather_api"]
    },
    {
        "city": "Dehradun", "state": "Uttarakhand", "event_type": "Cloudburst", "severity": "CRITICAL", "rainfall": 145.0, "temp": 20.1,
        "texts": [
            "Cloudburst-like intense spell in Sahastradhara area of Dehradun, river overflowing rapidly",
            "State Disaster Response Force deployed near Maldevta Dehradun following excessive precipitation",
            "Landslide blocks Rishikesh-Badrinath highway near Chamoli due to incessant mountain rains"
        ],
        "sources": ["citizen_report", "government_open_data", "rss_news"]
    },
    {
        "city": "Jaipur", "state": "Rajasthan", "event_type": "Heatwave", "severity": "HIGH", "rainfall": 0.0, "temp": 45.4,
        "texts": [
            "Severe heatwave conditions continue in Jaipur with maximum temperature crossing 45.4 deg C",
            "Hot westerly winds (Loo) sweeping across Jaipur and western Rajasthan districts"
        ],
        "sources": ["weather_api", "rss_news"]
    },
    {
        "city": "Bhubaneswar", "state": "Odisha", "event_type": "Cyclone", "severity": "CRITICAL", "rainfall": 65.0, "temp": 26.0,
        "texts": [
            "Deep depression over Bay of Bengal intensifies, coastal Odisha put on high alert with squally winds",
            "Heavy rainfall warning for Puri, Jagatsinghpur and Bhubaneswar. Fishermen advised not to venture into sea"
        ],
        "sources": ["government_open_data", "rss_news"]
    },
    {
        "city": "Chennai", "state": "Tamil Nadu", "event_type": "Rainfall", "severity": "LOW", "rainfall": 42.0, "temp": 27.5,
        "texts": [
            "Moderate to heavy showers across Velachery, Guindy and OMR corridor in Chennai",
            "Coastal Chennai experiencing gusty winds and steady rain bands",
            "Meenambakkam airport records 42mm rain. Flight operations normal"
        ],
        "sources": ["citizen_report", "social_media", "weather_api"]
    }
]

idx = 1
total_reports_added = 0
for sc in INDIAN_SCENARIOS:
    city = sc["city"]
    state = sc["state"]
    lat, lon = PROMINENT_CITY_COORDS.get(city.lower(), (23.25, 77.41))
    event_type = sc["event_type"]
    
    obs = WeatherObservation(
        station_name=f"{city} Regional AWS",
        city=city,
        state=state,
        latitude=lat,
        longitude=lon,
        temperature=sc.get("temp", 28.0),
        humidity=78.0 if sc.get("rainfall", 0) > 0 else 32.0,
        rainfall_mm=sc.get("rainfall", 0.0),
        wind_speed_kmh=45.0 if sc["severity"] in ["HIGH", "CRITICAL"] else 18.0,
        condition=event_type,
        recorded_at=datetime.now(timezone.utc) - timedelta(minutes=random.randint(5, 60))
    )
    db.add(obs)
    
    cluster_id = f"EVT-20260831-{idx:03d}"
    idx += 1
    
    cluster = EventCluster(
        id=cluster_id,
        title=f"{event_type} in {city}, {state}",
        event_type=event_type,
        city=city,
        district=city,
        state=state,
        latitude=lat + random.uniform(-0.02, 0.02),
        longitude=lon + random.uniform(-0.02, 0.02),
        status="VERIFIED" if sc["severity"] in ["HIGH", "CRITICAL"] else "ACTIVE",
        severity=sc["severity"],
        total_reports=len(sc["texts"]) * 4 + random.randint(5, 25),
        independent_sources_count=len(set(sc["sources"])),
        citizen_reports_count=random.randint(12, 45),
        weather_api_confirmed=True,
        confidence_score=round(random.uniform(0.88, 0.96), 2),
        overall_credibility=round(random.uniform(84.0, 94.0), 1),
        started_at=datetime.now(timezone.utc) - timedelta(hours=random.randint(2, 6)),
        last_reported_at=datetime.now(timezone.utc) - timedelta(minutes=random.randint(1, 30)),
        summary=f"Impact assessment for {event_type} in regional zone of {city}, {state}. Ground station radars confirm active convective storm cell."
    )
    db.add(cluster)
    
    if sc["severity"] in ["HIGH", "CRITICAL"]:
        alert = Alert(
            alert_code=f"ALT-{city[:3].upper()}-{random.randint(100, 999)}",
            title=f"IMD Emergency Warning: {event_type} in {city}",
            message=f"Severe weather bulletin: {event_type} active across {city}, {state}. Public advised to exercise caution.",
            severity=sc["severity"],
            event_type=event_type,
            city=city,
            state=state,
            latitude=lat,
            longitude=lon,
            reports_count=cluster.total_reports,
            is_active=True,
            created_at=datetime.now(timezone.utc) - timedelta(minutes=random.randint(10, 90))
        )
        db.add(alert)
        
    dup_grp = f"DUP-{uuid.uuid4().hex[:8]}"
    for i, text in enumerate(sc["texts"]):
        for rep_var in range(random.randint(2, 5)):
            stype = random.choice(sc["sources"])
            cred = random.uniform(78.0, 95.0) if stype != "social_media" else random.uniform(62.0, 84.0)
            v_status = "VERIFIED" if cred >= 88 else ("LIKELY_AUTHENTIC" if cred >= 75 else "REQUIRES_REVIEW")
            
            r_lat = lat + random.uniform(-0.035, 0.035)
            r_lon = lon + random.uniform(-0.035, 0.035)
            
            rep = WeatherReport(
                source_id=f"{stype[:4]}_{uuid.uuid4().hex[:8]}",
                source_type=stype,
                source_name=f"{stype.replace('_', ' ').title()} Stream",
                author=f"user_{random.randint(100, 999)}",
                text=text if rep_var == 0 else f"{text} (Update #{rep_var+1})",
                original_language="en" if random.random() > 0.3 else "hi",
                normalized_text=text,
                event_type=event_type,
                event_confidence=round(random.uniform(0.82, 0.96), 2),
                raw_classification_details={"keyword_matches": [event_type.lower()], "ml_score": 0.91},
                latitude=round(r_lat, 4),
                longitude=round(r_lon, 4),
                city=city,
                district=city,
                state=state,
                location_confidence=0.95,
                timestamp=datetime.now(timezone.utc) - timedelta(minutes=random.randint(5, 480)),
                ingestion_timestamp=datetime.now(timezone.utc),
                credibility_score=round(cred, 1),
                risk_level="LOW" if cred >= 80 else ("MODERATE" if cred >= 65 else "HIGH"),
                verification_status=v_status,
                verification_notes="Corroborated by regional ground observation and cross-source consensus.",
                duplicate_group_id=dup_grp if rep_var > 0 else None,
                is_duplicate=rep_var > 0,
                duplicate_count=rep_var,
                event_cluster_id=cluster_id,
                media_urls=["https://images.unsplash.com/photo-1514632595-4944383f2737?w=600"] if random.random() > 0.5 else [],
                hashtags=["#IMD", f"#{city}Rains", f"#{event_type.replace(' ', '')}"],
                image_analysis_results={"image_weather_relevance": 0.91, "detected_objects": ["water_accumulation", "cloud_cover"]} if random.random() > 0.5 else {}
            )
            db.add(rep)
            total_reports_added += 1

db.commit()
db.close()
print(f"Successfully populated {total_reports_added} weather reports, {idx-1} active clusters, and emergency alerts across India!")