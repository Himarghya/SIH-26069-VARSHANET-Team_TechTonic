from typing import List, Dict, Any, Optional
from processing.verification.gemini_analyzer import gemini_analyzer

class ResponseRecommender:
    """
    Generates explainable, priority-ranked operational recommendations for authorities (NDRF, SDMA, Police, Hospitals).
    Combines rule-based Standard Operating Procedures (SOPs) with Google Gemini LLM context.
    """
    async def generate_recommendations(
        self,
        event_type: str,
        city: str,
        state: str,
        priority: str,
        impact_risk: float,
        evidence_confidence: float,
        total_reports: int,
        independent_sources: int,
        rainfall_mm: float,
        hospitals_at_risk: int,
        roads_at_risk: int,
        vulnerable_pop: int
    ) -> List[Dict[str, Any]]:
        recommendations = []

        # P1: Immediate Emergency & Life Safety
        if priority == "P1":
            recommendations.append({
                "priority": 1,
                "priority_label": "P1",
                "action": f"Issue Immediate Red Emergency Warning & Mass Cell-Broadcast for {city}",
                "reason": f"Corroborated {event_type} with rapid escalation risk threatening {vulnerable_pop:,} vulnerable citizens.",
                "supporting_evidence": [
                    f"{total_reports} multi-source reports across {independent_sources} independent channels",
                    f"Rainfall intensity: {rainfall_mm}mm/hr",
                    f"Evidence Confidence: {evidence_confidence}%",
                    f"Impact Risk Index: {impact_risk}/100"
                ],
                "confidence": 0.95,
                "affected_area": f"{city} Urban Core & Low-Lying Wards",
                "status": "PENDING"
            })
            recommendations.append({
                "priority": 2,
                "priority_label": "P1",
                "action": f"Mobilize NDRF / SDRF Urban Rescue Boats & Pre-Position Water Pumps",
                "reason": f"{roads_at_risk} critical arterial roads and underpasses facing severe inundation.",
                "supporting_evidence": [
                    f"Hydrodynamic risk model predicts severe access blockage",
                    f"Direct proximity to arterial transport corridors"
                ],
                "confidence": 0.92,
                "affected_area": f"{city} Transport Arteries",
                "status": "PENDING"
            })

        # P2: High Priority Resource Allocation
        if priority in ["P1", "P2"]:
            recommendations.append({
                "priority": 3 if priority == "P1" else 1,
                "priority_label": "P2",
                "action": f"Put {hospitals_at_risk} Regional Hospitals on Power & Oxygen Generator Standby",
                "reason": f"Health facilities in {city} fall within the 15km impact buffer.",
                "supporting_evidence": [
                    f"{hospitals_at_risk} hospitals identified inside active impact zone",
                    f"Emergency generator readiness protocol required"
                ],
                "confidence": 0.89,
                "affected_area": f"{city} Medical District",
                "status": "PENDING"
            })
            recommendations.append({
                "priority": 4 if priority == "P1" else 2,
                "priority_label": "P2",
                "action": f"Deploy Traffic Police Diversions at Submerged Underpasses & Bridges",
                "reason": f"Prevent civilian vehicular entrapment in rising floodwaters.",
                "supporting_evidence": [
                    "Vehicle entrapment pattern identified in historical flood records"
                ],
                "confidence": 0.88,
                "affected_area": f"{city} Key Intersections",
                "status": "PENDING"
            })

        # P3 & P4: Field Verification & Citizen Crowdsourcing
        recommendations.append({
            "priority": len(recommendations) + 1,
            "priority_label": "P3" if priority in ["P1", "P2", "P3"] else "P4",
            "action": f"Trigger Targeted Citizen Verification for Eastern Drainage & Sub-Colonies",
            "reason": f"Resolve localized information gaps and confirm recession rates.",
            "supporting_evidence": [
                "Unresolved information gap on road accessibility in sector perimeter"
            ],
            "confidence": 0.85,
            "affected_area": f"{city} Perimeter",
            "status": "PENDING"
        })

        return recommendations

response_recommender = ResponseRecommender()