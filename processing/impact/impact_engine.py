import asyncio
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from processing.impact.population_exposure import population_engine
from processing.impact.infrastructure_risk import infrastructure_engine
from processing.impact.vulnerability_engine import vulnerability_engine
from processing.impact.impact_nowcaster import impact_nowcaster
from processing.impact.response_recommender import response_recommender
from processing.impact.information_gaps import information_gap_engine
from processing.impact.explainability import explainability_engine

class ImpactIntelligenceEngine:
    """
    Master Impact & Decision Support Orchestrator.
    Synthesizes Population Exposure, Critical Infrastructure Risk,
    3-Score Vulnerability, Explainable Nowcast, and Response Recommendations.
    """
    async def evaluate_event_impact(
        self,
        cluster: Any,
        db_assets: Optional[List[Any]] = None
    ) -> Dict[str, Any]:
        # 1. Population Exposure
        city = cluster.city if hasattr(cluster, "city") else cluster.get("city")
        state = cluster.state if hasattr(cluster, "state") else cluster.get("state")
        lat = cluster.latitude if hasattr(cluster, "latitude") else cluster.get("latitude")
        lon = cluster.longitude if hasattr(cluster, "longitude") else cluster.get("longitude")
        severity = cluster.severity if hasattr(cluster, "severity") else cluster.get("severity", "HIGH")
        event_type = cluster.event_type if hasattr(cluster, "event_type") else cluster.get("event_type", "Heavy Rainfall")
        total_reports = cluster.total_reports if hasattr(cluster, "total_reports") else cluster.get("total_reports", 1)
        sources_count = cluster.independent_sources_count if hasattr(cluster, "independent_sources_count") else cluster.get("independent_sources_count", 1)
        api_confirmed = cluster.weather_api_confirmed if hasattr(cluster, "weather_api_confirmed") else cluster.get("weather_api_confirmed", False)

        pop_exp = population_engine.calculate_exposure(city=city, state=state, radius_km=12.0, severity=severity)
        
        # 2. Infrastructure Risk
        infra_exp = infrastructure_engine.evaluate_infrastructure_risk(lat=lat, lon=lon, radius_km=15.0, db_assets=db_assets)

        # 3. Three Independent Scores
        rainfall_est = 84.0 if severity in ["HIGH", "CRITICAL"] else 35.0
        scores = vulnerability_engine.compute_three_scores(
            event_severity=severity,
            rainfall_mm=rainfall_est,
            independent_sources_count=sources_count,
            total_reports=total_reports,
            weather_api_confirmed=api_confirmed,
            population_exposed=pop_exp["total_population_exposed"],
            vulnerable_population=pop_exp["vulnerable_population_exposed"],
            infra_risk_score=infra_exp["infrastructure_risk_score"]
        )

        # 4. Nowcast Trajectory
        nowcast = impact_nowcaster.generate_nowcast_trajectory(
            current_risk=scores["impact_risk"],
            rainfall_trend="INCREASING" if severity in ["HIGH", "CRITICAL"] else "STABLE",
            event_severity=severity,
            escalation_probability=scores["escalation_probability"]
        )

        # 5. Response Recommendations (with Gemini LLM context)
        recommendations = await response_recommender.generate_recommendations(
            event_type=event_type,
            city=city or "Region",
            state=state,
            priority=scores["response_priority"],
            impact_risk=scores["impact_risk"],
            evidence_confidence=scores["evidence_confidence"],
            total_reports=total_reports,
            independent_sources=sources_count,
            rainfall_mm=rainfall_est,
            hospitals_at_risk=infra_exp["hospitals_at_risk_count"],
            roads_at_risk=infra_exp["bridges_roads_at_risk_count"],
            vulnerable_pop=pop_exp["vulnerable_population_exposed"]
        )

        # 6. Information Gaps & Verification Requests
        gaps, v_requests = information_gap_engine.identify_gaps(
            city=city or "Region",
            state=state,
            lat=lat,
            lon=lon,
            event_type=event_type,
            citizen_reports_count=getattr(cluster, "citizen_reports_count", 1),
            weather_api_confirmed=api_confirmed,
            roads_at_risk_count=infra_exp["bridges_roads_at_risk_count"]
        )

        # 7. Explainability Evidence Chain
        evidence_chain = explainability_engine.build_evidence_chain(
            event_type=event_type,
            city=city or "Region",
            state=state,
            evidence_confidence=scores["evidence_confidence"],
            impact_risk=scores["impact_risk"],
            total_reports=total_reports,
            independent_sources=sources_count,
            rainfall_mm=rainfall_est,
            vulnerable_pop=pop_exp["vulnerable_population_exposed"],
            hospitals_count=infra_exp["hospitals_at_risk_count"],
            roads_count=infra_exp["bridges_roads_at_risk_count"]
        )

        return {
            "scores": scores,
            "population_exposure": pop_exp,
            "infrastructure": infra_exp,
            "nowcast_trajectory": nowcast,
            "response_recommendations": recommendations,
            "information_gaps": gaps,
            "verification_requests": v_requests,
            "evidence_chain": evidence_chain,
            "assessed_at": datetime.now(timezone.utc).isoformat()
        }

master_impact_engine = ImpactIntelligenceEngine()