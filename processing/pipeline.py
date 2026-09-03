from datetime import datetime, timezone
from typing import Dict, Any, List
from processing.cleaning.text_cleaner import cleaner
from processing.geolocation.indian_geo_resolver import geo_resolver
from processing.classification.classifier import classifier
from processing.vision.image_analyzer import image_analyzer
from processing.deduplication.deduplicator import deduplicator
from processing.verification.credibility_engine import credibility_engine
from processing.clustering.event_clusterer import event_clusterer

class ProcessingPipeline:
    def process_raw_report(
        self,
        raw_data: Dict[str, Any],
        existing_reports: List[Dict] = None,
        existing_clusters: List[Dict] = None,
        weather_observation: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        existing_reports = existing_reports or []
        existing_clusters = existing_clusters or []
        
        raw_text = raw_data.get("text", "")
        
        # Stage 1: Text Cleaning & Language Normalization
        cleaned_text, language, extracted_hashtags = cleaner.clean_and_normalize(raw_text)
        
        # Stage 2: Geocoding & PostGIS Spatiotemporal Resolution
        loc = geo_resolver.resolve(
            raw_text=raw_text,
            manual_city=raw_data.get("city"),
            manual_state=raw_data.get("state"),
            manual_lat=raw_data.get("latitude"),
            manual_lon=raw_data.get("longitude")
        )
        
        # Stage 3: Strict Meteorological Event Classification
        specified_event = raw_data.get("event_type")
        if specified_event and specified_event not in ["Other", "Non-Weather News"]:
            event_type = specified_event
            event_confidence = 0.90
            class_details = {"manual_specified": True, "is_weather": True}
        else:
            event_type, event_confidence, class_details = classifier.classify(cleaned_text, extracted_hashtags)

        # Check if strictly meteorological
        is_weather_domain = class_details.get("is_weather", True) and event_type != "Non-Weather News"
        if not is_weather_domain:
            event_type = "Non-Weather News"

        # Stage 3.5: AI Contextual Weather Hashtag Enrichment
        all_hashtags = cleaner.generate_ai_hashtags(
            text=raw_text,
            event_type=event_type,
            city=loc.get("city", ""),
            state=loc.get("state", "")
        )
            
        # Stage 4: AI Multi-Photo Vision Authenticity & Fake Analysis (<20% Fake Rule)
        media_urls = raw_data.get("media_urls", [])
        image_analysis = {}
        photo_evaluations = []
        has_fake_image = False
        avg_auth = 85.0
        
        if media_urls:
            for url in media_urls[:3]:
                ev = image_analyzer.analyze_image_authenticity(url, event_type=event_type)
                photo_evaluations.append(ev)
                if ev.get("is_fake", False) or ev.get("authenticity_score", 100) < 20:
                    has_fake_image = True
            
            if photo_evaluations:
                avg_auth = round(sum(p.get("authenticity_score", 50) for p in photo_evaluations) / len(photo_evaluations), 1)
                
            image_analysis = {
                "photo_evaluations": photo_evaluations,
                "average_authenticity_score": avg_auth,
                "has_fake_image": has_fake_image,
                "overall_visual_verdict": f"🔴 FAKE / UNRELATED VISUAL ({avg_auth}% < 20%)" if (avg_auth < 20 or has_fake_image) else f"🟢 AUTHENTIC EVIDENCE ({avg_auth}%)"
            }
            
        # Stage 5: Deduplication (Simhash Hamming Distance)
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
            weather_observation=weather_observation
        )

        # Apply AI Visual Authenticity Rule (<20% -> Fake)
        if media_urls and (has_fake_image or avg_auth < 20):
            credibility = min(14.0, credibility)
            v_status = "LIKELY_MISLEADING"
            v_notes = f"AI Vision Alert: Attached proof photo flagged as FAKE/MANIPULATED ({avg_auth}% Authenticity < 20% threshold)."
        elif media_urls and avg_auth >= 70:
            credibility = min(98.0, credibility + 10.0)
            v_notes += f" Corroborated with high-authenticity visual proof ({avg_auth}% AI score)."
        
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
        
        # Determine Severity based on event and credibility
        severity = "MODERATE"
        if event_type in ["Cloudburst", "Flash Flood", "Cyclone", "Landslide"]:
            severity = "CRITICAL"
        elif event_type in ["Heavy Rainfall", "Urban Flooding", "Heatwave", "Hailstorm"]:
            severity = "HIGH"
        elif event_type in ["Rainfall", "Fog", "Strong Winds"]:
            severity = "MODERATE"
        else:
            severity = "LOW"
            
        result = {
            "source_id": raw_data.get("source_id", "manual_input"),
            "source_type": source_type,
            "source_name": raw_data.get("source_name", "Open Weather Stream"),
            "author": raw_data.get("author"),
            "text": cleaned_text,
            "raw_text": raw_text,
            "language": language,
            "extracted_hashtags": all_hashtags,
            "city": loc["city"],
            "district": loc["district"],
            "state": loc["state"],
            "latitude": loc["latitude"],
            "longitude": loc["longitude"],
            "location_confidence": loc["location_confidence"],
            "event_type": event_type,
            "event_confidence": event_confidence,
            "severity": severity,
            "credibility_score": credibility,
            "risk_level": risk_level,
            "verification_status": v_status,
            "verification_notes": v_notes,
            "is_duplicate": is_dup,
            "duplicate_group_id": dup_group_id,
            "duplicate_similarity": dup_sim,
            "media_urls": media_urls,
            "image_analysis": image_analysis,
            "extracted_metrics": class_details,
            "is_weather_domain": is_weather_domain,
            "timestamp": raw_data.get("timestamp", datetime.now(timezone.utc)),
            "event_cluster_id": cluster_id,
            "_is_new_cluster": is_new_cluster,
            "_cluster_data": cluster_data
        }
        
        return result

pipeline = ProcessingPipeline()