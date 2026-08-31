import hashlib
import math
from typing import List, Dict, Optional, Tuple

def calculate_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class Deduplicator:
    def __init__(self):
        # In-memory recent report cache for rapid near-duplicate checking
        self.recent_hashes = {} # hash -> report_id
        self.recent_reports = [] # list of dicts

    def compute_text_hash(self, text: str) -> str:
        clean = "".join(text.lower().split())
        return hashlib.md5(clean.encode()).hexdigest()

    def compute_jaccard_similarity(self, text1: str, text2: str) -> float:
        set1 = set(text1.lower().split())
        set2 = set(text2.lower().split())
        if not set1 or not set2:
            return 0.0
        intersection = len(set1.intersection(set2))
        union = len(set1.union(set2))
        return intersection / union if union > 0 else 0.0

    def check_duplicate(self, text: str, lat: float, lon: float, event_type: str, existing_reports: List[Dict]) -> Tuple[bool, Optional[str], float]:
        """
        Returns: (is_duplicate, duplicate_group_id, similarity_score)
        """
        current_hash = self.compute_text_hash(text)
        
        # 1. Exact hash check
        if current_hash in self.recent_hashes:
            return True, self.recent_hashes[current_hash], 1.0
            
        # 2. Fuzzy / Spatiotemporal comparison against existing reports
        for rep in existing_reports:
            # Check spatial proximity (< 15 km)
            dist = calculate_distance_km(lat, lon, rep.get("latitude", lat), rep.get("longitude", lon))
            if dist <= 15.0:
                # Text similarity
                similarity = self.compute_jaccard_similarity(text, rep.get("text", ""))
                if similarity >= 0.75 or (similarity >= 0.55 and rep.get("event_type") == event_type):
                    dup_id = rep.get("duplicate_group_id") or rep.get("id")
                    self.recent_hashes[current_hash] = dup_id
                    return True, dup_id, round(similarity, 3)
                    
        # No duplicate found; register hash
        new_group_id = f"DUP-{current_hash[:10]}"
        self.recent_hashes[current_hash] = new_group_id
        return False, new_group_id, 0.0

deduplicator = Deduplicator()
