import httpx
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from typing import List, Dict, Optional
from backend.app.core.config import settings

class NewsAPIConnector:
    """
    Ingests live Indian weather news from Google News RSS (zero-key required)
    and NewsAPI.org (if NEWS_API_KEY is configured).
    """
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.NEWS_API_KEY

    async def fetch_live_news_rss(self, query: str = "India weather rainfall flood IMD cyclone") -> List[Dict]:
        """
        Fetches real-time weather news across India via Google News RSS feed.
        No API key required; connects directly to live Indian media outlets.
        """
        rss_url = f"https://news.google.com/rss/search?q={query}&hl=en-IN&gl=IN&ceid=IN:en"
        items = []
        try:
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) VARSHANET/1.0"}
                resp = await client.get(rss_url, headers=headers)
                if resp.status_code == 200:
                    root = ET.fromstring(resp.text)
                    channel = root.find("channel")
                    if channel is not None:
                        for item in channel.findall("item")[:15]:
                            title = item.findtext("title", "")
                            link = item.findtext("link", "")
                            pub_date = item.findtext("pubDate", "")
                            source = item.find("source")
                            source_name = source.text if source is not None else "Indian News Media"
                            
                            items.append({
                                "source_id": f"rss_{abs(hash(title)) % 1000000}",
                                "source_type": "rss_news",
                                "source_name": source_name,
                                "author": source_name,
                                "text": title,
                                "url": link,
                                "timestamp": datetime.now(timezone.utc),
                                "raw_payload": {"pub_date": pub_date, "link": link}
                            })
        except Exception as e:
            print(f"Error fetching live RSS news: {e}")
        return items

    async def fetch_newsapi(self, query: str = "weather OR flood OR rainfall OR IMD") -> List[Dict]:
        """
        Fetches live news using NewsAPI.org if key is present.
        """
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
                        items.append({
                            "source_id": f"newsapi_{abs(hash(title)) % 1000000}",
                            "source_type": "rss_news",
                            "source_name": article.get("source", {}).get("name", "NewsAPI Stream"),
                            "author": article.get("author") or "Journalist",
                            "text": combined_text,
                            "url": article.get("url"),
                            "timestamp": datetime.now(timezone.utc),
                            "raw_payload": article
                        })
        except Exception as e:
            print(f"Error calling NewsAPI: {e}")
        return items

news_connector = NewsAPIConnector()