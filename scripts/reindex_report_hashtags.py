import sys
import os
sys.path.insert(0, os.path.abspath("."))

from backend.app.core.database import SessionLocal
from backend.app.models.models import WeatherReport
from processing.nlp.hashtag_categorizer import hashtag_categorizer, TARGET_HASHTAGS

def reindex_all_reports():
    db = SessionLocal()
    reports = db.query(WeatherReport).all()
    print(f"Re-indexing hashtags for {len(reports)} reports...")

    stats = {tag: 0 for tag in TARGET_HASHTAGS}
    updated_count = 0

    for rep in reports:
        new_tags = hashtag_categorizer.categorize(
            text=rep.text or "",
            event_type=rep.event_type or "",
            city=rep.city or "",
            state=rep.state or "",
            source_name=rep.source_name or "",
            source_type=rep.source_type or "",
            raw_payload=rep.raw_payload or {}
        )

        rep.hashtags = new_tags
        updated_count += 1
        for t in new_tags:
            if t in stats:
                stats[t] += 1

    db.commit()
    db.close()

    print(f"[SUCCESS] Successfully re-categorized {updated_count} reports!")
    print("Hashtag Distribution across Database:")
    for tag, count in stats.items():
        print(f"  {tag:20}: {count} reports")

if __name__ == "__main__":
    reindex_all_reports()
