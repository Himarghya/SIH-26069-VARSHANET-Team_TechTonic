from datetime import datetime, timezone
from typing import Dict, List, Optional
from processing.cleaning.text_cleaner import cleaner
from processing.geolocation.indian_geo_resolver import geo_resolver
from processing.classification.classifier import classifier
from processing.deduplication.deduplicator import deduplicator
from processing.verification.credibility_engine import credibility_engine
from processing.vision.image_analyzer import image_analyzer
from processing.clustering.event_clusterer import event_clusterer

class WeatherIntelligencePipeline:
    def process_raw_report(
        self,
        raw_data: Dict,
        existing_reports: Optional[List[Dict]] = None,
        existing_clusters: Optional[List[Dict]] = None,
        weather_observation: Optional[Dict] = None
    ) -> Dict:
        existing_reports = existing_reports or []
        existing_clusters = existing_clusters or []
        
        # Stage 1: Data Cleaning & Language Identification
        raw_text = raw_data.get("text", "")
        cleaned_text, extracted_hashtags, language, is_spam = cleaner.clean_text(raw_text)
        all_hashtags = list(set(raw_data.get("hashtags", []) + extracted_hashtags))
        
        # Stage 2: Location Intelligence (PostGIS / Indian Geo Resolving)
        loc = geo_resolver.resolve(
            text=cleaned_text,
            lat=raw_data.get("latitude"),
            lon=raw_data.get("longitude"),
            city=raw_data.get("city"),
            state=raw_data.get("state")
        )
        
        # Stage 3: Event Classification (Hybrid Rule + ML)
        specified_event = raw_data.get("event_type")
        if specified_event and specified_event != "Other":
            event_type = specified_event
            event_confidence = 0.90
            class_details = {"manual_specified": True}
        else:
            event_type, event_confidence, class_details = classifier.classify(cleaned_text, all_hashtags)
            
        # Stage 4: Image Analysis (if media present)
        media_urls = raw_data.get("media_urls", [])
        image_analysis = {}
        if media_urls:
            # Evaluate first image
            image_analysis = image_analyzer.analyze_image_heuristics(media_urls[0])
            
        # Stage 5: Deduplication
        is_dup, dup_group_id, dup_sim = deduplicator.check_duplicate(
            text=cleaned_text,
            lat=loc["latitude"],
            lon=loc["longitude"],
            event_type=event_type,
            existing_reports=existing_reports
        )
        
        # Stage 6: AI Credibility & Fake Report Detection
        source_type = raw_data.get("source_type", "citizen_report")
        credibility, risk_level, v_status, v_notes = credibility_engine.calculate_credibility(
            source_type=source_type,
            text=cleaned_text,
            event_type=event_type,
            event_confidence=event_confidence,
            location_confidence=loc["location_confidence"],
            is_duplicate=is_dup,
            duplicate_count=len([r for r in existing_reports if r.get("duplicate_group_id") == dup_group_id]),
            has_media=len(media_urls) > 0,
            weather_observation=weather_observation,
            image_analysis=image_analysis
        )
        
        # Stage 7: Event Clustering (Cross-Source Correlation)
        cluster_id, is_new_cluster, cluster_data = event_clusterer.find_or_create_cluster(
            event_type=event_type,
            city=loc["city"],
            state=loc["state"],
            lat=loc["latitude"],
            lon=loc["longitude"],
            source_type=source_type,
            credibility=credibility,
            existing_clusters=existing_clusters
        )
        
        # Assemble Enriched Record
        enriched_record = {
            "source_id": raw_data.get("source_id"),
            "source_type": source_type,
            "source_name": raw_data.get("source_name", "Citizen Portal"),
            "author": raw_data.get("author", "citizen_user"),
            "text": raw_text,
            "original_language": language,
            "normalized_text": cleaned_text,
            "event_type": event_type,
            "event_confidence": event_confidence,
            "raw_classification_details": class_details,
            "latitude": loc["latitude"],
            "longitude": loc["longitude"],
            "city": loc["city"],
            "district": loc["district"],
            "state": loc["state"],
            "location_confidence": loc["location_confidence"],
            "timestamp": raw_data.get("timestamp") or datetime.now(timezone.utc),
            "ingestion_timestamp": datetime.now(timezone.utc),
            "credibility_score": credibility,
            "risk_level": risk_level,
            "verification_status": v_status,
            "verification_notes": v_notes,
            "duplicate_group_id": dup_group_id,
            "is_duplicate": is_dup,
            "duplicate_count": 1 if is_dup else 0,
            "event_cluster_id": cluster_id,
            "media_urls": media_urls,
            "hashtags": all_hashtags,
            "image_analysis_results": image_analysis,
            "raw_payload": raw_data.get("raw_payload", {}),
            "_is_new_cluster": is_new_cluster,
            "_cluster_data": cluster_data
        }
        
        return enriched_record

pipeline = WeatherIntelligencePipeline()
