import asyncio
import sys, os
sys.path.insert(0, os.path.abspath("."))

from ingestion.connectors.news_api_connector import news_connector

async def main():
    items = await news_connector.fetch_live_news_rss()
    print(f"Fetched {len(items)} real-time live Indian weather news articles from live media:")
    for i, it in enumerate(items[:5]):
        print(f"\n--- [Article {i+1}] Source: {it['source_name']} ---")
        print(f"Title/Content: {it['text']}")

asyncio.run(main())