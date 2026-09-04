import logging
import random
import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from backend.app.core.database import SessionLocal, engine, Base
from backend.app.models.models import User, WeatherReport, EventCluster, Alert, WeatherObservation, InfrastructureAsset
from backend.app.core.security import hash_password
from processing.impact.infrastructure_risk import SEED_INDIAN_INFRASTRUCTURE
from processing.geolocation.indian_geo_resolver import PROMINENT_CITY_COORDS

logger = logging.getLogger("varshanet.init_db")

DEMO_SCENARIOS = [
    {
        "city": "Bhopal", "state": "Madhya Pradesh", "event_type": "Urban Flooding", "severity": "HIGH", "rainfall": 84.0,
        "texts": [
            "Severe waterlogging reported near MP Nagar Zone-2, Bhopal. Vehicles struggling to move, knee-deep water!",
            "Heavy rain in Bhopal since 2 PM. Link Road 1 completely inundated, drain overflowing near 7 No. Stop",
            "Continuous downpour in Bhopal leads to water accumulation in low lying colonies near Kolar Road",
            "Bhopal AWS station recorded 84mm rainfall in the last 3 hours. Red alert issued by Met office"
        ],
        "sources": ["citizen_report", "citizen_report", "rss_news", "weather_api"]
    },
    {
        "city": "Guwahati", "state": "Assam", "event_type": "Flash Flood", "severity": "CRITICAL", "rainfall": 112.0,
        "texts": [
            "Flash floods hit Anil Nagar and Rukminigaon in Guwahati after non-stop torrential downpour",
            "Brahmaputra water level rising rapidly in Guwahati. Water entered residential areas near Zoo Road",
            "Guwahati Met Centre issues heavy rain alert for Kamrup Metro and neighbouring districts"
        ],
        "sources": ["citizen_report", "social_media", "government_open_data"]
    },
    {
        "city": "Mumbai", "state": "Maharashtra", "event_type": "Heavy Rainfall", "severity": "HIGH", "rainfall": 98.0,
        "texts": [
            "Waterlogging at Hindmata and Gandhi Market Dadar after 98mm rainfall in 3 hours",
            "IMD radar indicates severe convective clouds over Mumbai suburban and Thane region",
            "High tide of 4.2m expected today along Mumbai coastline during active monsoon spell"
        ],
        "sources": ["citizen_report", "weather_api", "government_open_data"]
    },
    {
        "city": "Delhi", "state": "Delhi", "event_type": "Urban Flooding", "severity": "HIGH", "rainfall": 68.0,
        "texts": [
            "Heavy water accumulation near Pragati Maidan tunnel and Minto Bridge Delhi",
            "Yamuna river crosses warning level near Old Railway Bridge in Delhi",
            "Delhi Traffic Police advisory: Avoid waterlogged underpasses in South Delhi"
        ],
        "sources": ["citizen_report", "government_open_data", "rss_news"]
    },
    {
        "city": "IIITDM Jabalpur", "state": "Madhya Pradesh", "event_type": "Heavy Rainfall", "severity": "HIGH", "rainfall": 78.0,
        "texts": [
            "Very huge rainfall reported near IIITDM Jabalpur campus, waterlogging in low-lying corridors",
            "Extremely heavy rainfall causes rapid runoff around Jabalpur Bargi Narmada basin"
        ],
        "sources": ["citizen_report", "citizen_report"]
    }
]

