import logging
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from backend.app.core.database import SessionLocal, engine, Base
from backend.app.models.models import User, WeatherReport, EventCluster, Alert, WeatherObservation, InfrastructureAsset
from backend.app.core.security import hash_password
from processing.impact.infrastructure_risk import SEED_INDIAN_INFRASTRUCTURE

logger = logging.getLogger("varshanet.init_db")

def init_and_refresh_database():
    """
    Ensures tables exist, default users & infrastructure assets are seeded,
    and timestamps are rolled forward relative to current time so the platform
    is immediately active with fresh live 6-hour timers.
    """
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        # 1. Seed Default Users
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
            print("[VARSHANET INIT] Seeded default admin and analyst users.")

        # 2. Seed Infrastructure Assets if empty
        if db.query(InfrastructureAsset).count() == 0:
            for item in SEED_INDIAN_INFRASTRUCTURE:
                asset = InfrastructureAsset(**item)
                db.add(asset)
            db.commit()
            print(f"[VARSHANET INIT] Seeded {len(SEED_INDIAN_INFRASTRUCTURE)} critical infrastructure assets.")

        # 3. Check reports and clusters; roll forward timestamps so they are always active in past 1-3 hours
        now = datetime.now()
        latest_rep = db.query(WeatherReport).order_by(WeatherReport.timestamp.desc()).first()
        if latest_rep and latest_rep.timestamp:
            rep_time = latest_rep.timestamp.replace(tzinfo=None)
            diff_hours = (now - rep_time).total_seconds() / 3600.0

            # If older than 1.5 hours, roll forward all timestamps
            if diff_hours > 1.5:
                shift_delta = timedelta(hours=diff_hours - 0.5)
                print(f"[VARSHANET INIT] Rolling forward database timestamps by {shift_delta} to keep 6-hour timers fresh and live.")
                
                reports = db.query(WeatherReport).all()
                for r in reports:
                    if r.timestamp:
                        r.timestamp = r.timestamp + shift_delta
                
                clusters = db.query(EventCluster).all()
                for c in clusters:
                    if c.last_reported_at:
                        c.last_reported_at = c.last_reported_at + shift_delta
                    if c.started_at:
                        c.started_at = c.started_at + shift_delta

                alerts = db.query(Alert).all()
                for a in alerts:
                    if a.issued_at:
                        a.issued_at = a.issued_at + shift_delta

                db.commit()
                print("[VARSHANET INIT] Timestamps successfully refreshed for online production!")
    except Exception as e:
        print(f"[VARSHANET INIT WARNING] Database initialization: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_and_refresh_database()
