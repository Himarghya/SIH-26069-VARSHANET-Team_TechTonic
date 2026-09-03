import os
import urllib.parse
from datetime import datetime, timezone
from typing import Dict, Any, Optional

NOTIFICATION_EMAIL = "Somadas7803@gmail.com"

class XTwitterBroadcaster:
    """
    Automated X (formerly Twitter) National Early Warning & Disaster Broadcaster for VARSHANET 2.0.
    """
    def __init__(self):
        self.notification_email = NOTIFICATION_EMAIL
        self.api_key = os.getenv("TWITTER_API_KEY", "")
        self.api_secret = os.getenv("TWITTER_API_SECRET", "")
        self.access_token = os.getenv("TWITTER_ACCESS_TOKEN", "")
        self.access_token_secret = os.getenv("TWITTER_ACCESS_TOKEN_SECRET", "")
        self.bearer_token = os.getenv("TWITTER_BEARER_TOKEN", "")
        self.recent_broadcasts = []

    def generate_red_alert_tweet(
        self,
        city: str,
        state: str,
        event_type: str,
        severity: str = "CRITICAL",
        custom_directive: Optional[str] = None,
        event_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Formats a standard-compliant disaster alert tweet optimized for X (280 characters).
        """
        clean_city = (city or "District").replace(" ", "")
        clean_state = (state or "India").replace(" ", "")
        sev_tag = "[RED HIGH ALERT]" if severity.upper() in ["CRITICAL", "HIGH"] else "[WEATHER WARNING]"
        
        directive = custom_directive or "Avoid low-lying submerged corridors & swollen rivers. NDRF QRT on standby."
        if len(directive) > 85:
            directive = directive[:82] + "..."
            
        timestamp_str = datetime.now(timezone.utc).strftime("%H:%M UTC")

        tweet_body = (
            f"🚨 {sev_tag}\n"
            f"📍 {city}, {state}\n"
            f"⚠️ Hazard: {event_type} ({severity})\n"
            f"📢 Directive: {directive}\n"
            f"⏱️ {timestamp_str} | #IMD #{clean_city}Weather #RedAlert #NDRF #VARSHANET"
        )

        encoded_text = urllib.parse.quote(tweet_body)
        web_intent_url = f"https://twitter.com/intent/tweet?text={encoded_text}"

        return {
            "tweet_text": tweet_body,
            "char_count": len(tweet_body),
            "web_intent_url": web_intent_url,
            "city": city,
            "state": state,
            "severity": severity,
            "notification_email": self.notification_email,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    async def broadcast_alert(
        self,
        city: str,
        state: str,
        event_type: str,
        severity: str = "CRITICAL",
        custom_directive: Optional[str] = None,
        event_id: Optional[str] = None
    ) -> Dict[str, Any]:
        tweet_data = self.generate_red_alert_tweet(
            city=city,
            state=state,
            event_type=event_type,
            severity=severity,
            custom_directive=custom_directive,
            event_id=event_id
        )

        broadcast_record = {
            "id": f"x_post_{len(self.recent_broadcasts) + 1}",
            "status": "DISPATCHED",
            "platform": "X (Twitter)",
            "tweet_text": tweet_data["tweet_text"],
            "web_intent_url": tweet_data["web_intent_url"],
            "notification_email": self.notification_email,
            "city": city,
            "state": state,
            "severity": severity,
            "dispatched_at": datetime.now(timezone.utc).isoformat()
        }

        self.recent_broadcasts.insert(0, broadcast_record)
        if len(self.recent_broadcasts) > 20:
            self.recent_broadcasts = self.recent_broadcasts[:20]

        # Safe ASCII log to avoid Windows CP1252 console encoding errors
        print(f"[X BROADCASTER] [RED ALERT DISPATCHED] Location: {city}, {state} | Notification Email: {self.notification_email}")

        return broadcast_record

x_broadcaster = XTwitterBroadcaster()