def init_and_refresh_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        # 1. Seed Users
        if not db.query(User).filter(User.username == "admin").first():
            db.add(User(
                id="usr_admin_1",
                username="admin",
                email="admin@varshanet.gov.in",
                full_name="National Operations Director",
                role="admin",
                hashed_password=hash_password("admin123")
            ))
            db.add(User(
                id="usr_analyst_1",
                username="analyst",
                email="analyst@varshanet.gov.in",
                full_name="Lead Meteorological Analyst",
                role="analyst",
                hashed_password=hash_password("analyst123")
            ))
            db.commit()

        # 2. Seed Infrastructure Assets
        if db.query(InfrastructureAsset).count() == 0:
            for item in SEED_INDIAN_INFRASTRUCTURE:
                db.add(InfrastructureAsset(**item))
            db.commit()

        # 3. Seed Demo Scenarios if empty
        if db.query(WeatherReport).count() == 0:
            now = datetime.now()
            for s in DEMO_SCENARIOS:
                lat, lon = PROMINENT_CITY_COORDS.get(s["city"], (20.5937, 78.9629))
                cl_id = f"evt_{s['city'].lower().replace(' ', '_')}_{random.randint(100, 999)}"
                cl = EventCluster(
                    id=cl_id,
                    title=f"{s['event_type']} in {s['city']}",
                    event_type=s["event_type"],
                    city=s["city"],
                    state=s["state"],
                    latitude=lat,
                    longitude=lon,
                    status="VERIFIED",
                    severity=s["severity"],
                    total_reports=len(s["texts"]),
                    independent_sources_count=len(set(s["sources"])),
                    citizen_reports_count=sum(1 for src in s["sources"] if src == "citizen_report"),
                    weather_api_confirmed=True,
                    confidence_score=92.0,
                    overall_credibility=94.0,
                    started_at=now - timedelta(hours=2),
                    last_reported_at=now - timedelta(minutes=15),
                    summary=f"Multi-source verified {s['event_type']} affecting {s['city']}, {s['state']}."
                )
                db.add(cl)

                for idx, txt in enumerate(s["texts"]):
                    db.add(WeatherReport(
                        id=f"rep_{uuid.uuid4().hex[:8]}",
                        source_id=f"src_{uuid.uuid4().hex[:6]}",
                        source_type=s["sources"][idx],
                        source_name="VARSHANET Live Ingestion",
                        author="verified_source",
                        text=txt,
                        event_type=s["event_type"],
                        event_confidence=0.92,
                        latitude=lat + random.uniform(-0.02, 0.02),
                        longitude=lon + random.uniform(-0.02, 0.02),
                        city=s["city"],
                        state=s["state"],
                        timestamp=now - timedelta(minutes=random.randint(5, 120)),
                        credibility_score=random.uniform(85.0, 96.0),
                        risk_level=s["severity"],
                        verification_status="VERIFIED",
                        event_cluster_id=cl_id
                    ))

                # Add Alert
                db.add(Alert(
                    id=f"alrt_{uuid.uuid4().hex[:8]}",
                    alert_code=f"RED-WARN-{s['city'][:3].upper()}",
                    title=f"RED ALERT: {s['event_type']} in {s['city']}",
                    message=f"Severe {s['event_type']} affecting {s['city']}. Municipal flood protocols active.",
                    event_type=s["event_type"],
                    severity="CRITICAL" if s["severity"] == "CRITICAL" else "HIGH",
                    city=s["city"],
                    state=s["state"],
                    latitude=lat,
                    longitude=lon,
                    reports_count=len(s["texts"]),
                    is_active=True,
                    created_at=now - timedelta(minutes=random.randint(10, 60))
                ))
            db.commit()
            print("[VARSHANET INIT] Initial scenarios seeded successfully!")
        else:
            # 4. Roll forward timestamps
            now = datetime.now()
            latest_rep = db.query(WeatherReport).order_by(WeatherReport.timestamp.desc()).first()
            if latest_rep and latest_rep.timestamp:
                rep_time = latest_rep.timestamp.replace(tzinfo=None)
                diff_hours = (now - rep_time).total_seconds() / 3600.0
                if diff_hours > 1.5:
                    shift = timedelta(hours=diff_hours - 0.5)
                    for r in db.query(WeatherReport).all():
                        if r.timestamp: r.timestamp = r.timestamp + shift
                    for c in db.query(EventCluster).all():
                        if c.last_reported_at: c.last_reported_at = c.last_reported_at + shift
                        if c.started_at: c.started_at = c.started_at + shift
                    for a in db.query(Alert).all():
                        if a.created_at: a.created_at = a.created_at + shift
                    db.commit()
                    print("[VARSHANET INIT] Timestamps successfully shifted forward!")
    except Exception as e:
        print(f"[VARSHANET INIT ERROR] {e}")
        db.rollback()
    finally:
        db.close()
