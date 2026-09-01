import asyncio
import httpx
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from typing import List, Dict, Optional
from backend.app.core.config import settings

class MultiChannelNewsConnector:
    """
    Ingests live Indian weather news across multiple dedicated channels configured via .env:
    - Google News National Weather Feed
    - Times of India Disaster & Weather Feed
    - NDTV India Live Feed
    - India Today Environmental News Feed
    - Down To Earth Climate Feed
    - NewsAPI.org Endpoint (if NEWS_API_KEY is configured)
    """
    def __init__(self):
        self.api_key = settings.NEWS_API_KEY
        self.enabled_channels = [ch.strip().lower() for ch in settings.NEWS_CHANNELS.split(",")]

    async def fetch_rss_channel(self, url: str, channel_name: str, max_items: int = 8) -> List[Dict]:
        items = []
        try:
            async with httpx.AsyncClient(timeout=8.0, follow_redirects=True) as client:
                headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) VARSHANET/2.0"}
                resp = await client.get(url, headers=headers)
                if resp.status_code == 200:
                    root = ET.fromstring(resp.text)
                    channel = root.find("channel")
                    if channel is not None:
                        for item in channel.findall("item")[:max_items]:
                            raw_title = item.findtext("title", "")
                            link = item.findtext("link", "")
                            pub_date = item.findtext("pubDate", "")
                            source = item.find("source")

                            # Clean publisher extraction
                            pub_name = channel_name
                            if source is not None and source.text:
                                pub_name = source.text.strip()
                            elif " - " in raw_title:
                                parts = raw_title.rsplit(" - ", 1)
                                if len(parts) == 2 and len(parts[1].strip()) > 0:
                                    pub_name = parts[1].strip()
                                    raw_title = parts[0].strip()

                            clean_text = raw_title
                            if " - " in clean_text and clean_text.endswith(pub_name):
                                clean_text = clean_text.rsplit(" - ", 1)[0].strip()

                            if clean_text:
                                items.append({
                                    "source_id": f"news_{abs(hash(clean_text)) % 1000000}",
                                    "source_type": "rss_news",
                                    "source_name": pub_name,
                                    "author": f"{pub_name} Bureau",
                                    "text": clean_text,
                                    "url": link,
                                    "timestamp": datetime.now(timezone.utc),
                                    "raw_payload": {"pub_date": pub_date, "link": link, "channel": channel_name}
                                })
        except Exception as e:
            # Silent fallback if a specific channel network times out
            pass
        return items

    async def fetch_newsapi(self, query: str = "India weather OR flood OR rainfall OR IMD OR cyclone") -> List[Dict]:
        if not self.api_key:
            return []
        url = f"https://newsapi.org/v2/everything?q={query}&language=en&sortBy=publishedAt&pageSize=12&apiKey={self.api_key}"
        items = []
        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    data = resp.json()
                    for article in data.get("articles", []):
                        title = article.get("title", "")
                        desc = article.get("description", "")
                        combined_text = f"{title}. {desc}" if desc else title
                        pub_name = article.get("source", {}).get("name", "National News")
                        items.append({
                            "source_id": f"newsapi_{abs(hash(title)) % 1000000}",
                            "source_type": "rss_news",
                            "source_name": pub_name,
                            "author": article.get("author") or f"{pub_name} Staff",
                            "text": combined_text,
                            "url": article.get("url"),
                            "timestamp": datetime.now(timezone.utc),
                            "raw_payload": article
                        })
        except Exception as e:
            pass
        return items

    async def fetch_all_channels(self) -> List[Dict]:
        """
        Concurrently fetches live breaking news across all configured channels.
        """
        tasks = []

        # 1. Google News Weather Stream
        if "google_news" in self.enabled_channels:
            tasks.append(self.fetch_rss_channel(
                "https://news.google.com/rss/search?q=India+weather+rainfall+flood+IMD+cyclone+cloudburst&hl=en-IN&gl=IN&ceid=IN:en",
                "Google News Weather",
                max_items=12
            ))

        # 2. Times of India Feed
        if "times_of_india" in self.enabled_channels:
            tasks.append(self.fetch_rss_channel(
                "https://news.google.com/rss/search?q=site:timesofindia.indiatimes.com+weather+OR+rain+OR+flood&hl=en-IN&gl=IN&ceid=IN:en",
                "The Times of India",
                max_items=6
            ))

        # 3. NDTV India Feed
        if "ndtv" in self.enabled_channels:
            tasks.append(self.fetch_rss_channel(
                "https://news.google.com/rss/search?q=site:ndtv.com+weather+OR+rainfall+OR+IMD&hl=en-IN&gl=IN&ceid=IN:en",
                "NDTV 24x7 News",
                max_items=6
            ))

        # 4. India Today Feed
        if "india_today" in self.enabled_channels:
            tasks.append(self.fetch_rss_channel(
                "https://news.google.com/rss/search?q=site:indiatoday.in+weather+OR+flood+OR+monsoon&hl=en-IN&gl=IN&ceid=IN:en",
                "India Today",
                max_items=6
            ))

        # 5. Down To Earth Climate Feed
        if "downtoearth" in self.enabled_channels:
            tasks.append(self.fetch_rss_channel(
                "https://news.google.com/rss/search?q=site:downtoearth.org.in+monsoon+OR+flood+OR+climate&hl=en-IN&gl=IN&ceid=IN:en",
                "Down To Earth",
                max_items=5
            ))

        # 6. Official NewsAPI.org Endpoint
        if "newsapi" in self.enabled_channels and self.api_key:
            tasks.append(self.fetch_newsapi())

        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        all_news = []
        for res in results:
            if isinstance(res, list):
                all_news.extend(res)

        return all_news

    # Backwards compatibility alias
    async def fetch_live_news_rss(self, query: str = "") -> List[Dict]:
        return await self.fetch_all_channels()

news_connector = MultiChannelNewsConnector()