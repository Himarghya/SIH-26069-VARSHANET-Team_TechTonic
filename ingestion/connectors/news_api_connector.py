import httpx
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from typing import List, Dict, Optional
from backend.app.core.config import settings

class NewsAPIConnector:
    """
    Ingests live Indian weather news from Google News RSS with exact news publisher attribution.
    """
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.NEWS_API_KEY

    async def fetch_live_news_rss(self, query: str = "India weather rainfall flood IMD cyclone heatwave") -> List[Dict]:
        """
        Fetches real-time weather news across India via Google News RSS feed.
        Extracts exact news publisher/website name (e.g. Times of India, NDTV, The Hindu).
        """
        rss_url = f"https://news.google.com/rss/search?q={query}&hl=en-IN&gl=IN&ceid=IN:en"
        items = []
        try:
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) VARSHANET/2.0"}
                resp = await client.get(rss_url, headers=headers)
                if resp.status_code == 200:
                    root = ET.fromstring(resp.text)
                    channel = root.find("channel")
                    if channel is not None:
                        for item in channel.findall("item")[:20]:
                            raw_title = item.findtext("title", "")
                            link = item.findtext("link", "")
                            pub_date = item.findtext("pubDate", "")
                            source = item.find("source")
                            
                            # Extract exact publisher/website name
                            source_name = "Indian News Media"
                            if source is not None and source.text:
                                source_name = source.text.strip()
                            elif " - " in raw_title:
                                parts = raw_title.rsplit(" - ", 1)
                                if len(parts) == 2 and len(parts[1].strip()) > 0:
                                    source_name = parts[1].strip()
                                    raw_title = parts[0].strip()

                            # Clean up publisher suffix from article text if present
                            clean_text = raw_title
                            if " - " in clean_text and clean_text.endswith(source_name):
                                clean_text = clean_text.rsplit(" - ", 1)[0].strip()
                            
                            items.append({
                                "source_id": f"rss_{abs(hash(raw_title)) % 1000000}",
                                "source_type": "rss_news",
                                "source_name": source_name,
                                "author": f"{source_name} Bureau",
                                "text": clean_text,
                                "url": link,
                                "timestamp": datetime.now(timezone.utc),
                                "raw_payload": {"pub_date": pub_date, "link": link, "publisher": source_name}
                            })
        except Exception as e:
            print(f"Error fetching live RSS news: {e}")
        return items

    async def fetch_newsapi(self, query: str = "weather OR flood OR rainfall OR IMD") -> List[Dict]:
        if not self.api_key:
            return []
        url = f"https://newsapi.org/v2/everything?q={query}&language=en&sortBy=publishedAt&pageSize=15&apiKey={self.api_key}"
        items = []
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    data = resp.json()
                    for article in data.get("articles", []):
                        title = article.get("title", "")
                        desc = article.get("description", "")
                        combined_text = f"{title}. {desc}" if desc else title
                        pub_name = article.get("source", {}).get("name", "News Agency")
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
            print(f"Error calling NewsAPI: {e}")
        return items

news_connector = NewsAPIConnector()