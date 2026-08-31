import sys, os
sys.path.insert(0, os.path.abspath("."))

from backend.app.core.database import SessionLocal, engine, Base
from backend.app.models.models import InfrastructureAsset, EventCluster
from processing.impact.infrastructure_risk import SEED_INDIAN_INFRASTRUCTURE

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Seed infrastructure assets
existing_assets = db.query(InfrastructureAsset).count()
if existing_assets == 0:
    for item in SEED_INDIAN_INFRASTRUCTURE:
        asset = InfrastructureAsset(**item)
        db.add(asset)
    db.commit()
    print(f"Successfully seeded {len(SEED_INDIAN_INFRASTRUCTURE)} critical infrastructure assets across India!")
else:
    print(f"Infrastructure assets already present: {existing_assets}")

db.close()