import os
import sys

sys.path.insert(0, os.path.abspath("."))

from backend.app.core.database import SessionLocal
from backend.app.models.models import WeatherReport, EventCluster, Alert, VerificationAction
from processing.classification.classifier import classifier

def cleanup_non_weather_reports():
    db = SessionLocal()
    try:
        all_reports = db.query(WeatherReport).all()
        print(f"Total reports currently in DB: {len(all_reports)}")

        deleted_count = 0
        retained_count = 0

        for r in all_reports:
            # Check if strictly meteorological and free from Nepal / political figures
            is_weather, cat, conf = classifier.is_strictly_weather(r.text)
            
            # Explicitly reject 'Other', non-weather, Nepal, or political figure items
            if not is_weather or r.event_type in ["Other", "Non-Weather News", "Non-Weather / Foreign / Political"]:
                # Delete any child verification actions first
                db.query(VerificationAction).filter(VerificationAction.report_id == r.id).delete()
                db.delete(r)
                deleted_count += 1
            else:
                if r.event_type != cat and cat != "Other":
                    r.event_type = cat
                retained_count += 1

        db.commit()
        print(f"SUCCESS: Purged {deleted_count} non-weather / Nepal / political items.")
        print(f"SUCCESS: Retained {retained_count} genuine meteorological weather reports.")

        # Clean up empty or non-weather clusters
        all_clusters = db.query(EventCluster).all()
        clusters_deleted = 0
        for c in all_clusters:
            rep_count = db.query(WeatherReport).filter(WeatherReport.event_cluster_id == c.id).count()
            if rep_count == 0 or c.event_type in ["Other", "Non-Weather News", "Non-Weather / Foreign / Political"]:
                db.delete(c)
                clusters_deleted += 1
            else:
                c.total_reports = rep_count

        db.commit()
        print(f"SUCCESS: Cleaned up {clusters_deleted} empty/non-weather incident clusters.")

    except Exception as e:
        db.rollback()
        print(f"ERROR during cleanup: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    cleanup_non_weather_reports()